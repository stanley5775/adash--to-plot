import { eq, and, desc, gt, or } from "drizzle-orm";
import { db } from "../db/db";
import type { Context } from "hono";

import {
  properties,
  PropertyPaymentPlan,
  propertyPurchases,
  users,
  estateNames,
  atiMemberships,
  propertyInstallments,
  propertyPaymentVerifications,
} from "../db/schema";

import { uploadImage } from "../services/uploadImage";
import STMPservice from "../services/email";

/*
 CUSTOMER
  Create a property purchase.
 */

export const createPropertyPurchase = async (c: Context) => {
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

    const { propertyId, paymentPlanId } = body;

    if (!propertyId || !paymentPlanId) {
      return c.json(
        {
          success: false,
          message: "propertyId and paymentPlanId are required",
        },
        400,
      );
    }

    /**
     * Get payment plan + property.
     */
    const [plan] = await db
      .select({
        plan: PropertyPaymentPlan,
        property: properties,
      })
      .from(PropertyPaymentPlan)
      .innerJoin(properties, eq(PropertyPaymentPlan.propertyId, properties.id))
      .where(
        and(
          eq(PropertyPaymentPlan.id, paymentPlanId),
          eq(PropertyPaymentPlan.propertyId, propertyId),
        ),
      )
      .limit(1);

    if (!plan) {
      return c.json(
        {
          success: false,
          message: "Payment plan not found",
        },
        404,
      );
    }

    /**
     * Only active properties can be purchased.
     */
    if (plan.property.status !== "ACTIVE") {
      return c.json(
        {
          success: false,
          message: "Property is not available for purchase",
        },
        400,
      );
    }

    /**
     * Check for an existing purchase for this property + payment plan.
     */
    const [existingPurchase] = await db
      .select()
      .from(propertyPurchases)
      .where(
        and(
          eq(propertyPurchases.userId, userId),
          eq(propertyPurchases.propertyId, propertyId),
          eq(propertyPurchases.paymentPlanId, paymentPlanId),
        ),
      )
      .limit(1);

    /**
     * If a purchase already exists, reuse it.
     *
     * This is important because a rejected receipt does NOT mean
     * the property purchase itself is cancelled.
     *
     * Example:
     *
     * Purchase
     *   └── Receipt #1 → REJECTED
     *   └── Receipt #2 → PENDING
     */
    if (existingPurchase) {
      if (
        existingPurchase.status === "PENDING" ||
        existingPurchase.status === "ACTIVE"
      ) {
        return c.json(
          {
            success: true,
            message: "Existing property purchase found",
            data: {
              purchase: existingPurchase,
              existing: true,
            },
          },
          200,
        );
      }

      /**
       * Completed purchases cannot be reused.
       */
      if (existingPurchase.status === "COMPLETED") {
        return c.json(
          {
            success: false,
            message: "This property purchase has already been completed",
          },
          409,
        );
      }

      /**
       * Cancelled purchases can be handled separately.
       *
       * If you want customers to be able to start a completely
       * new purchase after cancellation, continue below and
       * create a new purchase.
       */
    }
    /**
     * Convert Drizzle numeric values from strings to numbers.
     */
    const originalTotalPayable = Number(plan.plan.totalAmount);

    const originalPaymentAmount = Number(
      plan.plan.monthlyAmount ?? plan.plan.totalAmount,
    );

    const durationMonths = Number(plan.plan.durationMonths ?? 0);

    const propertyPrice = Number(plan.property.startingPrice);

    if (!Number.isFinite(propertyPrice) || propertyPrice <= 0) {
      return c.json(
        {
          success: false,
          message: "Invalid property price",
        },
        422,
      );
    }

    if (!Number.isFinite(originalTotalPayable) || originalTotalPayable <= 0) {
      return c.json(
        {
          success: false,
          message: "Invalid payment plan total amount",
        },
        422,
      );
    }

    if (!Number.isFinite(originalPaymentAmount) || originalPaymentAmount <= 0) {
      return c.json(
        {
          success: false,
          message: "Invalid payment plan payment amount",
        },
        422,
      );
    }

    if (!Number.isInteger(durationMonths) || durationMonths < 0) {
      return c.json(
        {
          success: false,
          message: "Invalid payment plan duration",
        },
        422,
      );
    }

    /**
     * ============================================================
     * ATI PLUS DISCOUNT
     * ============================================================
     *
     * Check the user's membership from the database.
     *
     * ATI Plus members receive 5% discount.
     */
    const [activeATI] = await db
      .select({
        id: atiMemberships.id,
      })
      .from(atiMemberships)
      .where(
        and(
          eq(atiMemberships.userId, userId),
          eq(atiMemberships.status, "ACTIVE"),
          eq(atiMemberships.ATI_membership, true),
          gt(atiMemberships.expiryDate, new Date()),
        ),
      )
      .limit(1);

    const hasATIDiscount = !!activeATI;

    const discountPercentage = hasATIDiscount ? 5 : 0;

    const discountAmount = hasATIDiscount
      ? Number((originalTotalPayable * 0.05).toFixed(2))
      : 0;

    /**
     * Final amount customer actually needs to pay.
     */
    const totalPayable = Number(
      (originalTotalPayable - discountAmount).toFixed(2),
    );

    /**
     * For installment plans, calculate the monthly payment
     * from the discounted total.
     *
     * Example:
     *
     * ₦3,000,000
     * 5% discount = ₦150,000
     * Final = ₦2,850,000
     *
     * 12 months:
     * ₦2,850,000 / 12 = ₦237,500
     */
    const paymentAmount =
      durationMonths > 0
        ? Number((totalPayable / durationMonths).toFixed(2))
        : totalPayable;

    /**
     * Create purchase.
     *
     * Drizzle numeric fields expect strings.
     */
    const [purchase] = await db
      .insert(propertyPurchases)
      .values({
        userId,
        propertyId,
        paymentPlanId,

        propertyPrice: propertyPrice.toFixed(2),

        totalPayable: totalPayable.toFixed(2),

        amountPaid: "0.00",

        balance: totalPayable.toFixed(2),

        durationMonths,

        paymentAmount: paymentAmount.toFixed(2),

        interestPercentage: plan.plan.interestRate,

        status: "PENDING",
      })
      .returning();

    if (!purchase) {
      return c.json(
        {
          success: false,
          message: "Failed to create property purchase",
        },
        500,
      );
    }

    /**
     * Generate installments for installment plans.
     *
     * The final installment is adjusted to handle
     * decimal rounding.
     */
    if (durationMonths > 0) {
      const now = new Date();

      const roundedMonthlyAmount = Number(paymentAmount.toFixed(2));

      const installments = Array.from(
        { length: durationMonths },
        (_, index) => {
          const installmentNumber = index + 1;

          const dueDate = new Date(now);

          dueDate.setMonth(now.getMonth() + installmentNumber);

          let installmentAmount = roundedMonthlyAmount;

          /**
           * Final installment receives the exact remaining balance.
           */
          if (installmentNumber === durationMonths) {
            const amountBeforeLast =
              roundedMonthlyAmount * (durationMonths - 1);

            installmentAmount = Number(
              (totalPayable - amountBeforeLast).toFixed(2),
            );
          }

          return {
            purchaseId: purchase.id,
            installmentNumber,
            amount: installmentAmount.toFixed(2),
            dueDate,
            status: "PENDING" as const,
          };
        },
      );

      await db.insert(propertyInstallments).values(installments);
    }

    return c.json(
      {
        success: true,
        message: hasATIDiscount
          ? "Purchase created successfully with 5% ATI Plus discount"
          : "Purchase created successfully",
        data: {
          purchase,
          pricing: {
            originalAmount: originalTotalPayable,
            discountPercentage,
            discountAmount,
            totalPayable,
            hasATIDiscount,
            paymentAmount,
            durationMonths,
          },
        },
      },
      201,
    );
  } catch (error) {
    console.error("CREATE PROPERTY PURCHASE ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to create property purchase",
      },
      500,
    );
  }
};

