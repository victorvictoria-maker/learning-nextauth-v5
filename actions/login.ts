"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;
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
