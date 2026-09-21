# Tools Milestone 4 — CHESS vs Custody Explorer

Implemented `/tools/chess-vs-custody` as the first non-calculator Tool.

## Principles

- Educational, not a good/bad or winner ranking.
- CHESS is explained in its Australian-market context; a provider can have different custody structures by market.
- Platform examples come from `OfferingCustody`, not duplicated component constants.
- Verification status is preserved. UNVERIFIED rows remain visibly unverified.
- Source links and verified dates are shown where the database contains them.
- No Prisma migration was required.
- Existing glossary and custody label copy are reused rather than creating a second definition system.

## Data flow

`ProviderOffering -> OfferingCustody -> Market -> custody service -> explorer UI`

The explorer deliberately accepts unverified rows because its purpose includes showing the current evidence status. This differs from a numerical calculator, where unverified/stale data is not eligible to produce a trusted estimate.
