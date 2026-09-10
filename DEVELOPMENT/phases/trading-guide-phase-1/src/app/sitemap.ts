import type { MetadataRoute } from "next";
import {
  staticEntries,
  guideEntries,
  newsEntries,
  providerEntries,
  cryptoAssetEntries,
} from "@/lib/seo/sitemap-entries";

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
