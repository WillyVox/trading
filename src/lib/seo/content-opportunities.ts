export type ContentCluster = "share-trading" | "crypto" | "cross-market";
export type ContentPriority =
  "BUILD_NOW" | "BUILD_NEXT" | "LATER" | "DO_NOT_BUILD";
export type ContentFormat =
  "guide" | "comparison" | "tool-support" | "provider-research" | "how-to";
export type ContentIntent =
  | "LEARN"
  | "HOW_TO"
  | "BEGINNER"
  | "COMPARISON"
  | "FEES"
  | "OWNERSHIP"
  | "REGULATION"
  | "SECURITY"
  | "FUNDING"
  | "TAX_CONTEXT";

export interface ContentOpportunity {
  id: string;
  cluster: ContentCluster;
  priority: ContentPriority;
  format: ContentFormat;
  intent: ContentIntent;
  workingTitle: string;
  targetPath?: string;
  rationale: string;
  evidenceNeeded: string[];
  supports: string[];
}

/**
 * Editorial roadmap, not an automatic page generator.
 *
 * BUILD_NOW/NEXT entries are candidates for researched, editor-reviewed pages.
 * LATER entries need stronger demand/evidence or a larger provider catalogue.
 * DO_NOT_BUILD records prevent tempting but low-value/unsafe programmatic SEO ideas
 * from quietly reappearing in future roadmaps.
 */
