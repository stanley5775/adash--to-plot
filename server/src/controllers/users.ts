import type { Context } from "hono";
import { z } from "zod";
import { db } from "../db/db";
import {
  properties,
  propertiesImage,
  PropertyPaymentPlan,
  estateNames,
  payments,
  applicationSchema,
  users,
} from "../db/schema";

import { and, eq } from "drizzle-orm";
import {
  createLandApplicationSchema,
  verifyPaymentSchema,
} from "../validators/createLandApplicationSchema ";
import { env } from "../env";
import STMPservice from "../services/email";
export const verifyApplicationPayment = async (c: Context) => {
  try {
    // 1. Get reference sent by frontend
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

    // 2. Find our local payment
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

    // 3. Make sure this is an application payment
    if (payment.type !== "LAND_APPLICATION_FEE") {
      return c.json(
        {
          success: false,
          message: "Invalid application payment",
        },
        400,
      );
    }

    // 4. Make sure payment is linked to an application
    if (!payment.applicationId) {
      return c.json(
        {
          success: false,
          message: "Payment is not linked to an application",
        },
        400,
      );
    }

    // Now TypeScript knows this is a string
    const applicationId = payment.applicationId;

    // 5. Prevent processing the same payment twice
    if (payment.status === "SUCCESSFUL") {
      return c.json({
        success: true,
        message: "Payment already verified",
        data: {
          reference: payment.reference,
          status: "success",
          applicationId,
        },
      });
    }

    // 6. Verify directly with Paystack
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

    console.log(transaction, "coming from Paystack");

    // 7. Check actual Paystack transaction status
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

    // 8. Make sure the reference belongs to this payment
    if (transaction.reference !== payment.reference) {
      return c.json(
        {
          success: false,
          message: "Payment reference mismatch",
        },
        400,
      );
    }

    // 9. Verify amount
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

    // 10. Verify currency
    if (transaction.currency !== "NGN") {
      return c.json(
        {
          success: false,
          message: "Invalid payment currency",
        },
        400,
      );
    }

    const paidAt = new Date();

    // 11. Update payment
    await db
      .update(payments)
      .set({
        status: "SUCCESSFUL",
        paidAt,
        currency: "NGN",
        reference: payment.reference,
        amount: transaction.amount,
      })
      .where(eq(payments.id, payment.id));

    // 12. Update application
    await db
      .update(applicationSchema)
      .set({
        status: "PAID",
        updatedAt: paidAt,
        isApplication: true,
      })
      .where(eq(applicationSchema.id, applicationId));

    // 13. Get user for email
    const [user] = await db
      .select({
        full_name: users.full_name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, payment.userId))
      .limit(1);

    // 14. Send application success email
    if (user) {
      await STMPservice.applicationSuccess(
        {
          full_name: user.full_name,
          email: user.email,
        },
        {
          applicationId,
          paymentReference: transaction.reference,
          amount: transaction.amount / 100,
        },
      );
    }

    // 15. Tell frontend payment is confirmed
    return c.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        reference: transaction.reference,
        transactionId: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        channel: transaction.channel,
        applicationId,
      },
    });
  } catch (error) {
    console.error("Verify application payment error:", error);

    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500,
    );
  }
};

export const createApplication = async (c: Context) => {
  try {
    // 1. Get request body
    const body = await c.req.json();
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
    // 2. Validate application data
    const result = createLandApplicationSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Invalid application data",
          errors: result.error.flatten(),
        },
        400,
      );
    }

    const data = result.data;

    // 3. Check if user already has a submitted application
    const existingApplication = await db
      .select({
        id: applicationSchema.id,
        isApplication: applicationSchema.isApplication,
        status: applicationSchema.status,
      })
      .from(applicationSchema)
      .where(eq(applicationSchema.email, data.email))
      .limit(1);

    if (
      existingApplication.length > 0 &&
      existingApplication[0].isApplication === true
    ) {
      return c.json(
        {
          success: false,
          message: "You have already submitted an application.",
          data: {
            applicationId: existingApplication[0].id,
            status: existingApplication[0].status,
            isApplication: true,
          },
        },
        409,
      );
    }

    // 4. Check estate exists
    const [estate] = await db
      .select({
        id: estateNames.id,
        estateName: estateNames.name,
      })
      .from(estateNames)
      .where(eq(estateNames.id, data.estate))
      .limit(1);

    if (!estate) {
      return c.json(
        {
          success: false,
          message: "Selected estate does not exist",
        },
        404,
      );
    }

    // 5. Create application
    const [application] = await db
      .insert(applicationSchema)
      .values({
        userId: userId,
        surname: data.surname,
        firstName: data.firstName,
        middleName: data.middleName,

        sex: data.sex,
        residentialAddress: data.residentialAddress,
        dateOfBirth: data.dateOfBirth,
        nationality: data.nationality,
        stateOfOrigin: data.stateOfOrigin,

        phone1: data.phone1,
        phone2: data.phone2,
        email: data.email,

        occupation: data.occupation,
        officeAddress: data.officeAddress,

        nextOfKinName: data.nextOfKinName,
        nextOfKinRelationship: data.nextOfKinRelationship,
        nextOfKinPhone: data.nextOfKinPhone,
        nextOfKinAddress: data.nextOfKinAddress,

        isCorporate: data.isCorporate,
        businessName: data.businessName,
        rcNumber: data.rcNumber,
        companyAddress: data.companyAddress,
        natureOfBusiness: data.natureOfBusiness,
        companyPhone: data.companyPhone,
        companyEmail: data.companyEmail,

        referralSource: data.referralSource,
        referralOther: data.referralOther,

        estate: data.estate,

        plotSize: data.plotSize,
        paymentOption: data.paymentOption,
        acquisitionPurpose: data.acquisitionPurpose,

        status: "PENDING_PAYMENT",
        isApplication: false,
      })
      .returning();

    // 6. Generate Paystack reference
    const reference = `APP-${application.id}-${Date.now()}`;

    // ₦20,000 = 2,000,000 kobo
    const amount = 2_000_000;

    // 7. Create pending payment
    const [payment] = await db
      .insert(payments)
      .values({
        userId,
        applicationId: application.id,
        reference,
        amount,
        currency: "NGN",
        status: "PENDING",
        type: "LAND_APPLICATION_FEE",
        provider: "PAYSTACK",
      })
      .returning();

    // 8. Return application + payment details
    return c.json(
      {
        success: true,
        message: "Application created successfully",
        data: {
          applicationId: application.id,
          paymentId: payment.id,
          reference: payment.reference,
          amount: 20000,
          email: application.email,
          status: application.status,
        },
      },
      201,
    );
  } catch (error) {
    console.error("Create application error:", error);

    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500,
    );
  }
};
export const checkApplication = async (c: Context) => {
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

    const [application] = await db
      .select({
        id: applicationSchema.id,
        isApplication: applicationSchema.isApplication,
        status: applicationSchema.status,
      })
      .from(applicationSchema)
      .where(eq(applicationSchema.userId, userId))
      .limit(1);

    return c.json({
      success: true,
      data: {
        isApplication: application?.isApplication === true,
        applicationId: application?.id ?? null,
        status: application?.status ?? null,
      },
    });
  } catch (error) {
    console.error("Check application error:", error);

    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500,
    );
  }
};

export const getMe = async (c: Context) => {
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

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        full_name: users.full_name,
        phone_number: users.phone_number,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        404,
      );
    }

    return c.json(
      {
        success: true,
        message: "User fetched successfully",
        data: user,
      },
      200,
    );
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch user",
        data: null,
      },
      500,
    );
  }
};
