import type { MetadataRoute } from "next";
import {
  staticEntries,
  guideEntries,
  newsEntries,
  providerEntries,
  cryptoAssetEntries,
} from "@/lib/seo/sitemap-entries";

// Force this to run at request time (ISR-style, cached for an hour) rather
// than being prerendered during `next build`. A DB-backed sitemap that
// tries to query the database at build time is a classic Vercel-only
// failure mode: the build container's network/env can differ from the
// deployed function's (DATABASE_URL not set for the Build environment,
// DB firewalled to only allow the app's runtime IPs, etc.) even though
// `next build` succeeds fine locally against the same database.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [statics, guides, news, providers, cryptoAssets] = await Promise.all([
    staticEntries(),
    guideEntries(),
    newsEntries(),
    providerEntries(),
    cryptoAssetEntries(),
  ]);

  return [...statics, ...guides, ...news, ...providers, ...cryptoAssets];
}
