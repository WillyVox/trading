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
