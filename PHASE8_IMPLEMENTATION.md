# Phase 8 — Production hardening & launch readiness

Implemented in this pass:

1. Fixed the Crypto Fee Calculator's stale internal comparison URL (`/compare/crypto-exchanges` → `/crypto/exchanges/compare`).
2. Expanded `npm test` so the Phase 6/7 trading-cost, crypto-fee and crypto-cost suites are actually executed by the standard test command.
3. Added `npm run check:production`, a dependency-free production environment/readiness gate for site URL, database and auth-secret configuration, plus explicit warnings for manual legal/security blockers.
4. Added `docs/LAUNCH-READINESS.md` as the release checklist covering validation, legal/privacy, SEO, calculator trust, accessibility, security and operations.
5. Preserved the existing security headers and Report-Only CSP rather than prematurely enforcing a policy before real violation reports have been reviewed.
6. Preserved the existing `noindex` policy for arbitrary comparison combinations; the deterministic comparison hubs remain indexable and in the sitemap.

Not claimed complete by code alone:

- lawyer/legal review;
- host/edge rate limiting;
- CSP enforcement decision after observing reports;
- production secrets, database connectivity, migrations, backups or hosting configuration;
- browser/device accessibility testing;
- live Search Console/analytics verification.

These are launch gates, not things the repository can truthfully self-certify.
