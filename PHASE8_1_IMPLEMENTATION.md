# Phase 8.1 — Comparison URL Architecture Migration

Implemented 2026-09-22.

## Canonical routes

- `/compare`
- `/compare/trading-platforms`
- `/compare/trading-platforms/[slug]`
- `/compare/crypto-exchanges`
- `/compare/crypto-exchanges/[slug]`

Comparison slugs remain alphabetically canonicalised by `canonicalCompareSlugMulti`, so reversed provider order redirects to one URL. Pair pages therefore use `provider-a-vs-provider-b`; the existing engine also continues to support 3–4 provider comparisons.

## Migration behaviour

Permanent Next.js redirects preserve old bookmarks and inbound links:

- `/share-trading/compare` → `/compare/trading-platforms`
- `/share-trading/compare/:slug` → `/compare/trading-platforms/:slug`
- `/crypto/exchanges/compare` → `/compare/crypto-exchanges`
- `/crypto/exchanges/compare/:slug` → `/compare/crypto-exchanges/:slug`

All application links, metadata paths, breadcrumbs, sitemap hub entries, tools and guide CTAs now use the new canonical namespace. Arbitrary pair/multi-provider pages remain `noindex` pending a separate SEO publication policy; the deterministic hubs remain indexable.

## Additional regression repair

The crypto-fee unit test was restored to the repository's Node-native `node:test` + `node:assert/strict` runner. This removes the accidental Vitest/CommonJS import failure while leaving calculator logic unchanged.
