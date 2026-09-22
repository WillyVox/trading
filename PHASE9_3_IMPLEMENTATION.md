# Phase 9.3 — First High-Authority Content Batch

Implemented 22 September 2026.

## Goal

Execute the Phase 9.2 editorial roadmap rather than generating pages mechanically. Eight BUILD_NOW opportunities now have hand-authored, indexable guides connected to Trading Guide tools, provider research and methodology.

## Published guides

- `/guides/brokerage-fees-australia`
- `/guides/chess-vs-custody`
- `/guides/what-is-a-hin`
- `/guides/fractional-shares-australia`
- `/guides/crypto-exchange-fees-australia`
- `/guides/austrac-crypto-registration`
- `/guides/crypto-exchange-funding-australia`
- `/guides/trading-costs-explained`

## Source policy

The batch uses current first-party Australian sources: Moneysmart, ASX and AUSTRAC. Provider-specific live prices remain in structured provider/fee records rather than being copied into evergreen guide prose.

## Architecture

`ResearchGuidePage` supplies a consistent article shell with Article + Breadcrumb structured data, visible source list, review date, methodology link, key takeaways, table of contents and contextual next actions.

`PUBLISHED_CONTENT_OPPORTUNITY_IDS` links the editorial roadmap to execution state without requiring Article database IDs to match opportunity IDs.

## Guardrails

- No overall provider winners or ratings.
- No mass-generated pair pages.
- No variable/unknown fee treated as zero.
- No claim that AUSTRAC registration is an investment endorsement.
- No provider-specific price copied into these evergreen guides unless the page is intentionally maintained for that purpose.
- Every guide states its review date and links to primary sources.
