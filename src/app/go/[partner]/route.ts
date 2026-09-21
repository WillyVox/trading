import { NextRequest, NextResponse } from "next/server";
import {
  getActiveAffiliateLink,
  recordAffiliateClick,
} from "@/lib/affiliates/service";
import {
  normaliseReferrer,
  sanitizePlacement,
  shouldRecordClick,
} from "@/lib/affiliates/click-input";

const PARTNER_SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_PARTNER_SLUG_LENGTH = 100;

function notFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

/**
 * Server-side affiliate redirect. Never redirects to an arbitrary
 * user-supplied URL — only to the stored approvedUrl of an active link
 * whose partnership is live (see getActiveAffiliateLink). Records the click
 * before redirecting.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ partner: string }> }
) {
  const { partner } = await params;
  if (
    partner.length > MAX_PARTNER_SLUG_LENGTH ||
    !PARTNER_SLUG_PATTERN.test(partner)
  ) {
    return notFound();
  }

  const link = await getActiveAffiliateLink(partner);
  if (!link) return notFound();

  // approvedUrl is checked as https when created in the admin, but seed
  // files and direct database edits don't go through that check, so it is
  // verified again at the point of redirecting.
  let destination: URL;
  try {
    destination = new URL(link.approvedUrl);
  } catch {
    console.error("[affiliate] approvedUrl is not a valid URL", {
      partnerSlug: link.partnerSlug,
    });
    return notFound();
  }
  if (destination.protocol !== "https:") {
    console.error(
      "[affiliate] approvedUrl is not https; refusing to redirect",
      { partnerSlug: link.partnerSlug }
    );
    return notFound();
  }

  if (shouldRecordClick(req.headers)) {
    // ?placement=compare (etc.) lets a specific surface tag its own clicks
    // distinctly in the admin click report -- e.g. the compare table vs. a
    // profile page CTA both point at the same AffiliateLink but shouldn't
    // look identical in AffiliateClick. Values that aren't a short
    // identifier are ignored, falling back to the link's own placement.
    const placement =
      sanitizePlacement(req.nextUrl.searchParams.get("placement")) ??
      link.placement ??
      undefined;

    try {
      await recordAffiliateClick(link.id, {
        sourcePage: normaliseReferrer(req.headers.get("referer")),
        placement,
        campaign: link.campaign ?? undefined,
      });
    } catch (error) {
      // A failure to log the click must not strand the visitor on an error
      // page: the redirect still happens, and the failure is logged so it
      // shows up in monitoring rather than silently under-counting.
      console.error("[affiliate] failed to record click", {
        partnerSlug: link.partnerSlug,
        error: error instanceof Error ? error.message : "unknown error",
      });
    }
  }

  const response = NextResponse.redirect(destination, 307);
  // A redirect that is cached would skip click recording on later visits.
  response.headers.set("Cache-Control", "no-store");
  return response;
}
