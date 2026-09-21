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
 * `children` is a flat single-column list of links. `columns` is for a
 * multi-column panel where each column has its own heading (e.g. "Guides" —
 * Share Trading / Crypto Exchanges; "Compares" — Online Trading Platforms /
 * Crypto Exchanges). An item can define `columns` and an optional trailing
 * `footerLink` (e.g. "View all guides →") shown under a divider spanning
 * the full panel width. Use one of `children` or `columns`, not both.
 *
 * "Crypto Exchanges" is a flat top-level link to the existing
 * /crypto/exchanges route (browse page + /crypto/exchanges/[slug] profiles)
 * — the URL was deliberately kept as-is rather than flattened to
 * /crypto-exchanges: it's already indexed, hardcoded across ~14 files plus
 * sitemap-entries.ts, and Google doesn't reward flatter URLs over a
 * logical nested one, so renaming would only add 301-redirect risk for no
 * SEO upside.
 */

import {
  getStaticGuideArticleHref,
  STATIC_SLUG_IDS,
} from "../guides/static-article-slugs";
import type { NavIconName } from "@/components/layout/NavIcon";

export interface NavLink {
  label: string;
  href: string;
  /** Shown before the label in the mega-menu and mobile accordion (see
   *  NavIcon). Omit for a link that shouldn't have one, e.g. footerLink. */
  icon?: NavIconName;
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
    label: "Guides",
    // href: "/guides",
    columns: [
      {
        heading: "Getting Started",
        links: [
          {
            label: "What Is Trading?",
            href: getStaticGuideArticleHref(STATIC_SLUG_IDS.WHAT_IS_TRADING),
            icon: "book",
          },
          {
            label: "What You Need to Start Trading",
            href: getStaticGuideArticleHref(
              STATIC_SLUG_IDS.WHAT_YOU_NEED_TO_START_TRADING
            ),
            icon: "check",
          },
        ],
      },
      {
        heading: "Share Trading",
        links: [
          {
            label: "Share Trading for Beginners",
            href: getStaticGuideArticleHref(
              STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS
            ),
            icon: "grad",
          },
          {
            label: "Steps to Start Investing in Shares in Australia",
            href: getStaticGuideArticleHref(
              STATIC_SLUG_IDS.STEPS_TO_START_INVESTING_IN_SHARES
            ),
            icon: "flag",
          },
          {
            label: "How to Open an Online Share Trading Account",
            href: getStaticGuideArticleHref(
              STATIC_SLUG_IDS.OPEN_SHARE_TRADING_ACCOUNT
            ),
            icon: "userplus",
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
            icon: "coin",
          },
          {
            label: "How to Start Investing in Crypto for Beginners",
            href: getStaticGuideArticleHref(
              STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO
            ),
            icon: "wallet",
          },
          {
            label: "Top Cryptocurrency Exchanges in Australia",
            href: getStaticGuideArticleHref(
              STATIC_SLUG_IDS.TOP_CRYPTO_EXCHANGES
            ),
            icon: "star",
          },
        ],
      },
    ],
    footerLink: { label: "View all guides →", href: "/guides" },
  },
  {
    label: "Compares",
    columns: [
      {
        heading: "Online Trading Platforms",
        links: [
          {
            label: "Compare all trading platforms",
            href: "/share-trading/compare",
            icon: "scale",
          },
          {
            label: "Browse share trading platforms",
            href: "/share-trading",
            icon: "grid",
          },
        ],
      },
      {
        heading: "Crypto Exchanges",
        links: [
          {
            label: "Compare all crypto exchanges",
            href: "/crypto/exchanges/compare",
            icon: "scale",
          },
          {
            label: "Browse crypto exchanges",
            href: "/crypto/exchanges",
            icon: "grid",
          },
        ],
      },
    ],
  },
  {
    label: "Tools",
    href: "/tools",
    columns: [
      {
        heading: "Share Trading Tools",
        links: [
          {
            label: "Trading cost calculator",
            href: "/tools/trading-cost-calculator",
            icon: "calc",
          },
          {
            label: "Brokerage calculator",
            href: "/tools/brokerage-calculator",
            icon: "calc",
          },
          {
            label: "FX fee calculator",
            href: "/tools/fx-fee-calculator",
            icon: "fx",
          },
          {
            label: "Regular investing calculator",
            href: "/tools/regular-investing-calculator",
            icon: "repeat",
          },
          {
            label: "CHESS vs custody",
            href: "/tools/chess-vs-custody",
            icon: "shield",
          },
        ],
      },
      {
        heading: "Crypto Tools",
        links: [
          {
            label: "Crypto fee calculator",
            href: "/tools/crypto-fee-calculator",
            icon: "calc",
          },
          {
            label: "Crypto cost calculator",
            href: "/tools/crypto-cost-calculator",
            icon: "coin",
          },
          {
            label: "Deposit & withdrawal fees",
            href: "/tools/crypto-funding-withdrawal-fees",
            icon: "updown",
          },
        ],
      },
    ],
    footerLink: { label: "View all tools →", href: "/tools" },
  },
  { label: "Share Trading", href: "/share-trading" },
  { label: "Crypto Exchanges", href: "/crypto/exchanges" },
  { label: "News", href: "/news" },
];
