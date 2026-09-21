import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Guard for server actions / route handlers and the admin layout. A protected
 * page is not the same as a protected mutation — call this at the top of
 * every admin mutation independently of middleware.
 *
 * The session role comes from a JWT issued at sign-in, so on its own it would
 * keep working after an admin is demoted or deleted until the token expires.
 * The role is therefore re-read from the database here; the extra query only
 * runs on admin requests.
 */
export async function requireAdmin() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!session?.user || !userId || session.user.role !== "ADMIN") {
    throw new Error("Forbidden: admin role required");
  }

  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (current?.role !== "ADMIN") {
    throw new Error("Forbidden: admin role required");
  }
  return session;
}