export const CONTENT_OPPORTUNITIES: readonly ContentOpportunity[] = [
  {
    id: "share-brokerage-fees",
    cluster: "share-trading",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "FEES",
    workingTitle: "Brokerage Fees in Australia: How Share Trading Costs Work",
    targetPath: "/guides/brokerage-fees-australia",
    rationale:
      "Explains the cost model behind the brokerage and trading-cost tools.",
    evidenceNeeded: [
      "Moneysmart share-cost guidance",
      "current provider fee schedules",
    ],
    supports: [
      "/tools/brokerage-calculator",
      "/tools/trading-cost-calculator",
      "/compare/trading-platforms",
    ],
  },
  {
    id: "chess-vs-custody-guide",
    cluster: "share-trading",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "OWNERSHIP",
    workingTitle:
      "CHESS Sponsorship vs Custody: What Australian Investors Should Understand",
    targetPath: "/guides/chess-vs-custody",
    rationale:
      "Ownership structure is a core differentiator already represented in structured provider data.",
    evidenceNeeded: [
      "ASX/ASIC or provider custody disclosures",
      "provider source records",
    ],
    supports: [
      "/tools/chess-vs-custody",
      "/share-trading",
      "/compare/trading-platforms",
    ],
  },
  {
    id: "fx-fees-shares",
    cluster: "share-trading",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "FEES",
    workingTitle: "FX Fees When Buying US Shares from Australia",
    targetPath: "/guides/fx-fees-us-shares-australia",
    rationale:
      "Connects international-share research to the FX calculator and prevents brokerage-only comparisons.",
    evidenceNeeded: [
      "provider FX schedules",
      "Moneysmart overseas-share cost guidance",
    ],
    supports: ["/tools/fx-fee-calculator", "/tools/trading-cost-calculator"],
  },
  {
    id: "fractional-shares",
    cluster: "share-trading",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "LEARN",
    workingTitle:
      "Fractional Shares in Australia: Ownership, Fees and Transfers",
    targetPath: "/guides/fractional-shares-australia",
    rationale:
      "Current Moneysmart guidance makes this a strong educational bridge to custody and fee research.",
    evidenceNeeded: [
      "Moneysmart fractional-share guidance",
      "provider fractional-share terms",
    ],
    supports: ["/share-trading", "/tools/chess-vs-custody"],
  },
  {
    id: "share-platform-fees-checklist",
    cluster: "share-trading",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "BEGINNER",
    workingTitle:
      "Share Trading Fees Checklist: Brokerage, FX, Platform and Other Costs",
    targetPath: "/guides/share-trading-fees-checklist",
    rationale:
      "Creates a plain-English cost checklist without ranking providers.",
    evidenceNeeded: ["Moneysmart", "structured fee categories"],
    supports: ["/tools", "/compare/trading-platforms"],
  },
  {
    id: "hin-explained",
    cluster: "share-trading",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "OWNERSHIP",
    workingTitle: "What Is a HIN? CHESS-Sponsored Share Ownership Explained",
    targetPath: "/guides/what-is-a-hin",
    rationale:
      "Supports a common concept users encounter on Australian broker profiles.",
    evidenceNeeded: ["ASX/official CHESS material"],
    supports: ["/tools/chess-vs-custody", "/share-trading"],
  },
  {
    id: "international-shares-cost",
    cluster: "share-trading",
    priority: "BUILD_NEXT",
    format: "guide",
    intent: "FEES",
    workingTitle: "The Cost of Buying International Shares from Australia",
    rationale:
      "Requires brokerage, FX and pass-through-fee context rather than a single headline fee.",
    evidenceNeeded: ["provider fee schedules", "market/regulatory fee sources"],
    supports: ["/tools/trading-cost-calculator", "/tools/fx-fee-calculator"],
  },
  {
    id: "market-vs-limit",
    cluster: "share-trading",
    priority: "BUILD_NEXT",
    format: "guide",
    intent: "LEARN",
    workingTitle: "Market Orders vs Limit Orders: A Beginner Guide",
    rationale:
      "Useful foundational intent and naturally supports platform feature research.",
    evidenceNeeded: ["Moneysmart/ASX education"],
    supports: ["/share-trading"],
  },
  {
    id: "transfer-brokers",
    cluster: "share-trading",
    priority: "BUILD_NEXT",
    format: "guide",
    intent: "HOW_TO",
    workingTitle:
      "How Broker Transfers Work in Australia: HIN, Custody and Fractional Shares",
    rationale:
      "Ownership model affects portability and can be more important than headline brokerage.",
    evidenceNeeded: ["ASX/provider transfer documentation"],
    supports: ["/tools/chess-vs-custody", "/share-trading"],
  },
  {
    id: "small-trades-fees",
    cluster: "share-trading",
    priority: "BUILD_NEXT",
    format: "tool-support",
    intent: "FEES",
    workingTitle: "How Brokerage Affects Small Regular Investments",
    rationale:
      "Supports the regular-investing calculator with worked hypothetical examples.",
    evidenceNeeded: ["calculator methodology", "verified fee records"],
    supports: ["/tools/regular-investing-calculator"],
  },
  {
    id: "etoro-moomoo-context",
    cluster: "share-trading",
    priority: "BUILD_NEXT",
    format: "comparison",
    intent: "COMPARISON",
    workingTitle: "eToro vs moomoo: Ownership, Markets and Published Costs",
    targetPath: "/compare/trading-platforms/etoro-vs-moomoo",
    rationale:
      "Already curated; deepen the page rather than create a second SEO URL.",
    evidenceNeeded: ["current eToro/moomoo official sources"],
    supports: ["/share-trading/etoro", "/share-trading/moomoo"],
  },
  {
    id: "stake-moomoo-context",
    cluster: "share-trading",
    priority: "BUILD_NEXT",
    format: "comparison",
    intent: "COMPARISON",
    workingTitle: "moomoo vs Stake: Markets, Custody and Published Costs",
    targetPath: "/compare/trading-platforms/moomoo-vs-stake",
    rationale: "Already curated and can reuse structured evidence.",
    evidenceNeeded: ["current provider sources"],
    supports: ["/share-trading/moomoo", "/share-trading/stake"],
  },
  {
    id: "commsec-stake-context",
    cluster: "share-trading",
    priority: "BUILD_NEXT",
    format: "comparison",
    intent: "COMPARISON",
    workingTitle: "CommSec vs Stake: Markets, Ownership and Published Costs",
    targetPath: "/compare/trading-platforms/commsec-vs-stake",
    rationale: "Already curated; prioritize depth over another comparison URL.",
    evidenceNeeded: ["current provider sources"],
    supports: ["/share-trading/commsec", "/share-trading/stake"],
  },
  {
    id: "asx-vs-us-costs",
    cluster: "share-trading",
    priority: "LATER",
    format: "guide",
    intent: "FEES",
    workingTitle: "ASX vs US Share Trading Costs for Australians",
    rationale:
      "Useful once international fee coverage is consistently modeled.",
    evidenceNeeded: ["broader verified fee coverage"],
    supports: ["/tools/trading-cost-calculator"],
  },
  {
    id: "brokerage-free",
    cluster: "share-trading",
    priority: "LATER",
    format: "guide",
    intent: "FEES",
    workingTitle: "What Does ‘Zero Brokerage’ Actually Exclude?",
    rationale:
      "Good educational angle but requires careful provider-by-provider evidence.",
    evidenceNeeded: [
      "provider disclosures",
      "FX and pass-through fee evidence",
    ],
    supports: ["/tools/trading-cost-calculator"],
  },
  {
    id: "share-platform-security",
    cluster: "share-trading",
    priority: "LATER",
    format: "guide",
    intent: "SECURITY",
    workingTitle: "How to Research an Online Share Trading Platform’s Security",
    rationale: "Needs a defensible security-fact taxonomy before publication.",
    evidenceNeeded: ["provider security documentation", "regulatory sources"],
    supports: ["/share-trading"],
  },
  {
    id: "smsf-share-platforms",
    cluster: "share-trading",
    priority: "LATER",
    format: "guide",
    intent: "LEARN",
    workingTitle: "Share Trading Platforms and SMSFs: What to Research",
    rationale:
      "Potentially valuable but higher compliance sensitivity and needs stronger structured coverage.",
    evidenceNeeded: ["ATO/ASIC guidance", "provider SMSF terms"],
    supports: ["/share-trading"],
  },
  {
    id: "all-broker-pairs",
    cluster: "share-trading",
    priority: "DO_NOT_BUILD",
    format: "comparison",
    intent: "COMPARISON",
    workingTitle: "Automatically generate every broker-vs-broker page",
    rationale:
      "Combinatorial thin pages would add little unique value and create crawl/index quality risk.",
    evidenceNeeded: [],
    supports: [],
  },
  {
    id: "best-broker-overall",
    cluster: "share-trading",
    priority: "DO_NOT_BUILD",
    format: "guide",
    intent: "COMPARISON",
    workingTitle: "Best Share Trading Platform in Australia — Overall Winner",
    rationale:
      "An unsupported winner label conflicts with the evidence-first comparison model.",
    evidenceNeeded: [],
    supports: [],
  },
  {
    id: "city-broker-pages",
    cluster: "share-trading",
    priority: "DO_NOT_BUILD",
    format: "guide",
    intent: "COMPARISON",
    workingTitle: "Best Broker in Sydney/Melbourne/Brisbane location pages",
    rationale:
      "Location does not materially change an online platform comparison and would be doorway-style content.",
    evidenceNeeded: [],
    supports: [],
  },

  {
    id: "crypto-fees-explained",
    cluster: "crypto",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "FEES",
    workingTitle:
      "Crypto Exchange Fees in Australia: Trading, Funding and Withdrawal Costs",
    targetPath: "/guides/crypto-exchange-fees-australia",
    rationale:
      "Directly explains the three cost stages modeled by Trading Guide tools.",
    evidenceNeeded: [
      "official exchange fee schedules",
      "calculator methodology",
    ],
    supports: ["/tools/crypto-fee-calculator", "/tools/crypto-cost-calculator"],
  },
  {
    id: "austrac-registration",
    cluster: "crypto",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "REGULATION",
    workingTitle:
      "AUSTRAC Registration for Crypto Platforms: What It Means and What It Doesn't",
    targetPath: "/guides/austrac-crypto-registration",
    rationale:
      "AUSTRAC now publishes a public VASP register; users need the limits of what registration establishes.",
    evidenceNeeded: [
      "AUSTRAC VASP register/guidance",
      "provider legal entities",
    ],
    supports: ["/crypto/exchanges"],
  },
  {
    id: "crypto-spread",
    cluster: "crypto",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "FEES",
    workingTitle:
      "Crypto Spreads vs Trading Fees: Why the Headline Fee Is Not the Whole Cost",
    targetPath: "/guides/crypto-spread-vs-trading-fee",
    rationale:
      "Prevents simplistic fee comparisons and supports methodology transparency.",
    evidenceNeeded: ["provider pricing disclosures", "execution methodology"],
    supports: ["/tools/crypto-fee-calculator"],
  },
  {
    id: "crypto-withdrawal-fees",
    cluster: "crypto",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "FEES",
    workingTitle:
      "Crypto Withdrawal Fees Explained: Platform Fees and Network Fees",
    targetPath: "/guides/crypto-withdrawal-fees",
    rationale:
      "Supports the funding/withdrawal tool and clarifies variable network costs.",
    evidenceNeeded: [
      "exchange withdrawal schedules",
      "network-fee explanations",
    ],
    supports: [
      "/tools/crypto-funding-withdrawal-fees",
      "/tools/crypto-cost-calculator",
    ],
  },
  {
    id: "crypto-custody",
    cluster: "crypto",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "SECURITY",
    workingTitle:
      "Crypto Exchange Custody: What Happens to Assets Held on a Platform?",
    targetPath: "/guides/crypto-exchange-custody",
    rationale:
      "Adds depth beyond fees and connects exchange research to custody/security questions.",
    evidenceNeeded: [
      "provider custody/security disclosures",
      "regulatory guidance",
    ],
    supports: ["/crypto/exchanges"],
  },
  {
    id: "aud-funding",
    cluster: "crypto",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "FUNDING",
    workingTitle:
      "Funding a Crypto Exchange in Australia: PayID, Bank Transfer and Card Fees",
    targetPath: "/guides/crypto-exchange-funding-australia",
    rationale:
      "Maps naturally to structured funding features and fee categories.",
    evidenceNeeded: ["provider funding pages", "verified fee records"],
    supports: ["/tools/crypto-funding-withdrawal-fees"],
  },
  {
    id: "maker-taker",
    cluster: "crypto",
    priority: "BUILD_NEXT",
    format: "guide",
    intent: "FEES",
    workingTitle: "Maker and Taker Fees Explained for Crypto Beginners",
    rationale:
      "Useful for advanced exchange schedules already modeled in Phase 7.1.",
    evidenceNeeded: ["official exchange fee schedules"],
    supports: ["/tools/crypto-fee-calculator"],
  },
  {
    id: "instant-buy-vs-market",
    cluster: "crypto",
    priority: "BUILD_NEXT",
    format: "guide",
    intent: "FEES",
    workingTitle:
      "Instant Buy vs Exchange Order: How Crypto Pricing Can Differ",
    rationale:
      "Helps users understand why one provider can expose multiple fee paths.",
    evidenceNeeded: ["provider execution/fee documentation"],
    supports: ["/tools/crypto-fee-calculator"],
  },
  {
    id: "crypto-transfer-flow",
    cluster: "crypto",
    priority: "BUILD_NEXT",
    format: "guide",
    intent: "HOW_TO",
    workingTitle:
      "How Crypto Transfers Work: Exchange, Wallet and Network Fees",
    rationale:
      "Supports eToro and other multi-stage withdrawal flows without flattening them.",
    evidenceNeeded: ["provider wallet docs", "network-fee sources"],
    supports: ["/tools/crypto-funding-withdrawal-fees"],
  },
  {
    id: "coinspot-swyftx-context",
    cluster: "crypto",
    priority: "BUILD_NEXT",
    format: "comparison",
    intent: "COMPARISON",
    workingTitle: "CoinSpot vs Swyftx: Published Fees, Funding and Features",
    targetPath: "/compare/crypto-exchanges/coinspot-vs-swyftx",
    rationale: "Already curated; deepen existing URL.",
    evidenceNeeded: ["current provider sources"],
    supports: ["/crypto/exchanges/coinspot", "/crypto/exchanges/swyftx"],
  },
  {
    id: "coinspot-kraken-context",
    cluster: "crypto",
    priority: "BUILD_NEXT",
    format: "comparison",
    intent: "COMPARISON",
    workingTitle: "CoinSpot vs Kraken: Published Fees, Funding and Features",
    targetPath: "/compare/crypto-exchanges/coinspot-vs-kraken",
    rationale: "Already curated; deepen existing URL.",
    evidenceNeeded: ["current provider sources"],
    supports: ["/crypto/exchanges/coinspot", "/crypto/exchanges/kraken"],
  },
  {
    id: "coinspot-etoro-context",
    cluster: "crypto",
    priority: "BUILD_NEXT",
    format: "comparison",
    intent: "COMPARISON",
    workingTitle:
      "CoinSpot vs eToro Crypto: Fee Models, Funding and Platform Structure",
    targetPath: "/compare/crypto-exchanges/coinspot-vs-etoro",
    rationale: "Useful because the product structures differ materially.",
    evidenceNeeded: ["current provider sources"],
    supports: ["/crypto/exchanges/coinspot", "/crypto/exchanges/etoro"],
  },
  {
    id: "crypto-order-types",
    cluster: "crypto",
    priority: "BUILD_NEXT",
    format: "guide",
    intent: "LEARN",
    workingTitle: "Crypto Market and Limit Orders Explained",
    rationale:
      "Supports exchange feature research without recommending trading strategies.",
    evidenceNeeded: ["exchange documentation"],
    supports: ["/crypto/exchanges"],
  },
  {
    id: "vasp-register-check",
    cluster: "crypto",
    priority: "BUILD_NEXT",
    format: "how-to",
    intent: "HOW_TO",
    workingTitle: "How to Check a Crypto Platform on the AUSTRAC VASP Register",
    rationale:
      "Practical verification workflow based on the public register introduced in 2026.",
    evidenceNeeded: ["AUSTRAC public register instructions"],
    supports: ["/crypto/exchanges"],
  },
  {
    id: "crypto-fee-tiers",
    cluster: "crypto",
    priority: "LATER",
    format: "guide",
    intent: "FEES",
    workingTitle: "30-Day Volume Tiers on Crypto Exchanges Explained",
    rationale:
      "Useful once more providers have verified structured tier schedules.",
    evidenceNeeded: ["verified tier schedules"],
    supports: ["/tools/crypto-fee-calculator"],
  },
  {
    id: "crypto-staking-platform",
    cluster: "crypto",
    priority: "LATER",
    format: "guide",
    intent: "LEARN",
    workingTitle: "Crypto Staking on Exchanges: What to Research",
    rationale:
      "Needs careful product/regulatory treatment and richer structured data.",
    evidenceNeeded: [
      "provider staking terms",
      "current Australian regulatory guidance",
    ],
    supports: ["/crypto/exchanges"],
  },
  {
    id: "crypto-security-checklist",
    cluster: "crypto",
    priority: "LATER",
    format: "guide",
    intent: "SECURITY",
    workingTitle: "Crypto Exchange Security Checklist for Australians",
    rationale:
      "Requires a source-backed security taxonomy rather than marketing claims.",
    evidenceNeeded: ["provider security evidence", "regulatory guidance"],
    supports: ["/crypto/exchanges"],
  },
  {
    id: "all-crypto-pairs",
    cluster: "crypto",
    priority: "DO_NOT_BUILD",
    format: "comparison",
    intent: "COMPARISON",
    workingTitle: "Automatically generate every exchange-vs-exchange page",
    rationale:
      "Avoid combinatorial thin comparison pages; index only researched pairs.",
    evidenceNeeded: [],
    supports: [],
  },
  {
    id: "best-crypto-overall",
    cluster: "crypto",
    priority: "DO_NOT_BUILD",
    format: "guide",
    intent: "COMPARISON",
    workingTitle: "Best Crypto Exchange in Australia — Overall Winner",
    rationale:
      "Avoid unsupported ranking/winner claims; compare documented attributes instead.",
    evidenceNeeded: [],
    supports: [],
  },
  {
    id: "coin-price-predictions",
    cluster: "crypto",
    priority: "DO_NOT_BUILD",
    format: "guide",
    intent: "LEARN",
    workingTitle: "Bitcoin and Altcoin Price Prediction Pages",
    rationale:
      "Outside the evidence-first provider comparison mission and prone to speculative thin content.",
    evidenceNeeded: [],
    supports: [],
  },

  {
    id: "trading-cost-anatomy",
    cluster: "cross-market",
    priority: "BUILD_NOW",
    format: "guide",
    intent: "FEES",
    workingTitle:
      "The Real Cost of a Trade: Brokerage, FX, Spread and Withdrawal Fees",
    targetPath: "/guides/trading-costs-explained",
    rationale:
      "Unifies the site's calculator methodology without pretending all products share the same fee model.",
    evidenceNeeded: ["tool methodologies", "official cost guidance"],
    supports: ["/tools"],
  },
  {
    id: "how-we-verify-data",
    cluster: "cross-market",
    priority: "BUILD_NOW",
    format: "provider-research",
    intent: "LEARN",
    workingTitle: "How Trading Guide Verifies Platform Fees and Features",
    targetPath: "/methodology",
    rationale:
      "Trust content should explain source selection, verification dates and unknown/variable handling.",
    evidenceNeeded: ["internal methodology"],
    supports: ["/methodology", "/share-trading", "/crypto/exchanges"],
  },
  {
    id: "variable-fees",
    cluster: "cross-market",
    priority: "BUILD_NEXT",
    format: "guide",
    intent: "FEES",
    workingTitle: "Why Some Trading Fees Cannot Be Reduced to One Number",
    rationale:
      "Explains VARIABLE, CONDITIONAL and UNKNOWN states used throughout the product.",
    evidenceNeeded: ["calculator methodology", "provider examples"],
    supports: ["/tools", "/methodology"],
  },
  {
    id: "platform-comparison-method",
    cluster: "cross-market",
    priority: "BUILD_NEXT",
    format: "provider-research",
    intent: "COMPARISON",
    workingTitle: "How to Read a Trading Platform Comparison",
    targetPath: "/methodology/comparisons",
    rationale:
      "Strengthen an existing methodology URL rather than create another article.",
    evidenceNeeded: ["internal methodology"],
    supports: ["/compare"],
  },
  {
    id: "source-quality",
    cluster: "cross-market",
    priority: "BUILD_NEXT",
    format: "guide",
    intent: "LEARN",
    workingTitle:
      "Official Sources vs Marketing Claims When Researching Trading Platforms",
    rationale: "Reinforces the source-linked research proposition.",
    evidenceNeeded: ["internal sourcing policy"],
    supports: ["/methodology/editorial-policy"],
  },
  {
    id: "fees-small-investments",
    cluster: "cross-market",
    priority: "LATER",
    format: "guide",
    intent: "FEES",
    workingTitle: "Why Fixed Fees Matter More on Small Investments",
    rationale:
      "Useful educational maths but should reuse calculator scenarios rather than duplicate them.",
    evidenceNeeded: ["calculator examples"],
    supports: ["/tools/regular-investing-calculator"],
  },
  {
    id: "provider-data-freshness",
    cluster: "cross-market",
    priority: "LATER",
    format: "provider-research",
    intent: "LEARN",
    workingTitle: "How Often Trading Platform Fees and Features Change",
    rationale:
      "Useful trust content once the verification-history UI can show meaningful change examples.",
    evidenceNeeded: ["verification history", "provider change records"],
    supports: ["/methodology", "/admin/pricing-verification"],
  },
  {
    id: "platform-tax-advice",
    cluster: "cross-market",
    priority: "DO_NOT_BUILD",
    format: "guide",
    intent: "TAX_CONTEXT",
    workingTitle: "Which Platform Will Minimise Your Tax?",
    rationale:
      "Would invite personalized tax conclusions outside the site's factual comparison scope.",
    evidenceNeeded: [],
    supports: [],
  },
  {
    id: "personalized-platform-picker",
    cluster: "cross-market",
    priority: "DO_NOT_BUILD",
    format: "tool-support",
    intent: "COMPARISON",
    workingTitle:
      "Tell Us Your Salary and Goals and We'll Pick Your Best Platform",
    rationale:
      "Avoid personal-advice-style recommendations; keep tools hypothetical and factual.",
    evidenceNeeded: [],
    supports: [],
  },
  {
    id: "daily-seo-news",
    cluster: "cross-market",
    priority: "DO_NOT_BUILD",
    format: "guide",
    intent: "LEARN",
    workingTitle: "Mass-produce daily market/news pages for search traffic",
    rationale:
      "High maintenance and weak fit with the durable research/tool moat.",
    evidenceNeeded: [],
    supports: [],
  },
] as const;

export function getContentOpportunities(priority?: ContentPriority) {
  return CONTENT_OPPORTUNITIES.filter(
    (item) => !priority || item.priority === priority
  );
}
