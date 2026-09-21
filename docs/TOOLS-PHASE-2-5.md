# Tools Phase 2.5 — Advanced Brokerage Rules

Implemented 22 Sep 2026.

- Relevant providers remain visible even when a calculation is unavailable.
- Scenario-aware brokerage rules support order side, pricing plan, first-buy-per-security-per-day, trade-value bounds, margin-loan exclusion and GST.
- CMC Invest Standard ASX rules model the conditional first eligible buy under A$1,000 and the published fallback pricing. International $0 brokerage remains explicitly separate from FX spreads.
- Interactive Brokers Australia Fixed ASX pricing uses the official Australian stocks commission schedule: 0.08% with A$6 minimum, exclusive of GST; the calculator adds 10% GST. Tiered pricing remains out of scope until monthly trade-value inputs and third-party fees are modelled.
- Unknown, stale and variable data are never treated as zero.
