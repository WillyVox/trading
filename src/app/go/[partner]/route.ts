import { NextRequest, NextResponse } from "next/server";
import {
  getActiveAffiliateLink,
  recordAffiliateClick,
} from "@/lib/affiliates/service";

/**
 * Server-side affiliate redirect. Never redirects to an arbitrary
 * user-supplied URL — only to a stored approvedUrl on an ACTIVE link.
 * Records the click before redirecting.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ partner: string }> }
) {
  const { partner } = await params;
  const link = await getActiveAffiliateLink(partner);
  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ?placement=compare (etc.) lets a specific surface tag its own clicks
  // distinctly in the admin click report -- e.g. the compare table vs. a
  // profile page CTA both point at the same AffiliateLink but shouldn't
  // look identical in AffiliateClick. Falls back to the link's own stored
  // placement when the caller doesn't specify one.
  const placementOverride = req.nextUrl.searchParams.get("placement");

  await recordAffiliateClick(link.id, {
    sourcePage: req.headers.get("referer") ?? undefined,
    placement: placementOverride ?? link.placement ?? undefined,
    campaign: link.campaign ?? undefined,
  });

  return NextResponse.redirect(link.approvedUrl);
}
