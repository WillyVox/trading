# Crypto exchange official-data audit — 22 Sep 2026

Scope: CoinSpot, CoinJar, Swyftx, Independent Reserve, BTC Markets, Kraken and eToro Australia.

## Changes

- Normalised user-facing fee labels so the provider name is not repeated inside provider-specific fee tables. Pricing context such as `Exchange`, `Pro`, `Markets`, payment method or transfer path is retained where it changes the meaning.
- CoinSpot: retained/expanded the official fee schedule covering Markets, OTC, Instant Buy/Sell/Swap, Take Profit/Stop/Limit, Recurring Buy, AUD funding/withdrawal methods and variable wallet withdrawal fees.
- CoinJar: verified retail conversion, Exchange fiat-pair tiers, crypto/stablecoin pairs, stablecoin/fiat pairs, AUD/PayPal funding and withdrawal, card purchase, recurring-buy and dynamic external transfer fees.
- Swyftx: verified the 30-day volume trading tiers and added AUD bank/PayID deposit, Stripe card deposit, AUD withdrawal and variable crypto-withdrawal fee records.
- Independent Reserve: verified the volume-based trading schedule and added Australian-card and PayPal AUD deposit fee records alongside existing AUD bank/withdrawal records.
- BTC Markets: verified Advanced Trade tiers, BTC-pair maker/taker rates and Simple Trade spread treatment; added free AUD deposit/withdrawal and the published BTC withdrawal fee.
- Kraken: verified the current spot maker/taker tiers, Instant Buy treatment, free Australian bank/Osko funding and withdrawals; verified Bitcoin staking availability in Australia. Kraken Opt-In Rewards and DeFi Earn remain unavailable in Australia and are not represented as staking availability.
- eToro Australia: retained the Australia-specific 1% open/close crypto fee and 2% platform-to-wallet transfer fee; normalised the transfer label without removing the important platform-to-wallet context.

## Verification policy

`VERIFIED` means the represented fact was supported by an official provider source. It is not an endorsement of the provider. Missing evidence is not converted to `false` or `$0`. Variable/network-dependent charges remain variable rather than being guessed.

Fee records checked in this audit use `verifiedAt: 2026-09-22`. Existing non-fee facts/features keep their prior verification date unless specifically rechecked in this audit.

## Primary official sources

- CoinSpot: https://www.coinspot.com.au/fees
- CoinJar Australia: https://www.coinjar.com/au/fees
- Swyftx trading fees: https://support.swyftx.com/en/articles/12005536-our-trading-fees
- Swyftx deposits/withdrawals: https://support.swyftx.com/en/articles/12004727-fees-for-deposits-and-withdrawals
- Independent Reserve: https://www.independentreserve.com/au/fees
- BTC Markets: https://www.btcmarkets.net/fees
- Kraken: https://www.kraken.com/features/fee-schedule and Australia support pages
- eToro Australia: https://www.etoro.com/au/trading/fees/
