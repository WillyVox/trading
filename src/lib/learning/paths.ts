export type LearningLesson = {
  id: string;
  title: string;
  href: string;
  minutes: number;
  description: string;
};

export type LearningPractice = {
  title: string;
  href: string;
  description: string;
  minutes?: number;
};

export type LearningPath = {
  id: "share-trading-foundations" | "crypto-foundations";
  label: string;
  title: string;
  description: string;
  lessons: LearningLesson[];
  practiceByLesson?: Record<string, LearningPractice>;
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "share-trading-foundations",
    label: "Share Trading Foundations",
    title: "Share Trading Foundations",
    description:
      "A beginner-friendly path through trading basics, costs and share ownership in Australia.",
    lessons: [
      {
        id: "share-trading-beginners",
        title: "Share trading for beginners",
        href: "/guides/share-trading-for-beginners",
        minutes: 8,
        description:
          "Start with how shares, brokers and the Australian market fit together.",
      },
      {
        id: "asx-market-mechanics",
        title: "How the ASX works",
        href: "/guides/how-the-asx-works",
        minutes: 7,
        description:
          "Learn how orders are matched, how market and limit orders differ, and how settlement works.",
      },
      {
        id: "trading-costs",
        title: "Trading costs explained",
        href: "/guides/trading-costs-explained",
        minutes: 6,
        description: "Learn the different costs that can sit around a trade.",
      },
      {
        id: "brokerage",
        title: "Brokerage fees in Australia",
        href: "/guides/brokerage-fees-australia",
        minutes: 7,
        description:
          "Understand flat, percentage, minimum and conditional brokerage.",
      },
      {
        id: "chess-custody",
        title: "CHESS sponsorship vs custody",
        href: "/guides/chess-vs-custody",
        minutes: 7,
        description:
          "Understand two common ownership and recordkeeping structures.",
      },
      {
        id: "hin",
        title: "What is a HIN?",
        href: "/guides/what-is-a-hin",
        minutes: 5,
        description: "Learn what a Holder Identification Number represents.",
      },
      {
        id: "fractional-shares",
        title: "Fractional shares in Australia",
        href: "/guides/fractional-shares-australia",
        minutes: 6,
        description:
          "Understand fractional interests, custody and practical limitations.",
      },
    ],
    practiceByLesson: {
      brokerage: {
        title: "Try the brokerage calculator",
        href: "/tools/brokerage-calculator",
        description: "Apply supported brokerage rules to a hypothetical trade.",
        minutes: 2,
      },
      "trading-costs": {
        title: "Try the trading cost calculator",
        href: "/tools/trading-cost-calculator",
        description: "Explore supported brokerage and FX components together.",
        minutes: 2,
      },
      "chess-custody": {
        title: "Explore CHESS vs custody",
        href: "/tools/chess-vs-custody",
        description:
          "Inspect ownership structures in Trading Guide's provider data.",
        minutes: 2,
      },
    },
  },
  {
    id: "crypto-foundations",
    label: "Crypto Foundations",
    title: "Crypto Foundations",
    description:
      "A beginner-friendly path through crypto risk, exchanges, wallets, funding, fees and Australian registration context.",
    lessons: [
      {
        id: "crypto-beginners",
        title: "Crypto investing for beginners",
        href: "/guides/how-to-start-investing-in-crypto-for-beginners",
        minutes: 9,
        description:
          "Start with the asset class, risk, security and recordkeeping.",
      },
      {
        id: "crypto-exchanges-wallets",
        title: "How crypto exchanges and wallets work",
        href: "/guides/how-crypto-exchanges-and-wallets-work",
        minutes: 8,
        description:
          "Understand exchanges, custodial wallets, self-custody and private keys before funding an account.",
      },
      {
        id: "crypto-funding",
        title: "Crypto exchange funding in Australia",
        href: "/guides/crypto-exchange-funding-australia",
        minutes: 6,
        description:
          "Understand deposits, withdrawals and variable funding costs.",
      },
      {
        id: "crypto-fees",
        title: "Crypto exchange fees in Australia",
        href: "/guides/crypto-exchange-fees-australia",
        minutes: 7,
        description:
          "Learn how trading, instant-buy and other fee paths differ.",
      },
      {
        id: "austrac",
        title: "AUSTRAC registration and crypto exchanges",
        href: "/guides/austrac-crypto-registration",
        minutes: 6,
        description:
          "Understand what Australian registration does—and does not—tell you.",
      },
    ],
    practiceByLesson: {
      "crypto-funding": {
        title: "Try the funding & withdrawal tool",
        href: "/tools/crypto-funding-withdrawal-fees",
        description:
          "Explore supported funding and withdrawal fee information.",
        minutes: 2,
      },
      "crypto-fees": {
        title: "Try the crypto fee calculator",
        href: "/tools/crypto-fee-calculator",
        description: "Apply supported fee rules to a hypothetical transaction.",
        minutes: 2,
      },
    },
  },
];

export function getLearningContext(href: string) {
  for (const path of LEARNING_PATHS) {
    const index = path.lessons.findIndex((lesson) => lesson.href === href);
    if (index >= 0) {
      const lesson = path.lessons[index];
      return {
        path,
        lesson,
        index,
        previous: index > 0 ? path.lessons[index - 1] : undefined,
        next:
          index < path.lessons.length - 1 ? path.lessons[index + 1] : undefined,
        practice: path.practiceByLesson?.[lesson.id],
      };
    }
  }
  return undefined;
}
