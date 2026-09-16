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
 * Comparison pages are reachable in any URL order (e.g. "a-vs-b-vs-c" and
 * "c-vs-a-vs-b" refer to the same comparison). Alphabetical ordering owns
 * the canonical URL for any number of providers so permutations never
 * compete as duplicate content (see Phase 0 audit, §G; generalized in
 * Phase 5 to support 3+-way comparisons).
 */
export function canonicalCompareSlugMulti(slugs: string[]): string {
  return [...slugs].sort((a, b) => a.localeCompare(b)).join("-vs-");
}

/** @deprecated kept for two-way call sites; prefer canonicalCompareSlugMulti. */
export function canonicalCompareSlug(slugA: string, slugB: string): string {
  return canonicalCompareSlugMulti([slugA, slugB]);
}

export function isCanonicalCompareSlug(slug: string): boolean {
  const parts = slug.split("-vs-").filter(Boolean);
  if (parts.length < 2) return true; // not a multi-provider slug — nothing to canonicalize
  return canonicalCompareSlugMulti(parts) === slug;
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
