# Phase 8.5.0 — Database Dependency & Failure-Path Audit

Date: 22 September 2026
Scope: audit only. This milestone does not intentionally change application runtime behaviour.

## Objective

Map every material database dependency, classify whether it is required or optional to the user experience, identify current failure behaviour, and define the exact remediation order for Phase 8.5.1–8.5.3.

Core invariant for later milestones:

> DATABASE_UNAVAILABLE is not an empty result, A$0, FREE, STALE, or UNVERIFIED.

## Executive findings

1. Database access is cross-cutting. It is used by public provider/exchange pages, comparisons, calculators, CMS-backed guides/news, affiliate redirects, authentication, admin, sitemap generation, rate limiting, and live evidence embedded in otherwise-static guides.
2. The highest-value graceful-degradation opportunity is the separation between static/editorial content and live DB evidence. Phase 9.3 guides can remain useful even when their evidence panels cannot load.
3. Calculators must fail closed when their pricing/custody inputs cannot be retrieved. They must never convert an infrastructure failure to zero/free or to a legitimate empty set.
4. Provider and comparison detail pages currently use `notFound()` for legitimate missing records. Later resilience work must preserve the distinction between “record does not exist” (404) and “database could not be queried” (temporary unavailable).
5. CMS-backed `/guides`, `/guides/[slug]`, `/news`, and `/news/[slug]` are database-required even though several dedicated Phase 9.3 guide routes are code-backed and can degrade section-by-section.
6. `/go/[partner]` is operationally sensitive. If the DB cannot validate an active approved affiliate destination, it must fail closed rather than redirect using guessed/cached input.
7. Authentication/admin are database-required. A DB outage should produce an operator-safe unavailable state, not leak Prisma details.
8. `sitemap.ts` is DB-backed through `sitemap-entries.ts`. A DB outage can therefore affect sitemap generation independently of normal page rendering.
9. The shared repository abstraction does not itself distinguish infrastructure failure from a legitimate empty result. Later work should add resilience above/beside this boundary rather than returning `[]` from repository methods.

## Dependency matrix

| Surface                             | Main data path                             | Dependency class          | Correct DB-down behaviour                                                                         |
| ----------------------------------- | ------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------- |
| `/` homepage                        | featured crypto + share providers          | ENHANCEMENT               | Render page; replace featured data with degraded banner/section state                             |
| `/share-trading`                    | share platforms + latest content           | REQUIRED FOR FEATURE      | Keep shell/navigation; show provider data unavailable, not “no platforms”                         |
| `/share-trading/[slug]`             | provider offering, fees, custody, features | REQUIRED                  | Temporary unavailable state; do not convert DB failure to 404                                     |
| `/crypto/exchanges`                 | crypto offerings                           | REQUIRED FOR FEATURE      | Keep shell; show unavailable state, not empty exchange list                                       |
| `/crypto/exchanges/[slug]`          | exchange + affiliate + related content     | REQUIRED                  | Temporary unavailable state; do not convert DB failure to 404                                     |
| `/compare/trading-platforms`        | selector/provider facts                    | REQUIRED                  | Comparison unavailable; preserve explanatory/static shell where practical                         |
| `/compare/trading-platforms/[slug]` | comparison + selector data                 | REQUIRED                  | Temporary unavailable; only malformed/nonexistent canonical pair is 404                           |
| `/compare/crypto-exchanges`         | exchanges + affiliate links                | REQUIRED                  | Comparison unavailable; no empty-state masquerade                                                 |
| `/compare/crypto-exchanges/[slug]`  | comparison + selector data                 | REQUIRED                  | Temporary unavailable; preserve canonical redirect logic where possible                           |
| Brokerage calculator                | `OfferingFee` brokerage rules              | REQUIRED                  | Disable calculation; explicit pricing unavailable state                                           |
| FX calculator                       | FX fee rules                               | REQUIRED                  | Disable calculation; explicit pricing unavailable state                                           |
| Trading-cost calculator             | brokerage + FX rules                       | REQUIRED                  | Disable calculation; no partial “total” from missing component                                    |
| Regular-investing calculator        | brokerage rules                            | REQUIRED                  | Disable calculation rather than assume zero brokerage                                             |
| Crypto-fee calculator               | crypto fee rules/tiers                     | REQUIRED                  | Disable calculation; variable/missing must remain distinct                                        |
| Crypto funding/withdrawal tool      | funding/withdrawal fee rules               | REQUIRED                  | Disable data-dependent estimate                                                                   |
| Crypto combined-cost tool           | multiple crypto fee categories             | REQUIRED                  | Disable combined estimate if required data source unavailable                                     |
| CHESS vs custody tool               | custody records                            | REQUIRED                  | Tool unavailable; never infer custody from missing rows                                           |
| Phase 9.3 live evidence             | brokerage/custody/funding/coverage queries | ENHANCEMENT               | Keep guide body; replace evidence block only                                                      |
| `/guides`                           | Article/CMS queries                        | REQUIRED                  | Safe unavailable page state                                                                       |
| `/guides/[slug]`                    | Article + relationships + affiliate links  | REQUIRED                  | Temporary unavailable; do not emit false 404                                                      |
| `/news`                             | Article/CMS queries                        | REQUIRED                  | Safe unavailable page state                                                                       |
| `/news/[slug]`                      | Article/CMS query                          | REQUIRED                  | Temporary unavailable; do not emit false 404                                                      |
| `/providers` and provider services  | provider repository/service                | REQUIRED                  | Safe unavailable state                                                                            |
| `/go/[partner]`                     | affiliate link + click recording           | OPERATIONAL / FAIL CLOSED | No redirect when approved destination cannot be verified; safe response                           |
| Login/session/auth adapter          | Prisma Auth adapter + user lookup/update   | OPERATIONAL / REQUIRED    | Authentication unavailable message; no credential/internal error leakage                          |
| Registration/auth actions           | User DB writes/reads                       | OPERATIONAL / REQUIRED    | Safe retryable failure; do not report false validation/account state                              |
| Admin                               | pricing/articles/affiliates/settings       | OPERATIONAL / REQUIRED    | Explicit DB unavailable operator state                                                            |
| `/api/health`                       | DB probe                                   | OBSERVABILITY             | `degraded` + `database: unavailable`; no topology/credentials                                     |
| `sitemap.ts`                        | guide/news/provider/asset/offering entries | SEO INFRASTRUCTURE        | Later milestone should prevent raw Prisma failure; static entries should be considered separately |
| DB-backed rate-limit store          | Prisma storage                             | SECURITY/OPERATIONAL      | Must have explicit fail-open/fail-closed policy per protected action; never accidental            |

