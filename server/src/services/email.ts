import path from "path";
import nodemailer from "nodemailer";
import fs from "fs";
import { config } from "dotenv";
config();
class STMPservice {
  //   private static otpTemplate = path.join(
  //     process.cwd(),
  //     "src",
  //     "utils",
  //     "template",
  //     "sendotp.html",
  //   );
  private static forgetpasswordtemp = path.join(
    process.cwd(),
    "src",
    "utils",
    "template",
    "forgetpassword.html",
  );
  private static EMAIL_API_URL =
    "https://emailsender-theta.vercel.app/send-email";

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

      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: process.env.EMAIL_USER,
      //     pass: process.env.EMAIL_PASS,
      //   },
      // });

      // await transporter.sendMail({
      //   from: `"BookFlex" <${process.env.EMAIL_USER}>`,
      //   to: user.email,
      //   subject: "Your OTP Code - BookFlex",
      //   text: `Hello ${user.full_name}, your OTP code is ${otpCode}`,
      //   html: htmlContent,
      // });
      const response = await fetch(this.EMAIL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: user.email,
          subject: "Your OTP Code - Adashe",
          text: `Hello ${user.full_name}, your OTP code is ${otpCode}`,
          html: htmlContent,
        }),
      });
      console.log(`OTP sent to ${user.email}`, response);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  }
}
export default STMPservice;
