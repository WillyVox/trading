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

import { getStaticGuideArticleHref, STATIC_SLUG_IDS } from "../guides/static-article-slugs";

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
      { label: "Compare Exchanges", href: "/compare" },
      { label: "Exchange Review", href: "/crypto/exchanges" },
      { label: "Crypto guides", href: "/guides" },
    ],
  },
  {
    label: "Guides",
    children: [
      { label: "5 Simple Steps to Buy Cryptocurrency", href: getStaticGuideArticleHref(STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO) },
      { label: "How to Start Investing in Crypto for Beginners", href: getStaticGuideArticleHref(STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO) },
      { label: "Top Cryptocurrency Exchanges in Australia", href: getStaticGuideArticleHref(STATIC_SLUG_IDS.TOP_CRYPTO_EXCHANGES) },
      { label: "Share Trading for Beginners", href: getStaticGuideArticleHref(STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS) },
      { label: "View all guides →", href: "/guides" },
    ],
  },
  { label: "News", href: "/news" },
];
