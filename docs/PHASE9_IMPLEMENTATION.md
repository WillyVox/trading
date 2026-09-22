# Phase 9 — Provider Reviews, High-Value Comparison Pages & SEO Content Engine

Implemented 22 Sep 2026.

## Scope

- Added an explicit curated-comparison registry. Only editorially selected comparison pairs are indexable; arbitrary selector-generated combinations remain `noindex`.
- Added substantive editorial context to curated pair pages: purpose, coverage, methodology link and related comparisons.
- Added curated comparison discovery to both comparison hubs and provider review pages.
- Added curated pair URLs to the sitemap without generating the combinatorial pair universe.
- Strengthened provider review pages with a visible explanation of how Trading Guide builds reviews and why it does not assign an overall score/winner.
- Added regression tests for canonical/unique curated comparison slugs and editorial completeness.

## Initial curated pages

Share trading: CommSec/Stake, CMC Invest/CommSec, moomoo/Stake, eToro/moomoo.
Crypto: CoinSpot/Swyftx, CoinSpot/Kraken, CoinSpot/Independent Reserve, eToro/CoinSpot.

## SEO guardrails

- No auto-indexing of every possible provider pair.
- No fabricated Review/AggregateRating schema or star scores.
- No winner/best labels generated from structured data.
- Unknown, variable and conditional costs retain their existing semantics.
- Existing provider/profile facts remain the source of truth; curated pages do not duplicate fee facts.

## Follow-up

Use Search Console after deployment to inspect indexing/canonicalization. Expand the curated registry only when a pair has enough verified data and distinct editorial value. Provider-specific long-form editorial reviews can later be moved into the CMS if the team wants named authors/reviewers and richer editorial narratives.

## Phase 9.1 — Content depth and search-intent clusters

See `PHASE9_1_IMPLEMENTATION.md`. Share-trading and crypto learning hubs now connect guides, calculators, provider research and curated comparisons through visible contextual internal links. This expands content depth without increasing the number of curated/indexable provider-pair pages.

## Phase 9.2

Phase 9.2 adds a 50-item search-intent editorial roadmap in `src/lib/seo/content-opportunities.ts`. It is intentionally a publishing queue rather than a page generator: BUILD_NOW/NEXT/LATER opportunities require research and editorial review, while DO_NOT_BUILD entries preserve explicit guardrails against thin/combinatorial SEO. See `PHASE9_2_IMPLEMENTATION.md`.
