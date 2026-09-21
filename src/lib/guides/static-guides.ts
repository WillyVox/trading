import {
  getStaticGuideArticleImage,
  STATIC_SLUG_IDS,
} from "./static-article-slugs";

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
  source: "STATIC";
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
    title: "Top Cryptocurrency Exchanges in Australia: What to Compare in 2026",
    excerpt:
      "Learn how cryptocurrency exchanges in Australia differ on trading fees, AUD funding, supported assets, security and AUSTRAC registration, with source-linked information for beginners.",
    category: "crypto-exchanges",
    featuredImage: getStaticGuideArticleImage(
      STATIC_SLUG_IDS.TOP_CRYPTO_EXCHANGES
    ),
    featuredImageAlt:
      "Factors Australians can compare when researching cryptocurrency exchanges",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-17",
    updatedAt: "2026-09-17",
    source: "STATIC",
  },
  {
    slug: STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO,
    title: "5 Simple Steps to Buy Cryptocurrency (Beginner's Guide)",
    excerpt:
      "A clear, 5-step walkthrough for buying your first cryptocurrency in Australia — choosing an exchange, verifying your identity, funding your account, buying, and storing it safely.",
    category: "getting-started",
    featuredImage: getStaticGuideArticleImage(
      STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO
    ),
    featuredImageAlt:
      "Five-step beginner process for buying cryptocurrency in Australia",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-15",
    updatedAt: "2026-09-15",
    source: "STATIC",
  },
  {
    slug: STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO,
    title: "How to Start Investing in Crypto for Beginners",
    excerpt:
      "A beginner's guide to investing in crypto responsibly — understanding the asset class, sizing your risk, researching before you buy, avoiding scams, and thinking about tax.",
    category: "getting-started",
    featuredImage: getStaticGuideArticleImage(
      STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO
    ),
    featuredImageAlt:
      "Beginner guide to researching cryptocurrency before investing",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-15",
    updatedAt: "2026-09-15",
    source: "STATIC",
  },
  {
    slug: STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS,
    title: "Share Trading for Beginners: How to Start Investing in Shares",
    excerpt:
      "A plain-English guide to share trading for Australian beginners — how the share market works, what it costs, the risks to understand, and how to place your first trade.",
    category: "share-trading",
    featuredImage: getStaticGuideArticleImage(
      STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS
    ),
    featuredImageAlt:
      "Beginner guide to share trading and investing in Australia",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-15",
    updatedAt: "2026-09-15",
    source: "STATIC",
  },
  {
    slug: STATIC_SLUG_IDS.OPEN_SHARE_TRADING_ACCOUNT,
    title: "How to Open an Online Share Trading Account in Australia",
    excerpt:
      "The step-by-step process for opening an online share trading account — ID verification, choosing between a HIN and a custodian model, linking your bank account, and placing your first trade.",
    category: "share-trading",
    featuredImage: getStaticGuideArticleImage(
      STATIC_SLUG_IDS.OPEN_SHARE_TRADING_ACCOUNT
    ),
    featuredImageAlt:
      "Step-by-step process for opening an online share trading account in Australia",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-19",
    updatedAt: "2026-09-19",
    source: "STATIC",
  },
  {
    slug: STATIC_SLUG_IDS.STEPS_TO_START_INVESTING_IN_SHARES,
    title: "Steps to Start Investing in Shares in Australia",
    excerpt:
      "The full path to investing in Australian shares — setting your goal, choosing a broker, making your first purchase, diversifying, and building a regular investing habit.",
    category: "share-trading",
    featuredImage: getStaticGuideArticleImage(
      STATIC_SLUG_IDS.STEPS_TO_START_INVESTING_IN_SHARES
    ),
    featuredImageAlt:
      "The steps a beginner follows to start investing in shares in Australia",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-19",
    updatedAt: "2026-09-19",
    source: "STATIC",
  },
  {
    slug: STATIC_SLUG_IDS.WHAT_IS_TRADING,
    title: "What Is Trading? A Beginner's Guide for Australians",
    excerpt:
      "What is trading? Learn how buying and selling shares, ETFs and crypto works, the main trading styles, what it costs, the risks, and how trading differs from investing.",
    category: "getting-started",
    featuredImage: getStaticGuideArticleImage(STATIC_SLUG_IDS.WHAT_IS_TRADING),
    featuredImageAlt:
      "Diagram of how a trade travels from an investor through a broker to an exchange",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-21",
    updatedAt: "2026-09-21",
    source: "STATIC",
  },
  {
    slug: STATIC_SLUG_IDS.WHAT_YOU_NEED_TO_START_TRADING,
    title: "What You Need to Start Trading: 10-Point Checklist",
    excerpt:
      "Before your first trade: money, knowledge, broker and plan. A plain-English 10-point checklist for Australian beginners on what to prepare first.",
    category: "getting-started",
    featuredImage: getStaticGuideArticleImage(
      STATIC_SLUG_IDS.WHAT_YOU_NEED_TO_START_TRADING
    ),
    featuredImageAlt:
      "Ten-point checklist for getting ready to start trading in Australia",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-21",
    updatedAt: "2026-09-21",
    source: "STATIC",
  },
] as const satisfies readonly StaticGuideSummary[];

export const STATIC_GUIDE_SLUGS = new Set<string>(
  STATIC_GUIDES.map((guide) => guide.slug)
);

export function isStaticGuideSlug(slug: string): boolean {
  return STATIC_GUIDE_SLUGS.has(slug);
}

export function getStaticGuides(
  category?: string | string[]
): StaticGuideSummary[] {
  const categories = Array.isArray(category)
    ? category
    : category
      ? [category]
      : [];

  return STATIC_GUIDES.filter(
    (guide) => categories.length === 0 || categories.includes(guide.category)
  ).map((guide) => ({ ...guide }));
}

export function getStaticGuideCategories(): string[] {
  return [...new Set(STATIC_GUIDES.map((guide) => guide.category))].sort();
}
