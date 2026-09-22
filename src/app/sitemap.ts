import type { MetadataRoute } from "next";
import {
  staticEntries,
  guideEntries,
  newsEntries,
  providerEntries,
  cryptoAssetEntries,
  offeringEntries,
} from "@/lib/seo/sitemap-entries";
import { safeDatabaseQuery } from "@/lib/data/safe-database-query";

// Force this to run at request time (ISR-style, cached for an hour) rather
// than being prerendered during `next build`. A DB-backed sitemap that
// tries to query the database at build time is a classic Vercel-only
// failure mode: the build container's network/env can differ from the
// deployed function's (DATABASE_URL not set for the Build environment,
// DB firewalled to only allow the app's runtime IPs, etc.) even though
// `next build` succeeds fine locally against the same database.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static entries do not depend on PostgreSQL and remain useful during an
  // outage. Dynamic entries are all-or-nothing here: returning only the
  // static sitemap is safer than failing the sitemap endpoint entirely.
  const statics = await staticEntries();
  const dynamicEntries = await safeDatabaseQuery("sitemap.dynamicEntries", () =>
    Promise.all([
      guideEntries(),
      newsEntries(),
      providerEntries(),
      cryptoAssetEntries(),
      offeringEntries(),
    ]),
  );

  if (!dynamicEntries.ok) return statics;

  const [guides, news, providers, cryptoAssets, offerings] =
    dynamicEntries.data;
  return [
    ...statics,
    ...guides,
    ...news,
    ...providers,
    ...cryptoAssets,
    ...offerings,
  ];
}
