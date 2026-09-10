/**
 * Single source of truth for site-wide SEO identity. Every other module in
 * src/lib/seo/ reads from this instead of hard-coding domains, names, or
 * locale strings.
 */
export const siteConfig = {
  name: "AusMarket Crypto",
  shortName: "AusMarket",
  // NEXT_PUBLIC_SITE_URL is the preferred production URL source (explicit,
  // never a dev/auth URL). Falls back to NEXTAUTH_URL for compatibility with
  // the existing .env, then to localhost only for local dev.
  domain:
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000",
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
