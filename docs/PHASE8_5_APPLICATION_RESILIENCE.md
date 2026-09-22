# Phase 8.5 — Application Resilience & Graceful Degradation

## 8.5.0 audit

Database-dependent public surfaces identified: homepage featured providers; share-trading and crypto indexes/details; comparison selectors/details; brokerage, FX, combined trading-cost, regular-investing, crypto fee/funding/cost and custody tools; DB-backed article lists/details; Phase 9.3 live-evidence guide panels; affiliate redirects; admin.

Classification:

- **Enhancement:** homepage featured-provider sections and Phase 9.3 live evidence. The surrounding page remains useful without DB data.
- **Required for feature:** calculators, provider lists/details and comparisons. These must show unavailable rather than empty/zero when DB access fails.
- **Operational:** admin and affiliate redirects. They should fail safely and never expose connection details.

## 8.5.1 resilience foundation

`src/lib/data/database-errors.ts` classifies connectivity/initialization failures only. `safeDatabaseQuery()` converts only those failures to an explicit `DataResult`; programming/query/schema errors continue to throw. It never silently returns an empty collection.

## 8.5.2 graceful public UI

Reusable `DataUnavailable`, `DataUnavailableBanner`, `CalculatorUnavailable`, and `LiveEvidenceUnavailable` components distinguish infrastructure failure from a legitimate empty dataset. Homepage featured providers, key provider indexes, calculator pages and live-evidence guides use the explicit unavailable state. Calculators do not produce an estimate when pricing data cannot be loaded.

## 8.5.3 safety net and health

`app/error.tsx` and `app/global-error.tsx` are final safety nets for unexpected failures; `app/admin/error.tsx` gives operators a clearer admin failure state. `/api/health` returns only `healthy/degraded` and `available/unavailable`, with no DB hostname, URL or credentials. Connectivity failures are logged server-side with operation names.

## Invariants

- DATABASE_UNAVAILABLE != empty dataset.
- DATABASE_UNAVAILABLE != A$0 / FREE.
- Availability and verification freshness are separate dimensions.
- Only expected infrastructure failures degrade gracefully; application defects still throw.
- Production UI must not expose Prisma stack traces, DATABASE_URL, database hostnames or credentials.

## Deferred

Last-known-good snapshots/cached calculator data remain deferred to Phase 8.5.4 because they require explicit maximum-age, verification and stale-data policies.
