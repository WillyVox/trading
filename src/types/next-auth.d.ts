import type { DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";

/**
 * Teach Auth.js about the `id` and `role` we put on the JWT / session in
 * src/lib/auth/config.ts, so callers read `session.user.role` as a typed
 * value instead of casting `session.user` to `any`.
 */
declare module "next-auth" {
  interface User {
    role?: Role;
  }

  interface Session {
    user: {
      id?: string;
      role?: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}
