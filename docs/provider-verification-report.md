# Provider Verification Launch Report

Generated: 2026-09-24  
Freshness threshold: 90 days

This report audits the seeded provider catalog. It does **not** make affiliate status a condition of research verification, and provider verification does **not** control whether a valid official website can be shown as `Visit site`.

## Summary

- Providers checked: 13
- Blocking verification errors: 0
- Warnings requiring review: 4
- Safe to display `Data verified`: 9

## Catalog

| Provider | Catalog | Seed status | Last provider verification | Evidence URLs | Safe verified badge | Outstanding items |
| --- | --- | --- | --- | ---: | --- | --- |
| CMC Markets | Share trading | UNVERIFIED | 2026-09-17 | 11 | NO | WARN: provider remains UNVERIFIED although some individual claims are verified (allowed; review unresolved fields before upgrading) |
| Commonwealth Bank of Australia | Share trading | UNVERIFIED | 2026-09-17 | 12 | NO | WARN: provider remains UNVERIFIED although some individual claims are verified (allowed; review unresolved fields before upgrading) |
| eToro AUS Capital Limited | Share trading | VERIFIED | 2026-09-22 | 5 | YES | — |
| Interactive Brokers Australia Pty. Ltd. | Share trading | UNVERIFIED | 2026-09-19 | 6 | NO | WARN: provider remains UNVERIFIED although some individual claims are verified (allowed; review unresolved fields before upgrading) |
| Moomoo Securities Australia Ltd | Share trading | VERIFIED | 2026-09-22 | 8 | YES | — |
| Stakeshop Pty Ltd | Share trading | UNVERIFIED | 2026-09-19 | 2 | NO | WARN: provider remains UNVERIFIED although some individual claims are verified (allowed; review unresolved fields before upgrading) |
| BTC Markets | Crypto exchange | VERIFIED | 2026-09-17 | 19 | YES | — |
| CoinJar | Crypto exchange | VERIFIED | 2026-09-17 | 45 | YES | — |
| CoinSpot | Crypto exchange | VERIFIED | 2026-09-17 | 29 | YES | — |
| eToro AUS Capital Limited | Crypto exchange | VERIFIED | 2026-09-22 | 6 | YES | — |
| Independent Reserve | Crypto exchange | VERIFIED | 2026-09-17 | 24 | YES | — |
| Kraken | Crypto exchange | VERIFIED | 2026-09-17 | 19 | YES | — |
| Swyftx | Crypto exchange | VERIFIED | 2026-09-17 | 25 | YES | — |

## Gate rules

A seeded provider marked `VERIFIED` fails the launch gate when its provider-level verification date is missing/stale, it has no source evidence, a seeded claim remains `UNVERIFIED`, an evidence URL is malformed, or a review-due date has passed. `UNVERIFIED` is an acceptable research state and does not fail merely because information is unknown.

Warnings flag mixed verification states, old evidence that has not yet crossed a specific review date, and research evidence URLs carrying affiliate/referral parameters.

## Manual primary-source review still required

Before upgrading any provider to `VERIFIED`, confirm the material comparison fields against primary sources: official website/entity, ASIC or AUSTRAC/VASP status where applicable, fees, CHESS/custody, markets/assets, deposits/withdrawals, and the source date. Commercial affiliate status is reviewed separately and must never be inferred from research data.
