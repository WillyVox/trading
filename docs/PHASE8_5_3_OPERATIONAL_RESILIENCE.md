# Phase 8.5.3 — Operational resilience

This phase completes the first resilience initiative around temporary PostgreSQL outages.

## Behaviour

- `src/app/error.tsx` and `src/app/global-error.tsx` are final safety nets for unexpected route/application failures. Expected database outages should normally be handled closer to the affected surface by Phase 8.5.2.
- `/api/health` performs a minimal `SELECT 1`. It returns `200 {status:"healthy",database:"available"}` or `503 {status:"degraded",database:"unavailable"}` and never exposes database topology or Prisma messages.
- `/go/[partner]` fails closed with 503 when the database cannot confirm an active approved affiliate destination. A failure to record a click after an approved link has already been resolved remains non-blocking; the redirect is still safe and the under-count is logged.
- Login and registration fail closed when the Postgres-backed rate limiter is unavailable. Registration also returns a generic temporary-service message if its user lookup/create cannot reach the database.
- Admin layout denies access when it cannot re-check the current ADMIN role. Child admin failures fall through to `admin/error.tsx`; mutations must never be assumed successful after an error.
- `sitemap.ts` always keeps static/indexable routes available. If PostgreSQL is temporarily unavailable, dynamic DB-backed entries are omitted for that request rather than crashing the entire sitemap. Unexpected query/programming errors still throw.
- Existing `safeDatabaseQuery()` structured `DATABASE_UNAVAILABLE` logs remain the common outage signal. Public responses do not include hostnames, URLs, credentials, query text, or raw Prisma messages.

## Rate-limit policy

The application uses Postgres for low-volume auth throttling and expects edge/WAF controls for high-volume paths. For authentication, store unavailability is **fail closed**: the app does not silently disable rate limiting. Edge rate limiting remains an independent production requirement documented in `docs/EDGE-RATE-LIMITING.md`.

## Recovery expectations

No sticky in-process "database down" flag is introduced. Once PostgreSQL is restored, the next request can query it normally and public surfaces recover without a deploy/restart.

## Deferred

Last-known-good data snapshots/cache remain Phase 8.5.4 and are intentionally not implemented here.
