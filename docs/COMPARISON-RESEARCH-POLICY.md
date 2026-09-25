# Comparison research policy

Last reviewed: 2026-09-26

## Principle: store more, display less

Provider and Offering seed data is the research record. Comparison tables are a curated decision surface, not a dump of every stored fact, fee, market or feature.

Research can therefore become more complete without increasing the default comparison height.

## Evidence policy

Prefer current primary sources in this order:

1. provider pricing / fee schedules;
2. provider product and platform documentation;
3. provider FSG/PDS or equivalent legal disclosure;
4. regulator / exchange registers and official publications;
5. provider help centres for operational features.

Comparison sites such as Finder and Canstar are used to study user-facing comparison design and common decision fields, not as the canonical source for Trading Guide provider claims when a primary source is available.

`verifiedAt` means the specific claim was checked against its cited source on that date. Do not bulk-update verification dates merely because a provider file was edited.

## Review cadence

- Fees, spreads, brokerage, FX, funding/withdrawal charges: target 30–45 days.
- Product/features/market access/funding methods: target about 90 days.
- Custody/account types/entity/regulatory facts: target about 180 days unless a known change requires earlier review.

## Crypto default comparison

Default rows focus on decision value:

- spot / standard trading fee;
- instant buy / conversion fee;
- spread where separately published;
- AUD bank / PayID deposit;
- cryptocurrency selection where verified;
- PayID;
- recurring buys;
- staking;
- API access;
- two-factor authentication;
- cold-storage controls;
- AUSTRAC registration status where the seed contains sourced AUSTRAC evidence.

Secondary/expanded rows may include card funding, AUD withdrawal, crypto withdrawal, mobile/web availability, advanced charting, OTC, SMSF and copy trading.

Do not turn headquarters, founding year, customer count, ABN/legal entity or every network withdrawal fee into default comparison rows. Those facts remain useful on profiles and in research evidence.

AUSTRAC registration must be labelled as registration, not as a generic claim that the exchange is “regulated”.

## Share-trading default comparison

Default rows focus on:

- ASX brokerage;
- US brokerage;
- FX conversion;
- account/inactivity fees where recorded;
- ASX ownership/custody model;
- summarized market access;
- ETFs;
- recurring investing;
- advanced charting;
- SMSF support.

Secondary/expanded rows may include options, bonds, futures, forex, mobile app and web platform.

Do not create a separate default row for every exchange, every account type, every product or every conditional brokerage rule. Detailed rules remain in structured seed data and profile pages.

## Promotions

Promotional fees do not replace standing fees in comparisons. Promotions can be shown separately on profile/offer surfaces with eligibility and expiry context.

## Research independence

Affiliate/commercial status does not determine comparison rows, research conclusions, ordering, verification or factual presentation. Commercial configuration controls outbound destination/tracking only.

## Market-access representation

Market access has two complementary representations:

1. `OfferingMarket` rows are structured exchange-level evidence where the provider publishes a sufficiently explicit list. They support profile detail, fee/custody scoping and future filters.
2. A sourced `OfferingFeature` with `featureType: OTHER`, `label: "Market access"` is the concise breadth summary used by the comparison table when raw exchange-row counts would be misleading.

Do not infer total market breadth from the number of `OfferingMarket` rows. Providers describe coverage differently (country markets, exchanges, venues, or multi-asset markets), and some have coverage too broad to model exhaustively just for a comparison cell.

The comparison should prefer the researched Market access summary and use seeded exchange rows only as a fallback. This is a temporary normalized seam; if market breadth becomes a filter/calculator input, promote it to a dedicated typed field rather than adding more `OTHER` feature conventions.

## Representative ASX brokerage scenario

Share-trading comparisons may show a representative brokerage calculation in addition to the published headline fee rows. The scenario is a presentation layer over the existing verified brokerage calculator rules; it must not maintain a second set of pricing formulas.

Default scenario assumptions:

- online ASX buy;
- first eligible buy of that security on the day;
- no margin-loan settlement;
- Standard pricing plan where a provider explicitly names one, or Fixed for Interactive Brokers;
- CommSec uses its online CDIA/Margin Loan settlement schedule as the representative standard-settlement schedule.

Only rules that pass the calculator verification/freshness/source eligibility checks may produce a numeric estimate. `VARIES`, stale, unverified or structurally incomplete pricing must render as not calculable rather than being approximated. Promotions are excluded from the brokerage service and therefore cannot silently become the representative cost.

The result is brokerage only. It must not be described as total investing cost because FX, spreads, taxes, exchange/pass-through charges, subscriptions and other costs may apply. A future international scenario may combine brokerage and FX only where both components are deterministic from the user's supplied inputs.
