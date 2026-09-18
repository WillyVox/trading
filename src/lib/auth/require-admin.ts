import { auth } from "@/lib/auth";

/**
 * Guard for server actions / route handlers. A protected page is not the
 * same as a protected mutation — call this at the top of every admin
 * mutation independently of middleware.
 */
export async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || role !== "ADMIN") {
    throw new Error("Forbidden: admin role required");
  }
  return session;
}
