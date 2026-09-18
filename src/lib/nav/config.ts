/**
 * Single source of truth for the header nav — both Header.tsx (desktop,
 * hover dropdown) and MobileNav.tsx (accordion in the drawer) render
 * from this same list, so the two never drift apart.
 *
 * An item with `children` and/or `columns` renders as a dropdown/accordion
 * trigger; an item without renders as a plain link. `href` on a parent item
 * is a real link now — the trigger itself navigates like any nav link (see
 * NavMenuItem.tsx), so it must always be set on a parent with a dropdown.
 *
 * `children` is a flat single-column list of links (e.g. "Crypto").
 * `columns` is for a multi-column panel where each column has its own
 * heading (e.g. "Guides" — Share Trading / Crypto Exchanges). An item can
 * define `columns` and an optional trailing `footerLink` (e.g.
 * "View all guides →") shown under a divider spanning the full panel width.
 * Use one of `children` or `columns`, not both.
 */

import {
  getStaticGuideArticleHref,
  STATIC_SLUG_IDS,
} from "../guides/static-article-slugs";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavColumn {
  heading: string;
  links: NavLink[];
}

export interface NavItem extends Partial<NavLink> {
  label: string;
  children?: NavLink[];
  columns?: NavColumn[];
  footerLink?: NavLink;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Crypto",
    href: "/crypto",
    children: [
      { label: "Compare Exchanges", href: "/compare" },
      { label: "Exchange Review", href: "/crypto/exchanges" },
      { label: "Crypto guides", href: "/guides" },
    ],
  },
  {
    label: "Guides",
    href: "/guides",
    columns: [
      {
        heading: "Share Trading",
        links: [
          {
            label: "Share Trading for Beginners",
            href: getStaticGuideArticleHref(
              STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS
            ),
          },
        ],
      },
      {
        heading: "Crypto Exchanges",
        links: [
          {
            label: "5 Simple Steps to Buy Cryptocurrency",
            href: getStaticGuideArticleHref(
              STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO
            ),
          },
          {
            label: "How to Start Investing in Crypto for Beginners",
            href: getStaticGuideArticleHref(
              STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO
            ),
          },
          {
            label: "Top Cryptocurrency Exchanges in Australia",
            href: getStaticGuideArticleHref(
              STATIC_SLUG_IDS.TOP_CRYPTO_EXCHANGES
            ),
          },
        ],
      },
    ],
    footerLink: { label: "View all guides →", href: "/guides" },
  },
  { label: "Share Trading", href: "/share-trading" },
  { label: "News", href: "/news" },
];
