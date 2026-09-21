import type { ToolDefinition } from "./types";

export const TOOLS: ToolDefinition[] = [
  {
    slug: "brokerage-calculator",
    name: "Brokerage Cost Calculator",
    shortName: "Brokerage calculator",
    description:
      "Apply supported published brokerage rules to a hypothetical trade and see how the result is derived.",
    category: "TRADING_COSTS",
    status: "AVAILABLE",
    href: "/tools/brokerage-calculator",
  },
  {
    slug: "fx-fee-calculator",
    name: "FX Fee Calculator",
    shortName: "FX fee calculator",
    description:
      "Understand percentage-based currency conversion costs with a transparent worked calculation.",
    category: "TRADING_COSTS",
    status: "AVAILABLE",
    href: "/tools/fx-fee-calculator",
  },
  {
    slug: "regular-investing-calculator",
    name: "Regular Investing Brokerage Calculator",
    shortName: "Regular investing calculator",
    description:
      "Model repeated equal investments and see how brokerage covered by verified pricing rules adds up over time.",
    category: "TRADING_COSTS",
    status: "AVAILABLE",
    href: "/tools/regular-investing-calculator",
  },
  {
    slug: "chess-vs-custody",
    name: "CHESS vs Custody Explorer",
    shortName: "CHESS vs custody",
    description:
      "Explore how CHESS sponsorship, HINs and custodial ownership differ without reducing either structure to good or bad.",
    category: "OWNERSHIP_CUSTODY",
    status: "AVAILABLE",
    href: "/tools/chess-vs-custody",
  },
];
