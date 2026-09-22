import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { safeDatabaseQuery } from "@/lib/data/safe-database-query";

export async function GET() {
  const database = await safeDatabaseQuery("health.database", async () => {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  });
  const healthy = database.ok;
  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      database: healthy ? "available" : "unavailable",
    },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } }
  );
}
