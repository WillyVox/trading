import type { MetadataRoute } from 'next';
import type { ArticleType, ProviderType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { absoluteUrl } from './config';
import { STATIC_GUIDES } from '@/lib/guides/static-guides';

/**
 * Note: /compare/[slug] is intentionally excluded from the sitemap for now
 * -- pages are noindex until indexing every possible provider combination
 * has had an SEO review (Phase 8). /compare/crypto-exchanges is different:
 * it's a single, deterministic, always-complete comparison (every
 * CRYPTO_EXCHANGE provider, no combinatorial URL to generate), so it's
 * both indexed and listed below rather than programmatically generating
 * every provider-pair/triple combination just to grow sitemap size (see
 * audit rule §34).
 *
 * /crypto/[slug] is now backed by the CryptoAsset model (see cryptoAssetEntries).
 */

export async function staticEntries(): Promise<MetadataRoute.Sitemap> {
  const paths = [
    '',
    '/crypto',
    '/crypto/exchanges',
    '/guides',
    '/compare',
    '/compare/crypto-exchanges',
    '/news',
    '/methodology',
    '/methodology/editorial-policy',
    '/methodology/comparisons',
    '/affiliate-disclosure',
    '/how-we-get-paid',
    '/terms',
    '/privacy',
  ];
  return [
    ...paths.map((path) => ({ url: absoluteUrl(path) })),
    ...STATIC_GUIDES.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: new Date(guide.updatedAt),
    })),
  ];
}

export async function guideEntries(): Promise<MetadataRoute.Sitemap> {
  // `articleType` (not `category`) is what actually scopes a listing to
  // guides — see lib/articles/service.ts. `category` is a free-text topic
  // filter that a GUIDE is never guaranteed to carry the literal value
  // "guide" in, so filtering the sitemap on it silently dropped any guide
  // whose category was e.g. "how-to" or "crypto-exchanges".
  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      noIndex: false,
      articleType: 'GUIDE' satisfies ArticleType,
      slug: { notIn: STATIC_GUIDES.map((guide) => guide.slug) },
    },
    select: { slug: true, lastReviewedAt: true, publishedAt: true },
  });
  return articles.map((a) => ({
    url: absoluteUrl(`/guides/${a.slug}`),
    lastModified: a.lastReviewedAt ?? a.publishedAt ?? undefined,
  }));
}

export async function newsEntries(): Promise<MetadataRoute.Sitemap> {
  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      noIndex: false,
      articleType: 'NEWS' satisfies ArticleType,
    },
    select: { slug: true, lastReviewedAt: true, publishedAt: true },
  });
  return articles.map((a) => ({
    url: absoluteUrl(`/news/${a.slug}`),
    lastModified: a.lastReviewedAt ?? a.publishedAt ?? undefined,
  }));
}

export async function providerEntries(): Promise<MetadataRoute.Sitemap> {
  // Hardcoded to /crypto/exchanges/ below, so this MUST stay scoped to
  // CRYPTO_EXCHANGE providers only. Provider.providerType also has BROKER /
  // MULTI_ASSET_BROKER / TRADING_PLATFORM values for the planned
  // share-trading pillar — once a /share-trading/[slug] (or similar) route
  // exists, add a sibling brokerEntries() with its own URL prefix rather
  // than widening this filter, or every non-exchange provider will get a
  // sitemap URL that 404s.
  const providers = await prisma.provider.findMany({
    where: {
      noIndex: false,
      providerType: 'CRYPTO_EXCHANGE' satisfies ProviderType,
    },
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
