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
    title: "Cryptocurrency Exchanges in Australia: Fees, Features & Key Differences",
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
      "A factual 5-step walkthrough of how a cryptocurrency purchase can work in Australia — exchange research, identity checks, funding, orders and custody choices.",
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
      "A factual walkthrough of the decisions and mechanics involved in starting to invest in Australian shares, including accounts, orders, diversification and tax basics.",
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

  {
    slug: "how-the-asx-works",
    title: "How the ASX Works: Orders, Execution and Settlement",
    excerpt:
      "Learn how Australian share orders are matched, how market and limit orders differ, and what happens at settlement.",
    category: "share-trading",
    featuredImage: "/images/articles/share-trading-for-beginners.png",
    featuredImageAlt: "How ASX orders, execution and settlement work",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-24",
    updatedAt: "2026-09-24",
    source: "STATIC",
  },
  {
    slug: "how-crypto-exchanges-and-wallets-work",
    title: "How Crypto Exchanges and Wallets Work: Custody, Keys and Transfers",
    excerpt:
      "Understand crypto exchanges, custodial and self-custody wallets, private keys and transfers before comparing fees.",
    category: "crypto-exchanges",
    featuredImage:
      "/images/articles/crypto-exchange-fees-australia-explained.png",
    featuredImageAlt: "How crypto exchanges, wallets and custody work",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-24",
    updatedAt: "2026-09-24",
    source: "STATIC",
  },
  {
    slug: "brokerage-fees-australia",
    title: "Brokerage Fees in Australia: How Share Trading Costs Work",
    excerpt:
      "Understand flat, percentage, minimum and conditional brokerage before comparing Australian share trading platforms.",
    category: "share-trading",
    featuredImage: "/images/articles/share-trading-for-beginners.png",
    featuredImageAlt: "Guide to brokerage fees in Australia",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-22",
    updatedAt: "2026-09-22",
    source: "STATIC",
  },
  {
    slug: "chess-vs-custody",
    title:
      "CHESS Sponsorship vs Custody: What Australian Investors Should Understand",
    excerpt:
      "Learn how CHESS-sponsored holdings differ from custodial or omnibus structures.",
    category: "share-trading",
    featuredImage: "/images/articles/share-trading-for-beginners.png",
    featuredImageAlt: "CHESS sponsorship and custody guide",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-22",
    updatedAt: "2026-09-22",
    source: "STATIC",
  },
  {
    slug: "what-is-a-hin",
    title: "What Is a HIN? CHESS-Sponsored Share Ownership Explained",
    excerpt:
      "A plain-English explanation of Holder Identification Numbers, CHESS-sponsored holdings and SRNs.",
    category: "share-trading",
    featuredImage: "/images/articles/share-trading-for-beginners.png",
    featuredImageAlt: "Holder Identification Number guide",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-22",
    updatedAt: "2026-09-22",
    source: "STATIC",
  },
  {
    slug: "fractional-shares-australia",
    title: "Fractional Shares in Australia: Ownership, Fees and Transfers",
    excerpt:
      "Understand what it means to buy part of a share, how ownership can differ, and what to research.",
    category: "share-trading",
    featuredImage: "/images/articles/share-trading-for-beginners.png",
    featuredImageAlt: "Fractional shares in Australia guide",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-22",
    updatedAt: "2026-09-22",
    source: "STATIC",
  },
  {
    slug: "crypto-exchange-fees-australia",
    title:
      "Crypto Exchange Fees in Australia: Trading, Funding and Withdrawal Costs",
    excerpt:
      "Learn where crypto exchange costs can occur and why one headline fee rarely describes the whole transaction flow.",
    category: "crypto-exchanges",
    featuredImage:
      "/images/articles/crypto-exchange-fees-australia-explained.png",
    featuredImageAlt: "Crypto exchange fees in Australia guide",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-22",
    updatedAt: "2026-09-22",
    source: "STATIC",
  },
  {
    slug: "austrac-crypto-registration",
    title:
      "AUSTRAC's VASP Register: What Registration Means — and What It Doesn't",
    excerpt:
      "Understand Australia's public virtual asset service provider register and how to use it as one factual platform check.",
    category: "crypto-exchanges",
    featuredImage:
      "/images/articles/crypto-exchange-fees-australia-explained.png",
    featuredImageAlt: "AUSTRAC VASP register guide",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-22",
    updatedAt: "2026-09-22",
    source: "STATIC",
  },
  {
    slug: "crypto-exchange-funding-australia",
    title:
      "Funding a Crypto Exchange in Australia: Bank Transfer, PayID and Card Fees",
    excerpt:
      "Map the funding method to the published fee before comparing crypto exchange deposit costs.",
    category: "crypto-exchanges",
    featuredImage:
      "/images/articles/crypto-exchange-fees-australia-explained.png",
    featuredImageAlt: "Crypto exchange funding methods in Australia",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-22",
    updatedAt: "2026-09-22",
    source: "STATIC",
  },
  {
    slug: "trading-costs-explained",
    title:
      "The Real Cost of a Trade: Brokerage, FX, Spread and Withdrawal Fees",
    excerpt:
      "A cross-market framework for separating the costs that can occur before, during and after a trade.",
    category: "getting-started",
    featuredImage: "/images/articles/what-is-trading.svg",
    featuredImageAlt: "Trading cost components explained",
    author: "Trading Guide Editorial Team",
    publishedAt: "2026-09-22",
    updatedAt: "2026-09-22",
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