## Direct Prisma / repository hotspots

Direct or repository-backed DB access is concentrated in:

- `src/lib/crypto-exchanges/service.ts`
- `src/lib/share-trading/service.ts`
- `src/lib/providers/service.ts`
- `src/lib/articles/service.ts`
- `src/lib/affiliates/service.ts`
- `src/lib/tools/brokerage/service.ts`
- `src/lib/tools/fx/service.ts`
- `src/lib/tools/crypto-fees/service.ts`
- `src/lib/tools/custody/service.ts`
- `src/lib/guides/topic-evidence.ts`
- `src/lib/seo/sitemap-entries.ts`
- `src/lib/auth/config.ts` and auth actions
- `src/lib/security/rate-limit-store.ts`
- `src/lib/repository.ts`
- admin actions/pages and article import paths

This confirms the failure mode should be solved as a shared application concern rather than with isolated `try/catch { return [] }` patches.

## Failure semantics that must be preserved

### Legitimate empty result

The database query succeeded but no matching record exists. Examples: unknown provider slug, no published article, no active affiliate relationship. Existing 404/empty behaviour may be correct.

### Database unavailable

The query could not establish/use the DB connection. This is retryable infrastructure failure. It must become an explicit unavailable state.

### Stale/unverified business data

The database is available, but a pricing/evidence record is not eligible for calculation/display. This is a data-quality state, not an infrastructure state.

### Programming/schema/query defect

Invalid Prisma query, code bug, schema mismatch, impossible state, etc. These must continue to throw and reach normal error reporting. The resilience layer must not hide them.

## High-risk false-state conversions to prevent

- DB unavailable -> `[]` -> “No providers found”.
- DB unavailable -> missing fee -> A$0 / FREE.
- DB unavailable -> `null` -> `notFound()` -> false 404.
- DB unavailable -> missing feature/custody row -> “provider does not support feature”.
- DB unavailable -> missing affiliate row -> guessed/unvalidated external redirect.
- DB unavailable -> article query null -> false “article does not exist”.

## Remediation order for later milestones

### Phase 8.5.1 — resilience foundation

1. Central connectivity-error classifier.
2. Typed `DataResult<T>` / safe query boundary.
3. Structured server-side logging with operation names.
4. Apply first to public read paths and calculator data loaders.
5. Ensure only recognized infrastructure failures are converted; everything else throws.

### Phase 8.5.2 — public graceful degradation

1. Homepage optional DB sections.
2. All calculator/tool routes.
3. Provider/exchange indexes and details.
4. Comparison hubs/details.
5. Phase 9.3 evidence panels.
6. CMS-backed guides/news.
7. Preserve 404 semantics for successful queries that genuinely return no record.

### Phase 8.5.3 — operational safety net

1. Route/global/admin error boundaries.
2. Safe `/api/health` contract.
3. Auth/admin outage UX.
4. Affiliate redirect fail-closed behaviour.
5. Sitemap outage strategy.
6. Explicit rate-limit-store outage policy.
7. Regression tests for DB-down versus empty/stale/programming-error states.

## Acceptance tests for the completed 8.5 initiative

With PostgreSQL running: existing behaviour and calculations remain unchanged.

With PostgreSQL stopped:

- homepage still renders;
- navigation/footer/static/legal pages remain usable;
- DB sections clearly say unavailable;
- calculators produce no estimate;
- provider/comparison routes do not show false empty/404 states;
- code-backed guides remain readable and live-evidence panels degrade independently;
- CMS-backed guides/news fail safely;
- affiliate redirect fails closed;
- admin/auth show safe operational failures;
- health endpoint reports degraded without exposing DB internals;
- no Prisma stack trace appears in production UI.

With an intentional programming/query error: the error still throws and is observable; it is not converted to DATABASE_UNAVAILABLE.

## 8.5.0 conclusion

The audit supports proceeding with 8.5.1. The correct architecture is a typed, shared resilience boundary plus surface-specific degraded UI. A blanket Prisma catch, repository-level empty fallback, or global error page alone would be insufficient and could create misleading financial states.
