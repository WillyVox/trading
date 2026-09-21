# Tools Milestone 0 — Data and calculation-readiness audit

## Decision

Phase 1 must not introduce a universal fee rules engine or a speculative Prisma redesign. The existing structured offering models are sufficient to validate the Tools architecture with a deliberately constrained brokerage calculator, an educational FX calculator, and a CHESS/custody explorer.

## Existing reusable source of truth

- `ProviderOffering` scopes the product being researched.
- `OfferingFee` stores market-aware fee facts, calculation basis, source URL, verification status/date and promotional metadata.
- `OfferingFeeTier` supports trade-value tiers with explicit boundary semantics.
- `OfferingMarket` and `Market` identify market availability and currency context.
- `OfferingCustody` stores market-specific custody structure and HIN support.
- Existing SEO metadata, canonical, breadcrumbs, JSON-LD and sitemap helpers should be reused.
- Existing header/mobile navigation both consume `NAV_ITEMS`; Tools must be added there once only.

## Brokerage calculation capabilities

Safe to calculate when all required structured values are present and verified/current:

- `FLAT`
- `PERCENTAGE`
- `GREATER_OF`
- `TIERED` where tiers represent trade-value thresholds and contain a deterministic flat amount or percentage
- `FREE`

Not safe to calculate automatically:

- `VARIES`
- missing source/evidence where the product policy requires source-backed results
- stale/unverified data under the eventual freshness policy
- provider rules that require an input not represented by the engine (for example per-share quantity)
- rules described only in prose
- malformed/incomplete tier schedules

## Known modelling gaps

Do not patch these with provider-specific calculator code:

- per-share pricing
- independent minimum/maximum fee constraints
- rolling/monthly volume tier bases
- named pricing plans
- first-trade/day/security conditions
- payment-method conditions
- dynamic network fees
- variable spreads
- a general conditional-rule model
- normal fee effective/expiry dates separate from promotion dates
- explicit review-due/stale-after policy

These should be revisited only when a later approved tool genuinely requires them.

## Crypto warning

Do not build the crypto fee calculator in Phase 1. Some crypto pricing is described as tiered by rolling trading volume, while the current `OfferingFeeTier` semantics are trade-amount thresholds. Treating those as the same dimension would produce incorrect calculations.

## Calculator eligibility policy (derived, not persisted yet)

A provider-derived fee is calculator-eligible only when all relevant checks pass:

1. offering and market are supported;
2. calculation basis is supported;
3. required numeric fields exist;
4. tier structure is internally valid when tiered;
5. source URL exists;
6. verification state satisfies the approved freshness policy;
7. the rule does not require an unmodelled input or condition;
8. the applicable promotion, if any, is currently valid and unambiguous.

Failure must produce an explicit unavailable/partial/variable/stale state, never a guessed number and never zero by default.

## Freshness policy adopted for Milestone 2

Provider-derived brokerage calculations use a 45-day review window. A VERIFIED fee with a valid source and verification date inside that window may be calculator-eligible. Older pricing is withheld from the calculator until editorially re-verified. UNVERIFIED pricing is never presented as a verified estimate. This is an internal calculator safety policy, not a claim that every fee changes within 45 days; later tools may adopt a different evidence-appropriate review window.

## Phase 1 data decision

No Prisma migration is required for Milestone 1. Reuse the existing schema and prove the product architecture first.
