/**
 * Single source of truth for site-wide SEO identity. Every other module in
 * src/lib/seo/ reads from this instead of hard-coding domains, names, or
 * locale strings.
 */

// NEXT_PUBLIC_SITE_URL is the preferred production URL source (explicit,
// never a dev/auth URL). Falls back to NEXTAUTH_URL for compatibility with
// the existing .env, then to localhost only outside production.
//
// This used to silently fall back all the way to localhost even in
// production if the env var was missing on the deploy target (e.g. not set
// in Vercel's project settings) — that produces a sitemap.xml full of
// http://localhost:3000/... URLs with no error at all. Fail loudly instead:
// a broken build is much easier to catch than a silently-wrong sitemap
// that Search Console won't complain about for weeks.
function resolveDomain(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL;
  if (explicit) return explicit;
  if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL (or NEXTAUTH_URL) is not set in this deployment's environment variables. " +
        "Set it in the Vercel project settings — without it, absoluteUrl() would silently fall back to localhost."
    );
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "AusMarket Crypto",
  shortName: "AusMarket",
  domain: resolveDomain(),
  description:
    "Independent, source-linked crypto exchange comparisons and guides for Australia.",
  locale: "en_AU",
  language: "en-AU",
  country: "AU",
  titleTemplate: "%s | AusMarket Crypto",
  defaultTitle: "AusMarket Crypto — Independent Crypto Exchange Research for Australia",
  // No real social profiles exist yet — never fabricate sameAs entries.
  sameAs: [] as string[],
} as const;

/** Build an absolute URL from a site-relative path using siteConfig.domain. */
export function absoluteUrl(path: string = "/"): string {
  const base = siteConfig.domain.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}
