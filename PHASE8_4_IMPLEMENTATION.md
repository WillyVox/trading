# Phase 8.4 — Provider data quality, comparison integration & production verification

Implemented 22 Sep 2026.

## Integration improvements

- Share-trading detail payloads now include structured `OfferingFeature` and `OfferingProsCon` records.
- Share-trading profiles render source-linked platform features plus neutral “Documented capabilities” / “Documented limitations” sections.
- Share-trading comparison tables now include a Platform features section. Missing research remains null/blank rather than being converted to a negative claim; explicit false and unresolved values remain distinct.
- eToro's shared public provider slug is normalized to `etoro`. The share offering remains `etoro`; the crypto offering remains the separate `etoro-crypto` database offering. This keeps the existing crypto public-URL convention (provider slug) while avoiding an awkward `/crypto/exchanges/etoro-australia` public route.

## Admin data-quality visibility

`/admin/pricing-verification` now also surfaces active offering quality flags and a cross-model count of structured offering facts with no source URL. The existing fee-level verification workflow is unchanged.

## Regression coverage

- Canonical comparison ordering.
- Hyphenated provider slugs in `-vs-` routes.
- Duplicate comparison selections.
- Share-trading feature comparison semantics (available, unavailable, unresolved, missing).

## Deliberate boundaries

- No provider is ranked or labelled “best”.
- Missing facts are not treated as false and variable/unsupported fees are not treated as zero.
- Arbitrary pair pages remain `noindex`; only deterministic comparison hubs are indexable.
- No new provider fee claim was introduced in this phase; Phase 8.3 source manifests remain the factual basis for moomoo/eToro seed data.

## Validation

Run locally with the production dependency tree and target database:

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

## Legacy route cleanup

The duplicate page implementations under `/share-trading/compare` and `/crypto/exchanges/compare` were removed. `next.config.mjs` remains the single legacy-entry mechanism and permanently redirects those paths to the Phase 8.1 `/compare/...` canonical architecture. A source scan found no remaining old comparison-path references under `src` or `docs`.
