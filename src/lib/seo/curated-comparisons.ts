import { canonicalCompareSlugMulti } from "./canonical";

export type ComparisonDomain = "trading-platforms" | "crypto-exchanges";

export interface CuratedComparison {
  domain: ComparisonDomain;
  slugs: [string, string];
  title: string;
  description: string;
  intro: string;
  focus: string[];
}

const comparisons: CuratedComparison[] = [
  {
    domain: "trading-platforms",
    slugs: ["commsec", "stake"],
    title: "CommSec vs Stake: Share Trading Platform Comparison",
    description:
      "Compare CommSec and Stake using source-linked data on markets, products, custody, platform features and published costs.",
    intro:
      "This comparison brings the same structured provider data used on each platform profile into one view. It is designed to help you inspect differences, not to name a winner or recommend a platform.",
    focus: [
      "ASX and international market access",
      "Custody and ownership structure",
      "Published brokerage and FX costs",
      "Account and platform features",
    ],
  },
  {
    domain: "trading-platforms",
    slugs: ["cmc-invest", "commsec"],
    title: "CMC Invest vs CommSec: Share Trading Platform Comparison",
    description:
      "Compare CMC Invest and CommSec using source-linked market, custody, feature and fee data for Australian investors.",
    intro:
      "Use this page to inspect the factual differences currently recorded for CMC Invest and CommSec. Promotional pricing is excluded from standing-fee comparison rows.",
    focus: [
      "Australian and international markets",
      "CHESS and custody arrangements",
      "Standing brokerage schedules",
      "Platform and account features",
    ],
  },
  {
    domain: "trading-platforms",
    slugs: ["moomoo", "stake"],
    title: "moomoo vs Stake: Share Trading Platform Comparison",
    description:
      "Compare moomoo and Stake on market access, custody, products, features and source-linked trading costs.",
    intro:
      "This page compares verified structured facts where available and keeps unknown, conditional and variable costs visible rather than treating them as zero.",
    focus: [
      "ASX and US market access",
      "CHESS and international custody",
      "Brokerage and currency conversion",
      "Platform capabilities",
    ],
  },
  {
    domain: "trading-platforms",
    slugs: ["etoro", "moomoo"],
    title: "eToro vs moomoo: Share Trading Platform Comparison",
    description:
      "Compare eToro and moomoo using source-linked data on markets, ownership structure, products, features and costs.",
    intro:
      "eToro and moomoo use materially different ownership and pricing structures. This comparison preserves those differences rather than reducing them to a single score.",
    focus: [
      "Australian and overseas market access",
      "Ownership and custody structure",
      "Published and variable fees",
      "Platform features",
    ],
  },
  {
    domain: "crypto-exchanges",
    slugs: ["coinspot", "swyftx"],
    title: "CoinSpot vs Swyftx: Crypto Exchange Comparison Australia",
    description:
      "Compare CoinSpot and Swyftx using source-linked fee, funding, trading, security and provider facts for Australian users.",
    intro:
      "This comparison uses the same verified records that power the individual exchange profiles. It does not convert missing or variable fees into zero and does not rank the exchanges.",
    focus: [
      "Published trading fees",
      "AUD deposits and withdrawals",
      "Trading and account features",
      "Security-related facts recorded in our catalogue",
    ],
  },
  {
    domain: "crypto-exchanges",
    slugs: ["coinspot", "kraken"],
    title: "CoinSpot vs Kraken: Crypto Exchange Comparison Australia",
    description:
      "Compare CoinSpot and Kraken using source-linked fees, features, funding methods and verified provider facts.",
    intro:
      "Use the table as a research aid: fee models and product structures can differ, so the displayed rows should be read with their source and verification context rather than as an overall score.",
    focus: [
      "Trading-fee structures",
      "AUD funding methods",
      "Trading features",
      "Verification status and source coverage",
    ],
  },
  {
    domain: "crypto-exchanges",
    slugs: ["coinspot", "independent-reserve"],
    title: "CoinSpot vs Independent Reserve: Crypto Exchange Comparison",
    description:
      "Compare CoinSpot and Independent Reserve using source-linked fees, features and provider facts for Australian crypto users.",
    intro:
      "This page is an evidence-led side-by-side comparison. It highlights what our current sources establish and leaves unresolved information visibly unresolved.",
    focus: [
      "Published trading fees",
      "Deposit and withdrawal methods",
      "Trading features",
      "Provider facts and verification",
    ],
  },
  {
    domain: "crypto-exchanges",
    slugs: ["etoro-crypto", "coinspot"],
    title: "eToro vs CoinSpot: Crypto Platform Comparison Australia",
    description:
      "Compare eToro and CoinSpot on source-linked crypto fees, funding, features and provider facts for Australian users.",
    intro:
      "These services use different product and fee structures. The comparison therefore shows individual facts and costs rather than producing a single headline rating.",
    focus: [
      "Crypto trading charges",
      "AUD funding and withdrawals",
      "Wallet and transfer considerations",
      "Platform features and regulatory disclosures",
    ],
  },
];

export const CURATED_COMPARISONS = comparisons.map((entry) => ({
  ...entry,
  slug: canonicalCompareSlugMulti(entry.slugs),
}));

export function getCuratedComparison(domain: ComparisonDomain, slug: string) {
  return CURATED_COMPARISONS.find(
    (entry) => entry.domain === domain && entry.slug === slug
  );
}

export function getCuratedComparisonsForSubject(
  domain: ComparisonDomain,
  subjectSlug: string
) {
  return CURATED_COMPARISONS.filter(
    (entry) => entry.domain === domain && entry.slugs.includes(subjectSlug)
  );
}
