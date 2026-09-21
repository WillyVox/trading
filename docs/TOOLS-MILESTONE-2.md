# Tools — Milestone 2: Brokerage Cost Calculator

Milestone 2 proves the Tools calculation architecture against the existing structured `OfferingFee` data without changing Prisma.

## Scope

- Adds `/tools/brokerage-calculator`.
- Uses only active `SHARE_TRADING` offerings and `VERIFIED`, non-promotional `BROKERAGE` rows.
- Loads authoritative pricing and evidence on the server and serializes only the calculator rule DTO required by the client.
- Supports deterministic `FLAT`, `PERCENTAGE`, `GREATER_OF`, and `TIERED` value-based rules.
- Unsupported shapes return an explicit unavailable state rather than guessing.
- Provider-derived brokerage data has a 45-day review window for this tool. Verified rows older than that are withheld until re-reviewed; this is a calculator safety policy, not a claim that every fee changes within 45 days.
- Conditional `FREE` pricing is intentionally not automatically calculated in this milestone because the current schema cannot prove that a scenario satisfies conditions such as CMC's first-buy-per-security-per-day rule.
- Promotional rows are excluded because eligibility cannot be inferred from trade amount alone.

## Trust invariant

A numerical estimate is not enough. The result UI exposes the applicable published rule, calculation expression, assumptions/conditions, exclusions, source, verification status and verification date.

## Known limitations

The calculator does not yet model per-share pricing, pricing plans, monthly-volume tiers, first-trade/day/security conditions, tax, FX, market movement or unrelated account/third-party costs. Those limitations are deliberate and must not be represented as zero.
