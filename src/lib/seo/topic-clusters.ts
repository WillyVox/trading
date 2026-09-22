export type TopicClusterId = "share-trading" | "crypto";

export interface TopicClusterLink {
  href: string;
  title: string;
  description: string;
  kind: "guide" | "tool" | "compare" | "research";
}

export interface TopicCluster {
  id: TopicClusterId;
  title: string;
  description: string;
  hubHref: string;
  links: TopicClusterLink[];
}

export const TOPIC_CLUSTERS: Record<TopicClusterId, TopicCluster> = {
  "share-trading": {
    id: "share-trading",
    title: "Share trading research path",
    description:
      "Learn the basics, understand ownership and costs, then inspect source-linked platform profiles and comparisons.",
    hubHref: "/guides/share-trading",
    links: [
      {
        href: "/guides/share-trading-for-beginners",
        title: "Share trading for beginners",
        description:
          "Start with the concepts and terminology used throughout Trading Guide.",
        kind: "guide",
      },
      {
        href: "/guides/how-to-open-online-share-trading-account",
        title: "How to open a share trading account",
        description:
          "Understand the practical steps before choosing a platform.",
        kind: "guide",
      },
      {
        href: "/tools/chess-vs-custody",
        title: "CHESS vs custody explorer",
        description:
          "Understand ownership structures without reducing them to a winner label.",
        kind: "tool",
      },
      {
        href: "/tools/brokerage-calculator",
        title: "Brokerage calculator",
        description:
          "Apply supported published brokerage rules to a hypothetical trade.",
        kind: "tool",
      },
      {
        href: "/tools/fx-fee-calculator",
        title: "FX fee calculator",
        description:
          "Inspect supported currency-conversion costs for international investing.",
        kind: "tool",
      },
      {
        href: "/share-trading",
        title: "Share trading platform profiles",
        description:
          "Research markets, products, custody, features and source-linked fees.",
        kind: "research",
      },
      {
        href: "/compare/trading-platforms",
        title: "Compare trading platforms",
        description:
          "Put structured platform facts side by side without an overall ranking.",
        kind: "compare",
      },
    ],
  },
  crypto: {
    id: "crypto",
    title: "Crypto exchange research path",
    description:
      "Learn how crypto platforms work, inspect funding and trading costs, then compare source-linked exchange facts.",
    hubHref: "/guides/crypto",
    links: [
      {
        href: "/guides/how-to-start-investing-in-crypto-for-beginners",
        title: "Crypto for beginners",
        description:
          "Start with the basic concepts, risks and research questions.",
        kind: "guide",
      },
      {
        href: "/guides/simple-steps-to-buy-cryptocurrency",
        title: "Steps to buy cryptocurrency",
        description:
          "Understand the practical flow from funding to placing an order.",
        kind: "guide",
      },
      {
        href: "/tools/crypto-fee-calculator",
        title: "Crypto fee calculator",
        description:
          "Apply supported published trading-fee rules without treating unknown costs as zero.",
        kind: "tool",
      },
      {
        href: "/tools/crypto-funding-withdrawal-fees",
        title: "Deposit & withdrawal fees",
        description:
          "Inspect supported fiat funding and crypto withdrawal fee records.",
        kind: "tool",
      },
      {
        href: "/tools/crypto-cost-calculator",
        title: "Crypto cost calculator",
        description:
          "Combine supported funding, trading and withdrawal components in one scenario.",
        kind: "tool",
      },
      {
        href: "/crypto/exchanges",
        title: "Crypto exchange profiles",
        description:
          "Research provider facts, fees, features, sources and verification status.",
        kind: "research",
      },
      {
        href: "/compare/crypto-exchanges",
        title: "Compare crypto exchanges",
        description:
          "Compare structured exchange facts side by side without a winner score.",
        kind: "compare",
      },
    ],
  },
};

export function getTopicCluster(id: TopicClusterId) {
  return TOPIC_CLUSTERS[id];
}
