// FOR VALIDATION ON BOTH FRONTEND AND BACKEND

import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  // dont use min on login password cus your requirement might change and that might affect previous users with old password
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
