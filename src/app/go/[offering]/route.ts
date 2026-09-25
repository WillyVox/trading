import { NextRequest, NextResponse } from "next/server";
import {
  getActiveAffiliateEngagement,
  recordAffiliateEvent,
} from "@/lib/affiliates/service";
import {
  normaliseReferrer,
  sanitizePlacement,
  shouldRecordClick,
} from "@/lib/affiliates/click-input";
import { safeDatabaseQuery } from "@/lib/data/safe-database-query";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
function notFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

/** Canonical commercial redirect: /go/{offeringSlug}. */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ offering: string }> }
) {
  const { offering: slug } = await params;
  if (slug.length > 100 || !SLUG_PATTERN.test(slug)) return notFound();

  const engagementResult = await safeDatabaseQuery(
    "affiliate.getActiveEngagement",
    () => getActiveAffiliateEngagement(slug)
  );
  if (!engagementResult.ok)
    return NextResponse.json(
      { error: "Partner link temporarily unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );

  const engagement = engagementResult.data;
  if (engagement) {
    let destination: URL;
    try {
      destination = new URL(engagement.destinationUrl);
    } catch {
      return notFound();
    }
    if (destination.protocol !== "https:") return notFound();
    const placement =
      sanitizePlacement(req.nextUrl.searchParams.get("placement")) ?? undefined;
    if (shouldRecordClick(req.headers)) {
      try {
        await recordAffiliateEvent(engagement.id, {
          sourcePage: normaliseReferrer(req.headers.get("referer")),
          placement,
          campaign: engagement.campaignReference ?? undefined,
        });
      } catch (error) {
        console.error("[affiliate] failed to record engagement event", {
          offeringSlug: slug,
          error: error instanceof Error ? error.message : "unknown error",
        });
      }
    }
    const response = NextResponse.redirect(destination, 307);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  return notFound();
}
