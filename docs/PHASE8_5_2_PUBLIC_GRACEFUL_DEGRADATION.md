# Phase 8.5.2 — Public Graceful Degradation

Date: 22 September 2026

## Goal

Adopt the typed database-availability boundary from Phase 8.5.1 across public DB-backed surfaces. A connectivity outage now produces an explicit unavailable state instead of an empty list, false 404, zero-cost calculation, or raw Prisma error on the converted routes.

## UI primitives

`src/components/data/DataUnavailable.tsx` provides:

- `DataUnavailable` for a page or section;
- `CalculatorUnavailable` for pricing/custody tools that must fail closed;
- `DataUnavailableBanner` for optional homepage live data.

Public reads use `publicDatabaseRead()` (`src/lib/data/public-read.ts`), a named wrapper over `safeDatabaseQuery()`.

## Converted surfaces

- Homepage featured crypto/share providers: optional live sections degrade while the rest of the homepage remains usable.
- Share-trading and crypto-exchange indexes: outage is distinct from a legitimate empty catalog.
- Share-trading and crypto-exchange detail pages: DB outage is distinct from a successful query returning no record; only the latter is a 404.
- Canonical share-trading and crypto comparison hubs and pair pages: no incomplete comparison is rendered when the dataset is unavailable.
- Brokerage, FX, trading-cost, regular-investing, crypto-fee, crypto-funding, crypto-cost, and CHESS/custody tools: calculators do not render an estimate when required data cannot be retrieved.
- Phase 9.3 live-evidence guide panels: editorial guide bodies continue to render while only the evidence panel degrades.
- CMS guide/news indexes and detail pages: outage is distinct from empty/not-found.
- Crypto asset detail page: outage is distinct from asset-not-found.

## Preserved invariants

- `DATABASE_UNAVAILABLE` is never converted to `[]`, `null`, A$0, FREE, STALE, or UNVERIFIED as a business result.
- Legitimate empty results still use existing empty-state UI.
- Successful detail lookups returning `null` still produce 404 where appropriate.
- Unexpected/query/schema/programming errors are still re-thrown by the 8.5.1 classifier.
- Calculators fail closed when their required DB inputs are unavailable.
- Code-backed educational content remains readable when only its live evidence cannot load.

## Deliberately deferred to Phase 8.5.3

This milestone does not yet change operational/admin surfaces. Phase 8.5.3 remains responsible for global/route error boundaries, `/api/health`, auth/admin outage UX, affiliate redirect fail-closed hardening, sitemap outage strategy, rate-limit-store policy, and broader outage regression/observability work.

## Validation note

The source snapshot does not include `node_modules`. A global TypeScript binary was used only as a syntax-oriented sanity check; full type validation is blocked by missing Next/React/Prisma dependencies and generated Prisma client. Run the normal local validation suite after installing dependencies.

Recommended manual outage test: start the app with PostgreSQL available, visit the converted public routes, stop PostgreSQL, refresh them, and confirm the unavailable states appear without calculations or false 404s. Restart PostgreSQL and confirm normal data returns.
