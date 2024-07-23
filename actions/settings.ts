"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { CurrentUser } from "@/lib/auth";
import { getUserByEmail, getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await CurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const userInDb = await getUserById(user.id);
  if (!userInDb) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    // users that log in with oauth cant modify the items below
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && userInDb.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      userInDb.password
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: userInDb.id },
    data: {
      ...values,
    },
  });

  return { success: "Settings Updated!" };
};
