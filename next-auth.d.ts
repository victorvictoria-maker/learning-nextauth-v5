import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

// so we can type some parts of the session
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
