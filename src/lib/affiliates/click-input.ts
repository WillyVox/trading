/**
 * Input handling for /go/[partner] click recording. Kept free of Next.js and
 * Prisma imports so it can be unit-tested directly.
 *
 * Everything a visitor can influence (the ?placement= query, the Referer
 * header, the User-Agent) is untrusted: it is validated or trimmed here
 * before anything is written to AffiliateClick.
 */

type HeaderReader = { get(name: string): string | null };

/** Placement labels are short identifiers such as "compare" or "ArticleDetails". Anything else is dropped and the link's own stored placement is used instead. */
const PLACEMENT_PATTERN = /^[A-Za-z0-9_-]{1,40}$/;

export function sanitizePlacement(
  raw: string | null | undefined
): string | undefined {
  if (!raw) return undefined;
  return PLACEMENT_PATTERN.test(raw) ? raw : undefined;
}

const MAX_REFERRER_LENGTH = 300;

/**
 * Keeps only origin + path of the referring page. Query strings and
 * fragments can carry tokens or personal data and add nothing to a
 * "which page did the click come from" report.
 */
export function normaliseReferrer(
  raw: string | null | undefined
): string | undefined {
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return `${url.origin}${url.pathname}`.slice(0, MAX_REFERRER_LENGTH);
  } catch {
    return undefined;
  }
}

/** Browser/router prefetches aren't clicks: counting them would inflate the report without a person ever choosing to visit the partner. */
export function isPrefetchRequest(headers: HeaderReader): boolean {
  const purpose = headers.get("purpose")?.toLowerCase();
  const secPurpose = headers.get("sec-purpose")?.toLowerCase();
  return (
    purpose === "prefetch" ||
    Boolean(secPurpose?.includes("prefetch")) ||
    headers.get("next-router-prefetch") !== null ||
    headers.get("x-moz")?.toLowerCase() === "prefetch"
  );
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|headless|facebookexternalhit|curl|wget|python-requests|httpclient|go-http-client/i;

/**
 * Coarse filter for obvious automated traffic (and link-preview fetchers).
 * A missing User-Agent is treated as automated because every real browser
 * sends one. This is a first line only -- a determined script can spoof a
 * browser UA, so high-volume abuse still needs an edge rate limit (see
 * docs/SECURITY.md).
 */
export function isLikelyBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true;
  return BOT_PATTERN.test(userAgent);
}

export function shouldRecordClick(headers: HeaderReader): boolean {
  return !isPrefetchRequest(headers) && !isLikelyBot(headers.get("user-agent"));
}
