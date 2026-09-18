import path from "path";

import fs from "fs";
import { config } from "dotenv";
import { Resend } from "resend";
import { env } from "../env";
import { users } from "../db/schema";
import { db } from "../db/db";
import { eq } from "drizzle-orm";

const resend = new Resend(env.RESEND_API_KEY);
config();
class STMPservice {
  private static applicationTemplate = path.join(
    process.cwd(),
    "src",
    "utils",
    "template",
    "application-success.html",
  );
  private static contactTemplate = path.join(
    process.cwd(),
    "src",
    "utils",
    "template",
    "contact-form.html",
  );

  private static atiMembershipTemplate = path.join(
    process.cwd(),
    "src",
    "utils",
    "template",
    "ati-membership-success.html",
  );

  private static forgetpasswordtemp = path.join(
    process.cwd(),
    "src",
    "utils",
    "template",
    "forgetpassword.html",
  );
  private static propertyPaymentPendingTemplate = path.join(
    process.cwd(),
    "src",
    "utils",
    "template",
    "property-payment-pending.html",
  );

  private static propertyPaymentApprovedTemplate = path.join(
    process.cwd(),
    "src",
    "utils",
    "template",
    "property-payment-approved.html",
  );

  private static propertyPaymentRejectedTemplate = path.join(
    process.cwd(),
    "src",
    "utils",
    "template",
    "property-payment-rejected.html",
  );

  private static from =
    process.env.EMAIL_FROM || "Adashè to Plot <hello@adashetoplot.org>";

