# Phase 9.3.1 — Live provider evidence and worked examples

This milestone deepens the first high-authority guide batch without creating more indexable URLs.

## What changed

- `/guides/brokerage-fees-australia` now renders A$500, A$1,000 and A$5,000 ASX brokerage examples from the same verified `OfferingFee` records and brokerage calculation engine used by the calculator.
- `/guides/crypto-exchange-fees-australia` now renders A$1,000 examples from verified crypto fee records, keeping instant-buy, general trading, maker and taker execution paths distinct.
- Stale and unverified records are excluded from worked examples rather than converted to zero.
- Each evidence row exposes its verification date and official source link when present.
- The guide renderer accepts an evidence slot so future guides can add live evidence without duplicating the editorial template.
- Pages revalidate hourly, allowing verified database changes to flow into guide examples without rewriting article copy.

## Guardrails

Worked examples are educational scenarios, not rankings or recommendations. They do not name a winner. Brokerage examples model a standard online ASX buy that is not a first-buy concession and is not margin-loan settled. Crypto examples use a A$1,000 transaction and the base tier inputs where a structured tier is required. Variable costs, spreads, network fees and unsupported conditions remain visibly excluded.

## Source-of-truth rule

Provider-specific numerical claims shown in the live evidence tables come from the database and existing pure calculation engines, not duplicated guide constants. Editorial prose remains separate from provider pricing data.
