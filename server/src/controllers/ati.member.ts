import { and, eq, desc } from "drizzle-orm";
import { atiMemberships, payments, users } from "../db/schema";
import { Context } from "hono";
import { db } from "../db/db";
import { verifyPaymentSchema } from "../validators/createLandApplicationSchema ";
import { env } from "../env";
import STMPservice from "../services/email";

export const createAtiMembership = async (c: Context) => {
  try {
    const authUser = c.get("userId");

    if (!authUser) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const userId = authUser.id;

    const ATI_FEE = 20_000;
    const amount = ATI_FEE * 100; // Paystack uses kobo

    // Check if user already has an active membership
    const [activeMembership] = await db
      .select()
      .from(atiMemberships)
      .where(
        and(
          eq(atiMemberships.userId, userId),
          eq(atiMemberships.status, "ACTIVE"),
        ),
      )
      .limit(1);

    if (activeMembership) {
      const now = new Date();

      // Still active
      if (activeMembership.expiryDate && activeMembership.expiryDate > now) {
        return c.json(
          {
            success: false,
            message: "You already have an active ATI membership.",
            data: {
              membershipId: activeMembership.id,
              status: activeMembership.status,
              expiryDate: activeMembership.expiryDate,
            },
          },
          409,
        );
      }

      // Membership has expired
      await db
        .update(atiMemberships)
        .set({
          status: "EXPIRED",
          ATI_membership: false,
          updatedAt: new Date(),
        })
        .where(eq(atiMemberships.id, activeMembership.id));
    }

    // Create a new membership payment record
    const [membership] = await db
      .insert(atiMemberships)
      .values({
        userId,
        status: "PENDING",
        ATI_membership: false,
      })
      .returning();

    // Generate unique Paystack reference
    const reference = `ATI-${membership.id}-${Date.now()}`;

    // Save payment in payment history
    const [payment] = await db
      .insert(payments)
      .values({
        userId,
        membershipId: membership.id,
        reference,
        amount,
        currency: "NGN",
        status: "PENDING",
        type: "ATI_MEMBERSHIP",
        provider: "PAYSTACK",
      })
      .returning();

    return c.json(
      {
        success: true,
        message: "ATI membership payment created",
        data: {
          membershipId: membership.id,
          paymentId: payment.id,
          reference: payment.reference,
          amount: ATI_FEE,
          status: membership.status,
        },
      },
      201,
    );
  } catch (error) {
    console.error("Create ATI membership error:", error);

    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500,
    );
  }
};

