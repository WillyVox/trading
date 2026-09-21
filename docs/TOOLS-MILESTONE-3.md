# Tools Milestone 3 — FX Fee Calculator

## Scope

Milestone 3 implements the Phase 1 FX Fee Calculator in **educational mode**.

The calculator accepts a hypothetical AUD amount and a user-entered percentage fee, then explains the percentage arithmetic, assumptions and exclusions. It does not claim the entered rate belongs to any provider.

## Why provider-data mode is deferred

The current share-trading seeds demonstrate multiple materially different FX pricing shapes:

- Stake and CommSec contain verified percentage-based FX conversion rows.
- CMC Invest records FX pricing as `VARIES` because its Australian pricing material does not provide a fixed percentage in the seeded evidence.
- Interactive Brokers contains an unverified percentage row and notes a separate client-initiated conversion structure with a minimum charge that the current fee model does not fully represent.

A provider-data calculator must therefore have its own eligibility policy and must never convert `VARIES`, unknown, stale or unsupported pricing to zero. That work remains a later Phase 1 milestone after this educational calculator proves the shared tool/result UX.

## Implemented

- `/tools/fx-fee-calculator`
- Percentage fee calculation engine
- Input validation and currency rounding
- Explainable calculation steps
- Assumptions and exclusions
- Explicit educational-mode source status
- Responsive calculator UI
- Metadata, canonical integration through existing helpers, breadcrumb JSON-LD
- Sitemap entry
- Tools catalog marked available
- Unit tests for normal, zero-rate, rounding and invalid-boundary cases

## Formula

`fee = amount × (percentage / 100)`

The output is rounded to two decimal places for the displayed AUD fee.

## Safety rules

- The amount must be greater than zero and at most A$1 billion.
- The percentage must be between 0% and 100%.
- A user-entered 0% is a valid mathematical input; it is not used to represent unknown provider pricing.
- No exchange rate is inferred.
- No FX spread is inferred.
- No provider fee is inferred.
- No recommendation or ranking is produced.
- User-entered amounts are not sent to analytics by this implementation.

## Database

No Prisma migration is required for Milestone 3.
