import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { safeDatabaseQuery } from "@/lib/data/safe-database-query";

export const dynamic = "force-dynamic";

/**
 * Minimal operational health check. Never expose database hosts, URLs,
 * credentials, query text or Prisma error messages to callers.
 */
export async function GET() {
  const database = await safeDatabaseQuery("health.database", async () => {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  });

  if (!database.ok) {
    return NextResponse.json(
      { status: "degraded", database: "unavailable" },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  return NextResponse.json(
    { status: "healthy", database: "available" },
    { headers: { "Cache-Control": "no-store" } }
  );
}
