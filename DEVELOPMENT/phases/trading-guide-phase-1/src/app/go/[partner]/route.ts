import { NextRequest, NextResponse } from "next/server";
import { getActiveAffiliateLink, recordAffiliateClick } from "@/lib/affiliates/service";

/**
 * Server-side affiliate redirect. Never redirects to an arbitrary
 * user-supplied URL — only to a stored approvedUrl on an ACTIVE link.
 * Records the click before redirecting.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ partner: string }> }) {
  const { partner } = await params;
  const link = await getActiveAffiliateLink(partner);
  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await recordAffiliateClick(link.id, {
    sourcePage: req.headers.get("referer") ?? undefined,
    placement: link.placement ?? undefined,
    campaign: link.campaign ?? undefined,
  });

  return NextResponse.redirect(link.approvedUrl);
}
