/**
 * Single source of truth for the header nav — both Header.tsx (desktop,
 * dropdown-on-click) and MobileNav.tsx (accordion in the drawer) render
 * from this same list, so the two never drift apart.
 *
 * An item with `children` renders as a dropdown/accordion trigger; an item
 * without renders as a plain link. `href` on a parent item is optional and
 * currently unused (a parent with children is a trigger, not a link) —
 * present for forward-compatibility if a future menu wants the label
 * itself to also be clickable.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem extends Partial<NavLink> {
  label: string;
  children?: NavLink[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Crypto",
    children: [
      { label: "Exchanges compare", href: "/compare" },
      { label: "Exchange reviews", href: "/crypto/exchanges" },
      { label: "Crypto guides", href: "/guides" },
    ],
  },
  {
    label: "Guides",
    children: [
      { label: "How to buy Cryptocurrencies", href: "/guides/how-to-buy-bitcoin" },
      // Closest existing match for a beginner "how to start investing"
      // overview — there's no dedicated investing-101 guide yet.
      { label: "How to Start Investing in Crypto for Beginners", href: "/guides/bitcoin-price-volatility-beginners-guide" },
      // No share-trading content exists yet (crypto-only site today) —
      // honest "coming soon" page rather than a dead link or thin filler.
      { label: "Share trading for Beginners", href: "/guides/share-trading-for-beginners" },
      { label: "View all guides →", href: "/guides" },
    ],
  },
  { label: "News", href: "/news" },
];
