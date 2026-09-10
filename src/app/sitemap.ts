import type { MetadataRoute } from "next";
import { staticEntries, guideEntries, newsEntries, providerEntries } from "@/lib/seo/sitemap-entries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [statics, guides, news, providers] = await Promise.all([
    staticEntries(),
    guideEntries(),
    newsEntries(),
    providerEntries(),
  ]);

  return [...statics, ...guides, ...news, ...providers];
}