  private static async getAdminEmails(): Promise<string[]> {
    const admins = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.role, "ADMIN"));
    return admins
      .map((admin) => admin.email)
      .filter((email): email is string => Boolean(email));
  }

  public static async applicationSuccess(
    user: {
      full_name: string;
      email: string;
    },
    data: {
      applicationId: string;
      paymentReference: string;
      amount: number;
    },
  ) {
    try {
      const htmlContent = fs
        .readFileSync(this.applicationTemplate, "utf-8")
        .replace(/{{full_name}}/g, user.full_name)
        .replace(/{{application_id}}/g, data.applicationId)
        .replace(/{{payment_reference}}/g, data.paymentReference)
        .replace(/{{amount}}/g, data.amount.toLocaleString())
        .replace(/{{year}}/g, new Date().getFullYear().toString());

      const { data: email, error } = await resend.emails.send({
        from: this.from,
        to: user.email,
        subject: "Your Land Application Has Been Submitted",
        html: htmlContent,
        text: `Hello ${user.full_name}, your land application has been successfully submitted and your application fee payment has been confirmed.`,
      });

      if (error) {
        console.error("Application email error:", error);
        return;
      }

      console.log(`Application confirmation sent to ${user.email}`, email);
    } catch (error) {
      console.error("Error sending application email:", error);
    }
  }

  public static async atiMembershipSuccess(
    user: {
      full_name: string;
      email: string;
    },
    data: {
      amount: number;
      startDate: Date;
      expiryDate: Date;
    },
  ) {
    try {
      const htmlContent = fs
        .readFileSync(this.atiMembershipTemplate, "utf-8")
        .replace(/{{full_name}}/g, user.full_name)
        .replace(/{{amount}}/g, data.amount.toLocaleString())
        .replace(
          /{{start_date}}/g,
          data.startDate.toLocaleDateString("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        )
        .replace(
          /{{expiry_date}}/g,
          data.expiryDate.toLocaleDateString("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        )
        .replace(/{{year}}/g, new Date().getFullYear().toString());

      const { data: email, error } = await resend.emails.send({
        from: this.from,
        to: user.email,
        subject: "Welcome to ATI Plus — Membership Activated",
        html: htmlContent,
        text: `Hello ${user.full_name}, your ATI Plus membership has been successfully activated for 12 months.`,
      });

      if (error) {
        console.error("ATI membership email error:", error);
        return;
      }

      console.log(`ATI membership email sent to ${user.email}`, email);
    } catch (error) {
      console.error("Error sending ATI membership email:", error);
    }
  }
  public static async forgetpassword(
    user: { full_name: string; email: string },
    otpCode: string,
  ) {
    try {
      const htmlContent = fs
        .readFileSync(this.forgetpasswordtemp, "utf-8")
        .replace(/{{otp_code}}/g, otpCode)
        .replace(/{{full_name}}/g, user.full_name)
        .replace(/{{year}}/g, new Date().getFullYear().toString())
        .replace(/{{company_name}}/g, "Adashe");

      const { data: email, error } = await resend.emails.send({
        from: this.from,
        to: user.email,
        subject: "Your Password Reset Code - Adashè to Plot",
        html: htmlContent,
        text: `Hello ${user.full_name}, your password reset OTP is ${otpCode}. This code will expire shortly.`,
      });

      if (error) {
        console.error("Password reset email error:", error);
        return;
      }

      console.log(`Password reset OTP sent to ${user.email}`, email);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  }

  public static async propertyPaymentPending(data: {
    customerName: string;
    customerEmail: string;
    propertyLocation: string;
    estateName: string;
    amount: number;
    verificationId: string;
    purchaseId: string;
    receiptUrl: string;
  }) {
    try {
      const htmlContent = fs
        .readFileSync(this.propertyPaymentPendingTemplate, "utf-8")
        .replace(/{{customer_name}}/g, data.customerName)
        .replace(/{{customer_email}}/g, data.customerEmail)
        .replace(/{{property_name}}/g, data.estateName)
        .replace(/{{estate_name}}/g, data.estateName)
        .replace(/{{amount}}/g, data.amount.toLocaleString("en-NG"))
        .replace(/{{verification_id}}/g, data.verificationId)
        .replace(/{{purchase_id}}/g, data.purchaseId)
        .replace(/{{receipt_url}}/g, data.receiptUrl)
        .replace(/{{year}}/g, new Date().getFullYear().toString());
      const adminEmails = await this.getAdminEmails();
      if (adminEmails.length === 0) {
        console.error("No ADMIN users found in database.");
        return;
      }
      const { data: email, error } = await resend.emails.send({
        from: this.from,
        to: adminEmails,
        subject: `New Property Payment Receipt — ₦${data.amount.toLocaleString("en-NG")}`,
        html: htmlContent,
        text: `
A new property payment receipt has been submitted.

Customer: ${data.customerName}
Email: ${data.customerEmail}
Estate: ${data.estateName}
 Property Location: ${data.propertyLocation}
Amount: ₦${data.amount.toLocaleString("en-NG")}
Verification ID: ${data.verificationId}

Review the payment from the admin dashboard.
      `,
      });

      if (error) {
        console.error("Property payment admin email error:", error);
        return;
      }

      console.log(`Property payment notification sent to admin`, email);
    } catch (error) {
      console.error("Error sending property payment admin email:", error);
    }
  }

  public static async propertyPaymentApproved(
    user: {
      full_name: string;
      email: string;
    },
    data: {
      propertyLocation: string;
      estateName: string;
      amount: number;
      amountPaid: number;
      balance: number;
      verificationId: string;
    },
  ) {
    try {
      let html = fs.readFileSync(this.propertyPaymentApprovedTemplate, "utf-8");

      html = html
        .replace(/{{customer_name}}/g, user.full_name)
        .replace(/{{property_location}}/g, data.propertyLocation)
        .replace(/{{estate_name}}/g, data.estateName)
        .replace(/{{amount}}/g, data.amount.toLocaleString())
        .replace(/{{amount_paid}}/g, data.amountPaid.toLocaleString())
        .replace(/{{balance}}/g, data.balance.toLocaleString())
        .replace(/{{verification_id}}/g, data.verificationId);

      await resend.emails.send({
        from: this.from,
        to: user.email,
        subject: "Property Payment Approved — Adashè to Plot",
        html,
        text: `
Hello ${user.full_name},

Your property payment has been approved.

Estate: ${data.estateName}
Property Location: ${data.propertyLocation}
Payment Approved: ₦${data.amount.toLocaleString()}
Total Paid: ₦${data.amountPaid.toLocaleString()}
Remaining Balance: ₦${data.balance.toLocaleString()}

Verification ID: ${data.verificationId}

Thank you,
Adashè to Plot
      `,
      });
    } catch (error) {
      console.error("PROPERTY PAYMENT APPROVED EMAIL ERROR:", error);

      throw error;
    }
  }
  public static async propertyPaymentRejected(
    user: {
      full_name: string;
      email: string;
    },
    data: {
      propertyLocation: string;
      estateName: string;
      amount: number;
      rejectionReason: string;
      verificationId: string;
    },
  ) {
    try {
      let html = fs.readFileSync(this.propertyPaymentRejectedTemplate, "utf-8");

      html = html
        .replace(/{{customer_name}}/g, user.full_name)
        .replace(/{{property_location}}/g, data.propertyLocation)
        .replace(/{{estate_name}}/g, data.estateName)
        .replace(/{{amount}}/g, data.amount.toLocaleString())
        .replace(/{{rejection_reason}}/g, data.rejectionReason)
        .replace(/{{verification_id}}/g, data.verificationId);

      await resend.emails.send({
        from: this.from,
        to: user.email,
        subject: "Property Payment Rejected — Adashè to Plot",
        html,
        text: `
Hello ${user.full_name},

Your property payment could not be approved.

Estate: ${data.estateName}
Property Location: ${data.propertyLocation}
Amount Submitted: ₦${data.amount.toLocaleString()}

Reason:
${data.rejectionReason}

Verification ID: ${data.verificationId}

Please review the reason and submit a new receipt if necessary.

Thank you,
Adashè to Plot
      `,
      });
    } catch (error) {
      console.error("PROPERTY PAYMENT REJECTED EMAIL ERROR:", error);

      throw error;
    }
  }

  public static async contactFormSubmitted(data: {
    fullName: string;
    phoneNumber: string;
    email: string;
    message: string;
  }) {
    try {
      const htmlContent = fs
        .readFileSync(this.contactTemplate, "utf-8")
        .replace(/{{full_name}}/g, data.fullName)
        .replace(/{{phone_number}}/g, data.phoneNumber)
        .replace(/{{email}}/g, data.email)
        .replace(/{{message}}/g, data.message)
        .replace(/{{year}}/g, new Date().getFullYear().toString());
      const adminEmails = await this.getAdminEmails();
      if (adminEmails.length === 0) {
        console.error("No ADMIN users found in database.");
        return;
      }
      const { data: email, error } = await resend.emails.send({
        from: this.from,
        subject: `New Contact Message — ${data.fullName}`,
        to: adminEmails,
        html: htmlContent,
        text: `
New Contact Form Message

Full Name: ${data.fullName}
Phone Number: ${data.phoneNumber}
Email: ${data.email}

Message:
${data.message}

You can reply directly to ${data.email}.`,
      });
    } catch (error) {
      console.error("CONTACT FORM EMAIL ERROR:", error);

      throw error;
    }
  }
}
export default STMPservice;
