# Phase 9.3.2 — Topic-specific live evidence

This milestone extends the Phase 9.3.1 evidence slot to five additional high-authority guides without forcing fee tables onto non-fee topics.

## Evidence mapping

- `/guides/chess-vs-custody` → verified `OfferingCustody` records by provider and market.
- `/guides/what-is-a-hin` → verified ASX custody records and `hinSupported`.
- `/guides/fractional-shares-australia` → verified provider research records that explicitly mention fractional shares. Missing evidence is omitted, never interpreted as `false`.
- `/guides/crypto-exchange-funding-australia` → verified `FIAT_DEPOSIT`, `FIAT_WITHDRAWAL` and `CRYPTO_WITHDRAWAL` fee records.
- `/guides/trading-costs-explained` → a coverage map of verified structured cost components for share-trading and crypto offerings.

## Trust rules

1. Only VERIFIED records are surfaced in these live panels.
2. Missing evidence never means zero, unavailable or unsupported.
3. Variable/network-dependent fees remain variable.
4. Evidence panels are descriptive and do not label a provider best, cheapest, safest or recommended.
5. Provider facts remain in the structured database; guide prose does not duplicate dynamic fee values.
6. Pages revalidate hourly so verified database updates can flow to the guide layer.

## Source hierarchy

Guide-level explanations continue to use official Australian sources such as ASX, Moneysmart and AUSTRAC. Provider-specific rows use the source URL stored with the verified provider fact.
