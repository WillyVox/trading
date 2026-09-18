import {
  getStaticGuideArticleImage,
  STATIC_SLUG_IDS,
} from './static-article-slugs';

export type StaticGuideSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  source: 'STATIC';
};

/**
 * Single registry for hand-authored flagship guides.
 *
 * Routing is still handled natively by Next.js via explicit
 * /guides/<slug>/page.tsx routes. This registry exists for discovery:
 * /guides listings, category filters, sitemap generation and preventing
 * CMS articles from claiming a slug that an explicit route already owns.
 */
export const STATIC_GUIDES = [
  {
    slug: STATIC_SLUG_IDS.TOP_CRYPTO_EXCHANGES,
    title: 'Top Cryptocurrency Exchanges in Australia: What to Compare in 2026',
    excerpt:
      'Learn how cryptocurrency exchanges in Australia differ on trading fees, AUD funding, supported assets, security and AUSTRAC registration, with source-linked information for beginners.',
    category: 'crypto-exchanges',
    featuredImage: getStaticGuideArticleImage(
      STATIC_SLUG_IDS.TOP_CRYPTO_EXCHANGES
    ),
    featuredImageAlt:
      'Factors Australians can compare when researching cryptocurrency exchanges',
    author: 'Trading Guide Editorial Team',
    publishedAt: '2026-09-17',
    updatedAt: '2026-09-17',
    source: 'STATIC',
  },
  {
    slug: STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO,
    title: "5 Simple Steps to Buy Cryptocurrency (Beginner's Guide)",
    excerpt:
      'A clear, 5-step walkthrough for buying your first cryptocurrency in Australia — choosing an exchange, verifying your identity, funding your account, buying, and storing it safely.',
    category: 'getting-started',
    featuredImage: getStaticGuideArticleImage(
      STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO
    ),
    featuredImageAlt:
      'Five-step beginner process for buying cryptocurrency in Australia',
    author: 'Trading Guide Editorial Team',
    publishedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    source: 'STATIC',
  },
  {
    slug: STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO,
    title: 'How to Start Investing in Crypto for Beginners',
    excerpt:
      "A beginner's guide to investing in crypto responsibly — understanding the asset class, sizing your risk, researching before you buy, avoiding scams, and thinking about tax.",
    category: 'getting-started',
    featuredImage: getStaticGuideArticleImage(
      STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO
    ),
    featuredImageAlt:
      'Beginner guide to researching cryptocurrency before investing',
    author: 'Trading Guide Editorial Team',
    publishedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    source: 'STATIC',
  },
  {
    slug: STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS,
    title: 'Share Trading for Beginners: How to Start Investing in Shares',
    excerpt:
      'A plain-English guide to share trading for Australian beginners — how the share market works, what it costs, the risks to understand, and how to place your first trade.',
    category: 'share-trading',
    featuredImage: getStaticGuideArticleImage(
      STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS
    ),
    featuredImageAlt:
      'Beginner guide to share trading and investing in Australia',
    author: 'Trading Guide Editorial Team',
    publishedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    source: 'STATIC',
  },
] as const satisfies readonly StaticGuideSummary[];

export const STATIC_GUIDE_SLUGS = new Set<string>(
  STATIC_GUIDES.map((guide) => guide.slug)
);

export function isStaticGuideSlug(slug: string): boolean {
  return STATIC_GUIDE_SLUGS.has(slug);
}

export function getStaticGuides(category?: string): StaticGuideSummary[] {
  return STATIC_GUIDES.filter(
    (guide) => !category || guide.category === category
  ).map((guide) => ({ ...guide }));
}

export function getStaticGuideCategories(): string[] {
  return [...new Set(STATIC_GUIDES.map((guide) => guide.category))].sort();
}