export const submitPropertyPaymentReceipt = async (c: Context) => {
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

    const body = await c.req.parseBody();

    const purchaseId = body.purchaseId as string;
    const amount = Number(body.amount);
    const receipt = body.receipt;

    if (!purchaseId || !body.amount || !receipt) {
      return c.json(
        {
          success: false,
          message: "purchaseId, amount and receipt are required",
        },
        400,
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return c.json(
        {
          success: false,
          message: "Payment amount must be greater than zero",
        },
        400,
      );
    }

    if (!(receipt instanceof File)) {
      return c.json(
        {
          success: false,
          message: "Invalid receipt file",
        },
        400,
      );
    }

    /**
     * Get purchase + property + estate.
     */
    const [purchaseData] = await db
      .select({
        purchase: propertyPurchases,

        property: {
          id: properties.id,
          location: properties.location,
        },

        estate: {
          id: estateNames.id,
          name: estateNames.name,
        },
      })
      .from(propertyPurchases)
      .innerJoin(properties, eq(propertyPurchases.propertyId, properties.id))
      .innerJoin(estateNames, eq(properties.estateId, estateNames.id))
      .where(
        and(
          eq(propertyPurchases.id, purchaseId),
          eq(propertyPurchases.userId, userId),
        ),
      )
      .limit(1);

    if (!purchaseData) {
      return c.json(
        {
          success: false,
          message: "Purchase not found",
        },
        404,
      );
    }

    const purchase = purchaseData.purchase;

    /**
     * Completed/cancelled purchases cannot receive payments.
     */
    if (purchase.status === "COMPLETED" || purchase.status === "CANCELLED") {
      return c.json(
        {
          success: false,
          message: "This purchase cannot receive payments",
        },
        400,
      );
    }

    /**
     * Prevent multiple pending receipts.
     */
    const [pendingVerification] = await db
      .select()
      .from(propertyPaymentVerifications)
      .where(
        and(
          eq(propertyPaymentVerifications.purchaseId, purchaseId),
          eq(propertyPaymentVerifications.status, "PENDING"),
        ),
      )
      .limit(1);

    if (pendingVerification) {
      return c.json(
        {
          success: false,
          message:
            "You already have a payment receipt waiting for verification",
        },
        409,
      );
    }

    const currentBalance = Number(purchase.balance);

    /**
     * Payment cannot exceed remaining balance.
     */
    if (amount > currentBalance) {
      return c.json(
        {
          success: false,
          message: `Amount cannot exceed remaining balance of ${purchase.balance}`,
        },
        400,
      );
    }

    /**
     * Installment plans must pay the exact
     * next installment amount.
     */
    if (purchase.durationMonths > 0) {
      const [nextInstallment] = await db
        .select()
        .from(propertyInstallments)
        .where(
          and(
            eq(propertyInstallments.purchaseId, purchaseId),
            eq(propertyInstallments.status, "PENDING"),
          ),
        )
        .orderBy(propertyInstallments.installmentNumber)
        .limit(1);

      if (!nextInstallment) {
        return c.json(
          {
            success: false,
            message: "No pending installment found",
          },
          400,
        );
      }

      const requiredAmount = Number(nextInstallment.amount);

      /**
       * Avoid floating-point comparison problems.
       */
      const submittedAmount = Number(amount.toFixed(2));

      if (submittedAmount !== requiredAmount) {
        return c.json(
          {
            success: false,
            message: `Please pay the required installment amount of ${nextInstallment.amount}`,
          },
          400,
        );
      }
    }

    /**
     * Upload receipt to Cloudinary.
     */
    const uploaded = await uploadImage(receipt);

    const [verification] = await db
      .insert(propertyPaymentVerifications)
      .values({
        purchaseId,
        userId,
        amount: amount.toFixed(2),
        receiptUrl: uploaded.url,
        receiptPublicId: uploaded.publicId,
        status: "PENDING",
      })
      .returning();
    console.log(verification, "verification");
    if (!verification) {
      return c.json(
        {
          success: false,
          message: "Failed to create payment verification",
        },
        500,
      );
    }

    /**
     * Get customer information.
     */
    const [customer] = await db
      .select({
        fullName: users.full_name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    /**
     * Notify admin.
     */
    if (customer) {
      try {
        await STMPservice.propertyPaymentPending({
          customerName: customer.fullName,
          customerEmail: customer.email,

          propertyLocation: purchaseData.property.location,

          estateName: purchaseData.estate.name,

          amount,

          verificationId: verification.id,

          purchaseId,

          receiptUrl: uploaded.url,
        });
      } catch (emailError) {
        console.error("PROPERTY PAYMENT ADMIN EMAIL ERROR:", emailError);
      }
    }

    return c.json(
      {
        success: true,
        message:
          "Payment receipt submitted successfully and is awaiting verification",

        data: {
          verification,

          amountPaid: purchase.amountPaid,

          balance: purchase.balance,
        },
      },
      201,
    );
  } catch (error) {
    console.error("SUBMIT PROPERTY PAYMENT RECEIPT ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to submit payment receipt",
      },
      500,
    );
  }
};
export const getMyPropertyPurchase = async (c: Context) => {
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

    const propertyId = c.req.param("propertyId");

    if (!propertyId) {
      return c.json(
        {
          success: false,
          message: "Property ID is required",
        },
        400,
      );
    }

    const [purchase] = await db
      .select()
      .from(propertyPurchases)
      .where(
        and(
          eq(propertyPurchases.userId, authUser.id),
          eq(propertyPurchases.propertyId, propertyId),
          or(
            eq(propertyPurchases.status, "PENDING"),
            eq(propertyPurchases.status, "ACTIVE"),
          ),
        ),
      )
      .orderBy(desc(propertyPurchases.createdAt))
      .limit(1);

    return c.json({
      success: true,
      data: {
        purchase: purchase ?? null,
      },
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Failed to fetch property purchase",
      },
      500,
    );
  }
};
