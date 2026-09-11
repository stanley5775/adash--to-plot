import path from "path";

import fs from "fs";
import { config } from "dotenv";

import { Resend } from "resend";
import { env } from "../env";
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

  private static from =
    process.env.EMAIL_FROM || "Adashè to Plot <hello@adashetoplot.org>";
  // private static EMAIL_API_URL =
  //   "https://emailsender-theta.vercel.app/send-email";
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

      // const response = await fetch(this.EMAIL_API_URL, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     to: user.email,
      //     subject: "Your OTP Code - Adashe",
      //     text: `Hello ${user.full_name}, your OTP code is ${otpCode}`,
      //     html: htmlContent,
      //   }),
      // });
      // console.log(`OTP sent to ${user.email}`, response);
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
}
export default STMPservice;
