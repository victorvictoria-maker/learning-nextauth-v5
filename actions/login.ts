"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (existingUser && !passwordMatch) {
    return { error: "Invalid password" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "Login successful!" };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Something went wrong, check your credentails and try again !",
      };
    }

    // return { error };

    // if (error instanceof AuthError) {
    //   console.log("Error type: ", error.type);
    //   switch (error.type) {
    //     case "CallbackRouteError":
    //       return { error: "Call back route error!" };
    //     case "InvalidCallbackUrl":
    //       return { error: "Invalid callback url!" };
    //     default:
    //       return { error: "Something went wrong!" };
    //   }
    // }

    // console.log("Error: ", error);
    throw error;
    // return null;
  }
};
