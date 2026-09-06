import { eq, and, gt, desc } from "drizzle-orm";

import { users, passwordResetOtps } from "../db/schema";

import { hashPassword, verifyPassword } from "../utils/password";
import { generateOtp, hashOtp } from "../utils/otp";
import { db } from "../db/db";
import STMPservice from "./email";

//  REGISTER
export const registerUser = async ({
  fullName,
  email,
  phoneNumber,
  password,
}: {
  fullName: string;
  email: string;

  phoneNumber: string;
  password: string;
}) => {
  const normalizedEmail = email.toLowerCase().trim();

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      full_name: fullName.trim(),
      email: normalizedEmail,
      phone_number: phoneNumber.trim(),
      Password: passwordHash,
      role: "CUSTOMER",
    })
    .returning({
      id: users.id,
      full_name: users.full_name,
      email: users.email,
      phone_number: users.phone_number,
      role: users.role,
      createdAt: users.createdAt,
    });

  return user;
};

//  LOGIN
export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const normalizedEmail = email.toLowerCase().trim();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (!user.isActive) {
    throw new Error("ACCOUNT_DISABLED");
  }

  const passwordValid = await verifyPassword(password, user.Password);

  if (!passwordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone_number: user.phone_number,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

//  FORGOT PASSWORD CREATE OTP
export const createPasswordResetOtp = async (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const [user] = await db
    .select({
      id: users.id,
      full_name: users.full_name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  /*
   Do not reveal whether the email exists.
  */

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Generate 6 digit OTP
  const otp = generateOtp();

  // Hash OTP before storing
  const otpHash = hashOtp(otp);

  // OTP expires after 10 minutes
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  /*
   Invalidate previous unused OTPs
  */

  await db
    .update(passwordResetOtps)
    .set({
      used: true,
    })
    .where(
      and(
        eq(passwordResetOtps.userId, user.id),
        eq(passwordResetOtps.used, false),
      ),
    );

  /*
   Store new OTP
  */

  await db.insert(passwordResetOtps).values({
    userId: user.id,
    otpHash,
    expiresAt,
    attempts: 0,
    used: false,
  });

  /*
   Send OTP to user's email
  */

  await STMPservice.forgetpassword(
    {
      full_name: user.full_name,
      email: user.email,
    },
    otp,
  );

  return {
    email: user.email,
  };
};

//    VERIFY OTP
export const verifyPasswordResetOtp = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  const normalizedEmail = email.toLowerCase().trim();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (!user) {
    throw new Error("INVALID_OTP");
  }

  const [resetOtp] = await db
    .select()
    .from(passwordResetOtps)
    .where(
      and(
        eq(passwordResetOtps.userId, user.id),
        eq(passwordResetOtps.used, false),
        gt(passwordResetOtps.expiresAt, new Date()),
      ),
    )
    .orderBy(desc(passwordResetOtps.createdAt))
    .limit(1);

  if (!resetOtp) {
    throw new Error("OTP_EXPIRED");
  }

  /*
   Maximum 5 attempts
  */
  if (resetOtp.attempts >= 5) {
    throw new Error("OTP_ATTEMPTS_EXCEEDED");
  }

  const validOtp = hashOtp(otp) === resetOtp.otpHash;

  if (!validOtp) {
    await db
      .update(passwordResetOtps)
      .set({
        attempts: resetOtp.attempts + 1,
      })
      .where(eq(passwordResetOtps.id, resetOtp.id));

    throw new Error("INVALID_OTP");
  }

  return {
    userId: user.id,
    otpId: resetOtp.id,
    email: user.email,
  };
};

// RESET PASSWORD
// export const resetPassword = async ({
//   userId,
//   otpId,
//   newPassword,
//   confirmPassword,
// }: {
//   userId: string;
//   otpId: string;
//   newPassword: string;
//   confirmPassword: string;
// }) => {
//   if (newPassword !== confirmPassword) {
//     throw new Error("PASSWORDS_DO_NOT_MATCH");
//   }
//   const passwordHash = await hashPassword(newPassword);

//   await db.transaction(async (tx) => {
//     // Update password
//     await tx
//       .update(users)
//       .set({
//         Password: passwordHash,
//         updatedAt: new Date(),
//       })
//       .where(eq(users.id, userId));

//     // Mark OTP as used
//     await tx
//       .update(passwordResetOtps)
//       .set({
//         used: true,
//       })
//       .where(
//         and(
//           eq(passwordResetOtps.id, otpId),
//           eq(passwordResetOtps.userId, userId),
//           eq(passwordResetOtps.used, false),
//         ),
//       );
//   });
// };
export const resetPassword = async ({
  userId,
  otpId,
  newPassword,
  confirmPassword,
}: {
  userId: string;
  otpId: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  if (newPassword !== confirmPassword) {
    throw new Error("PASSWORDS_DO_NOT_MATCH");
  }
  const passwordHash = await hashPassword(newPassword);

  // Update password
  await db
    .update(users)
    .set({
      Password: passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  // Mark OTP as used
  await db
    .update(passwordResetOtps)
    .set({
      used: true,
    })
    .where(
      and(
        eq(passwordResetOtps.id, otpId),
        eq(passwordResetOtps.userId, userId),
        eq(passwordResetOtps.used, false),
      ),
    );
};
