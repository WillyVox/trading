import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  MAX_PASSWORD_LENGTH,
  passwordNeedsRehash,
  verifyPassword,
} from "./password";
import { getClientIp } from "@/lib/security/client-ip";
import {
  clearLoginFailures,
  isLoginThrottled,
  recordLoginFailure,
} from "@/lib/security/auth-throttle";
import { Role } from "@prisma/client";

/**
 * Verified against when the email doesn't exist, so an unknown email costs
 * the same time as a wrong password and response timing can't be used to
 * discover which emails have accounts.
 */
let dummyHash: Promise<string> | undefined;
function getDummyHash(): Promise<string> {
  dummyHash ??= hashPassword("timing-equaliser-not-a-real-password");
  return dummyHash;
}

// Credentials provider is incompatible with the "database" session
// strategy's automatic user linking, so sessions are JWT-based instead.
// The adapter is still used for Account/Session/VerificationToken tables
// in case an OAuth provider is added later alongside this one.
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Every password sign-in -- the /login form and a direct POST to
      // /api/auth/callback/credentials alike -- passes through here, which is
      // why throttling lives here rather than only in loginAction.
      async authorize(credentials, request) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password || password.length > MAX_PASSWORD_LENGTH) {
          return null;
        }

        const ip = getClientIp(request.headers);
        if (await isLoginThrottled(email, ip)) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        const storedHash = user?.passwordHash ?? (await getDummyHash());
        const valid = await verifyPassword(password, storedHash);
        if (!user?.passwordHash || !valid) {
          await recordLoginFailure(email, ip);
          return null;
        }

        await clearLoginFailures(email);

        // Upgrade hashes made with older/weaker parameters while the
        // plaintext is available. A failure here must not block the sign-in.
        if (passwordNeedsRehash(user.passwordHash)) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { passwordHash: await hashPassword(password) },
            });
          } catch (error) {
            console.error("[auth] password rehash failed", {
              userId: user.id,
              error: error instanceof Error ? error.message : "unknown error",
            });
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // `user` is only present on the sign-in request; persist what the
      // session needs onto the token for subsequent requests.
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token?.id as string) ?? "";
        session.user.role = (token.role as Role) ?? undefined;
      }
      return session;
    },
  },
};
