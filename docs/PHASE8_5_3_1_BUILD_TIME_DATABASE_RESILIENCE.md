# Phase 8.5.3.1 — Build-time database resilience

## Problem

Runtime graceful degradation does not automatically make `next build` database-independent. Next.js may prerender routes during the build. A direct Prisma call from a prerendered page can therefore fail the entire build when PostgreSQL is unavailable.

The observed failure came from the legacy `/share-trading/compare` route, which still queried `getAllShareTradingPlatformsForCompare()` even though Phase 8.1 established `/compare/trading-platforms` as the canonical route.

## Changes

### Legacy compare routes are DB-free redirects

- `/share-trading/compare` -> `/compare/trading-platforms`
- `/share-trading/compare/[slug]` -> `/compare/trading-platforms/[slug]`
- `/crypto/exchanges/compare` -> `/compare/crypto-exchanges`
- `/crypto/exchanges/compare/[slug]` -> `/compare/crypto-exchanges/[slug]`

These routes no longer query PostgreSQL, build comparison tables, or generate DB-backed metadata. This also removes duplicate implementations that could drift from the canonical compare routes.

### Sitemap is explicitly runtime-dynamic

`src/app/sitemap.ts` already catches recognized database outages and returns the static sitemap entries. It now also exports `dynamic = "force-dynamic"` so the DB-discovered sitemap portion is not evaluated while prerendering the application build.

The previous `revalidate = 3600` setting was removed here because `force-dynamic` makes the runtime intent explicit; keeping both would communicate conflicting caching intent. If sitemap caching is later required, add it explicitly around the dynamic data source rather than relying on page prerendering.

## Important distinction

A build being DB-independent does not mean a deployment is healthy without its DB. Runtime `/api/health` still reports a degraded state when PostgreSQL is unavailable, and DB-required product surfaces continue to fail closed or render their 8.5.2 unavailable states.

## Follow-up audit

The remaining DB-backed pages fall into two groups:

1. Required DB product surfaces. Their DB reads should be handled through the 8.5 resilience boundary and, where build-time execution would bake an outage state into static output, should use an explicit runtime rendering strategy.
2. Static/editorial pages with optional live evidence. Their core content should remain buildable; optional evidence must never fail the build.

Do not globally mark the whole application dynamic. That would unnecessarily discard static/SEO benefits from editorial and legal content.