export const verifyAtiMembershipPayment = async (c: Context) => {
  try {
    const authUser = c.get("userId");

    if (!authUser) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const userId = authUser.id;

    const body = await c.req.json();

    const result = verifyPaymentSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Invalid payment reference",
          errors: result.error.flatten(),
        },
        400,
      );
    }

    const { reference } = result.data;

    // Find payment
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.reference, reference))
      .limit(1);

    if (!payment) {
      return c.json(
        {
          success: false,
          message: "Payment record not found",
        },
        404,
      );
    }

    // Make sure this payment is actually ATI
    if (payment.type !== "ATI_MEMBERSHIP") {
      return c.json(
        {
          success: false,
          message: "Invalid ATI membership payment",
        },
        400,
      );
    }

    if (!payment.membershipId) {
      return c.json(
        {
          success: false,
          message: "Membership payment is not linked to a membership",
        },
        400,
      );
    }

    // Get membership
    const [membership] = await db
      .select()
      .from(atiMemberships)
      .where(
        and(
          eq(atiMemberships.id, payment.membershipId),
          eq(atiMemberships.userId, userId),
        ),
      )
      .limit(1);

    if (!membership) {
      return c.json(
        {
          success: false,
          message: "ATI membership not found",
        },
        404,
      );
    }

    // Already paid
    if (payment.status === "SUCCESSFUL") {
      return c.json({
        success: true,
        message: "ATI membership payment already verified",
        data: {
          membershipId: membership.id,
          reference: payment.reference,
          status: membership.status,
          expiryDate: membership.expiryDate,
        },
      });
    }

    // Verify with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference,
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const paystackResult = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackResult.status) {
      return c.json(
        {
          success: false,
          message: "Unable to verify payment with Paystack",
        },
        502,
      );
    }

    const transaction = paystackResult.data;

    // Payment must be successful
    if (transaction.status !== "success") {
      return c.json(
        {
          success: false,
          message: "Payment was not successful",
          data: {
            reference: transaction.reference,
            status: transaction.status,
          },
        },
        400,
      );
    }

    // Reference must match
    if (transaction.reference !== payment.reference) {
      return c.json(
        {
          success: false,
          message: "Payment reference mismatch",
        },
        400,
      );
    }

    // ₦20,000 = 2,000,000 kobo
    if (transaction.amount !== 2_000_000) {
      return c.json(
        {
          success: false,
          message: "Payment amount mismatch",
        },
        400,
      );
    }

    if (transaction.currency !== "NGN") {
      return c.json(
        {
          success: false,
          message: "Invalid payment currency",
        },
        400,
      );
    }

    // Membership starts now
    const startDate = new Date();

    // Expires exactly one year from now
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Update payment
    await db
      .update(payments)
      .set({
        status: "SUCCESSFUL",
        paidAt: startDate,
        currency: "NGN",
        amount: transaction.amount,
      })
      .where(eq(payments.id, payment.id));

    // Activate membership
    await db
      .update(atiMemberships)
      .set({
        status: "ACTIVE",
        ATI_membership: true,
        startDate,
        expiryDate,
        updatedAt: new Date(),
      })
      .where(eq(atiMemberships.id, membership.id));

    const [user] = await db
      .select({
        full_name: users.full_name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (user) {
      await STMPservice.atiMembershipSuccess(
        {
          full_name: user.full_name,
          email: user.email,
        },
        {
          amount: transaction.amount / 100,
          startDate,
          expiryDate,
        },
      );
    }
    return c.json({
      success: true,
      message: "ATI membership activated successfully",
      data: {
        membershipId: membership.id,
        paymentId: payment.id,
        reference: transaction.reference,
        transactionId: transaction.id,
        status: "ACTIVE",
        amount: transaction.amount,
        currency: transaction.currency,
        startDate,
        expiryDate,
      },
    });
  } catch (error) {
    console.error("Verify ATI membership payment error:", error);

    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500,
    );
  }
};

export const checkAtiMembership = async (c: Context) => {
  try {
    const authUser = c.get("userId");

    if (!authUser) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const userId = authUser.id;

    const [membership] = await db
      .select({
        id: atiMemberships.id,
        status: atiMemberships.status,
        ATI_membership: atiMemberships.ATI_membership,
        startDate: atiMemberships.startDate,
        expiryDate: atiMemberships.expiryDate,
      })
      .from(atiMemberships)
      .where(eq(atiMemberships.userId, userId))
      .orderBy(desc(atiMemberships.createdAt))
      .limit(1);

    // User has never purchased ATI
    if (!membership) {
      return c.json({
        success: true,
        data: {
          isMember: false,
          membershipId: null,
          status: null,
          startDate: null,
          expiryDate: null,
        },
      });
    }

    const now = new Date();

    // Check if an ACTIVE membership has expired
    if (
      membership.status === "ACTIVE" &&
      membership.expiryDate &&
      membership.expiryDate <= now
    ) {
      await db
        .update(atiMemberships)
        .set({
          status: "EXPIRED",
          ATI_membership: false,
          updatedAt: now,
        })
        .where(eq(atiMemberships.id, membership.id));

      return c.json({
        success: true,
        data: {
          isMember: false,
          membershipId: membership.id,
          status: "EXPIRED",
          startDate: membership.startDate,
          expiryDate: membership.expiryDate,
        },
      });
    }

    const isMember =
      membership.status === "ACTIVE" &&
      membership.ATI_membership === true &&
      !!membership.expiryDate &&
      membership.expiryDate > now;

    return c.json({
      success: true,
      data: {
        isMember,
        membershipId: membership.id,
        status: membership.status,
        startDate: membership.startDate,
        expiryDate: membership.expiryDate,
      },
    });
  } catch (error) {
    console.error("Check ATI membership error:", error);

    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500,
    );
  }
};
