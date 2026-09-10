import { absoluteUrl } from "./config";

/**
 * Resolve the canonical URL for a page. Respects an admin-provided override
 * (e.g. Article.canonicalUrl); otherwise derives it from the site-relative
 * path. Never includes query parameters — callers should not pass any.
 */
export function canonicalUrl(path: string, override?: string | null): string {
  if (override && override.trim().length > 0) {
    return override.startsWith("http") ? override : absoluteUrl(override);
  }
  return absoluteUrl(path);
}

/**
 * Comparison pages are reachable as both "a-vs-b" and "b-vs-a". Alphabetical
 * ordering owns the canonical URL so the two never compete as duplicate
 * content (see Phase 0 audit, §G).
 */
export function canonicalCompareSlug(slugA: string, slugB: string): string {
  return [slugA, slugB].sort((a, b) => a.localeCompare(b)).join("-vs-");
}

export function isCanonicalCompareSlug(slug: string): boolean {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return true; // not a pair slug — nothing to canonicalize
  const [a, b] = parts;
  return canonicalCompareSlug(a, b) === slug;
}

const REGION_HREFLANG: Record<string, string> = {
  AU: "en-AU",
  UK: "en-GB",
  US: "en-US",
  NZ: "en-NZ",
  SG: "en-SG",
};

/** Region code (e.g. "AU") -> hreflang tag. Falls back to the bare code for regions not yet in the map, rather than guessing. */
export function regionHreflang(region: string): string {
  return REGION_HREFLANG[region.toUpperCase()] ?? region.toLowerCase();
}
