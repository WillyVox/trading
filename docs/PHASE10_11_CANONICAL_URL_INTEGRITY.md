# Phase 10.11 — Canonical URL & Internal Link Integrity

## Canonical article routes

- GUIDE → `/guides/[slug]`
- NEWS → `/news/[slug]`
- Crypto provider → `/crypto/exchanges/[slug]`
- Share-trading provider → `/share-trading/[slug]`
- Crypto comparison → `/compare/crypto-exchanges`
- Share-trading comparison → `/compare/trading-platforms`
- Tools → `/tools/[slug]`

`src/lib/routes/route-registry.json` is the machine-readable route contract. `site-routes.ts` exposes typed builders for application code.

## Current remediation

- Replaced processed-article links from `crypto/exchanges/compare` with `/compare/crypto-exchanges`.
- Updated stale article-generation instructions from legacy compare URLs to canonical compare URLs.
- Corrected the GuideSidebar default comparison route.
- Corrected the stale SEO comment that showed `/crypto/...` as an article example.
- Added admin/import validation that blocks relative internal article links, known legacy routes and obsolete market-specific article namespaces.
- Added `npm run check:internal-links` and wired it into `npm run launch:gate`.

## Policy

Legacy routes remain available as redirects for old external/bookmarked URLs, but new internal content must link directly to canonical destinations. Ordinary editorial links to providers should normally point to provider research/profile pages; `/go/[partner]` remains a separate commercial redirect route and should be used deliberately for affiliate CTAs.

## Scope and limitation

The release scanner covers the static guide/content surfaces and `publish_article` dataset/configuration where route drift is most likely. Dynamic CMS records in the production database cannot be proven from the source archive; the same validator is therefore applied on admin article saves/imports. A later admin URL-health dashboard can reuse this validation engine for existing database content.
