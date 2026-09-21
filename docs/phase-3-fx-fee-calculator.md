# Phase 3 — FX Fee Calculator

Phase 3 upgrades `/tools/fx-fee-calculator` from a user-entered educational percentage example to a provider-data calculator.

## Supported verified provider rules

- CommSec: 0.55% foreign-exchange fee per conversion.
- Stake: 55 bps (0.55%) on AUD/USD fund transfers for Wall St; not a per-trade FX fee once funded.
- Interactive Brokers Australia: 0.03% automated currency-conversion adjustment. Manual/client-initiated spot FX is deliberately not modelled because its minimum is denominated in USD and needs a different scenario model.
- CMC Invest: 0.60% published FX spread on international orders. The result is labelled as an estimate because the actual execution exchange rate can move.

## Trust rules

Only verified, HTTPS-sourced, in-review structured percentage rules are calculator-ready. Variable, stale, unverified, or unsupported rules remain visible but do not become a false zero.

The calculator does not fetch or predict a live exchange rate and does not claim to calculate brokerage or every cost of an international trade.
