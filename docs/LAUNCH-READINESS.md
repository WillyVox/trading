# Launch readiness — Phase 8

Phase 8 is a hardening pass, not a declaration that the site is legally or operationally ready to launch. A production release is ready only when the automated checks pass and the external/manual items below have been completed.

## Automated release gate

Run, in order:

```bash
npx prisma generate
npx prisma validate
npx tsc --noEmit
npm test
npm run lint
npm run format:check
npm run build
npm run check:production
```

`check:production` validates the production URL, database/auth-secret presence and reports known manual blockers. It deliberately does not invent or validate secrets.

## Manual launch blockers

- Privacy Policy and Terms of Use still contain explicit draft/legal-review markers. Obtain appropriate review and remove the markers only after the final wording is approved.
- Confirm the actual hosting/database processors and overseas data handling described by the Privacy Policy.
- Configure host/edge rate limiting for `/go/*` and auth endpoints.
- Observe CSP report-only violations in production/staging before switching to an enforcing CSP.
- Verify all affiliate disclosures and commercial-status wording against the partnerships that are actually active at launch.
- Verify production database migrations and seed strategy before running them against live data. Do not blindly reseed a production database if the seed deletes/recreates operational records.

## Search and navigation

- Canonical public comparison hubs are `/share-trading/compare` and `/crypto/exchanges/compare`.
- Arbitrary provider-combination URLs remain `noindex` until a separate SEO review establishes that they provide unique, durable search value.
- Tool pages use canonical base URLs; scenario/query-string variants must not become separate indexable pages.
- Sitemap entries should contain only real, indexable routes.

## Calculator trust rules

- Unknown, stale, variable, unsupported or network-dependent costs must never silently become zero.
- A combined total is shown only when components are calculable and denominated in a currency that can be added without inventing an exchange rate.
- Source URL, verification status/date and review lifecycle remain part of calculator-ready pricing.
- Provider ordering must not imply a recommendation or be changed because of affiliate commission.

## Manual UX/accessibility checks

Test public pages and all calculators at 320, 360, 390, 430, 768, 1024 and 1440 px. Check keyboard-only navigation, visible focus, labels, validation/error text, result announcements, menu operation, long provider names, empty states, stale/unverified states and source links. Run an automated accessibility audit as a supplement, not a substitute for keyboard/screen-reader checks.

## Operational checks

Verify production redirects, 404s, auth/admin access, affiliate redirects, CSP reporting, robots.txt, sitemap.xml, canonical tags, Open Graph images, database connectivity, logging and backup/restore procedures. Confirm that admin verification changes invalidate every pricing-dependent calculator.
