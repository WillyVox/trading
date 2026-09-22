# Phase 8.5.1 — Central Database Resilience Foundation

Date: 22 September 2026

## Scope

This milestone establishes the shared server-side contract for recognizing a temporary database outage. It intentionally does **not** add public fallback UI yet; that belongs to Phase 8.5.2.

## Added

- `src/lib/data/database-errors.ts`
  - narrowly classifies connectivity/timeout/closed-connection failures;
  - recognizes Prisma codes P1001, P1002, P1008 and P1017;
  - recognizes the observed `Can't reach database server` failure when Prisma does not expose a useful code;
  - deliberately does not classify P1000 authentication/configuration failures, constraint/query failures, schema defects, or ordinary programming errors as temporary outages.
- `src/lib/data/safe-database-query.ts`
  - returns a typed `DataResult<T>`;
  - preserves legitimate `null`, `[]`, `0`, etc. inside the success branch;
  - converts only recognized availability failures to `DATABASE_UNAVAILABLE`;
  - rethrows everything else;
  - emits structured, sanitized server logging with operation name and safe error metadata.
- regression tests for the classifier.

## Contract

```text
successful query, including []/null -> { ok: true, data }
recognized DB outage             -> { ok: false, reason: DATABASE_UNAVAILABLE, retryable: true }
programming/config/query error    -> throw
```

The boundary never manufactures fallback data. In particular:

```text
DATABASE_UNAVAILABLE != []
DATABASE_UNAVAILABLE != null
DATABASE_UNAVAILABLE != A$0
DATABASE_UNAVAILABLE != FREE
DATABASE_UNAVAILABLE != STALE
```

## Why no page changes yet

Phase 8.5.0 found several surfaces where `null` legitimately means 404 and `[]` legitimately means an empty result. Converting services globally without updating their consumers in the same change would create ambiguous behaviour. Phase 8.5.2 will adopt this boundary surface-by-surface and render explicit unavailable states.

## Next milestone

Phase 8.5.2 should apply `safeDatabaseQuery()` at route/server-component boundaries for homepage enhancement data, calculators, provider/exchange pages, comparisons, and Phase 9.3 live evidence, with reusable unavailable-state UI. It must preserve genuine 404 and empty-result semantics.
