# Phase 8.5.3.2 — Custom 404 & Recovery UX

## Goal

Replace the framework-default dead-end 404 with a branded, useful Trading Guide recovery surface while preserving genuine HTTP 404 semantics.

## Design

- Uses the normal root layout, Header and Footer.
- Clear `404` and plain-language explanation.
- Primary return-home action plus browser Back action.
- Three static recovery cards aligned to Trading Guide's information architecture: Guides, Compare and Tools.
- Six stable educational topic links.
- Responsive card grid that stacks on smaller screens.
- Focus-visible states and minimum touch-friendly action heights.

## Resilience rule

The 404 itself has **zero Prisma/database dependency**. All destinations are stable, hard-coded application routes. Do not add live provider recommendations, latest DB articles, affiliate destinations or other database-backed recommendations to this page.

This means the recovery surface remains usable when PostgreSQL is unavailable and does not undermine Phase 8.5 build/runtime resilience.

## SEO semantics

The App Router `not-found.tsx` mechanism remains responsible for the missing route; the page is not redirected to `/`. Metadata requests `noindex, follow` so the missing URL is not intended for indexing while recovery links remain crawlable.

## Acceptance checks

- Unknown URL displays the custom recovery page.
- Header and Footer remain present.
- Home, Guides, Compare, Tools and all popular-topic destinations resolve.
- No Prisma/database imports exist in the 404 implementation.
- Layout is usable at 320, 360, 390, 430, 768, 1024 and 1440 px.
- Keyboard focus is visible.
- DB-off behaviour is identical to DB-on behaviour for the 404 itself.
- Unknown route retains missing-page semantics rather than redirecting to the homepage.
