import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "./config";

/**
 * Note: /compare/[slug] is intentionally excluded from the sitemap for now
 * — pages are noindex until they carry real, unique comparison content
 * rather than just provider names (see audit §N). Add it here once that
 * content exists — do not programmatically generate every provider-pair
 * combination just to grow sitemap size (see audit rule §34).
 *
 * /crypto/[slug] is now backed by the CryptoAsset model (see cryptoAssetEntries).
 */

export async function staticEntries(): Promise<MetadataRoute.Sitemap> {
  const paths = [
    "",
    "/crypto",
    "/crypto/exchanges",
    "/crypto/guides",
    "/compare",
    "/news",
    "/methodology",
    "/methodology/editorial-policy",
    "/methodology/comparisons",
    "/methodology/affiliate-disclosure",
  ];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}

export async function guideEntries(): Promise<MetadataRoute.Sitemap> {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", noIndex: false, category: "guide" },
    select: { slug: true, updatedAt: true },
  });
  return articles.map((a) => ({
    url: absoluteUrl(`/crypto/guides/${a.slug}`),
    lastModified: a.updatedAt,
  }));
}

export async function newsEntries(): Promise<MetadataRoute.Sitemap> {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", noIndex: false, category: "news" },
    select: { slug: true, updatedAt: true },
  });
  return articles.map((a) => ({
    url: absoluteUrl(`/news/${a.slug}`),
    lastModified: a.updatedAt,
  }));
}

export async function providerEntries(): Promise<MetadataRoute.Sitemap> {
  const providers = await prisma.provider.findMany({
    where: { noIndex: false },
    select: { slug: true, updatedAt: true },
  });
  return providers.map((p) => ({
    url: absoluteUrl(`/crypto/exchanges/${p.slug}`),
    lastModified: p.updatedAt,
  }));
}

export async function cryptoAssetEntries(): Promise<MetadataRoute.Sitemap> {
  const assets = await prisma.cryptoAsset.findMany({
    select: { slug: true, updatedAt: true },
  });
  return assets.map((a) => ({
    url: absoluteUrl(`/crypto/${a.slug}`),
    lastModified: a.updatedAt,
  }));
}
