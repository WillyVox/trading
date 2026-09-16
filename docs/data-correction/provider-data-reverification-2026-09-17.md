# Provider Data Re-verification --- 17 September 2026

This document records the existing provider fields identified for
correction or improvement after checking them against current official
provider sources.

## Update summary

---

Provider Field Current seed Recommended update Official source

---

**Kraken** Maker fee Verify from Standard spot: **0.40% https://www.kraken.com/features/fee-schedule
official fee at Tier 1**, tiered  
schedule down to **0%**

**Kraken** Taker fee Verify from Standard spot: **0.80% https://www.kraken.com/features/fee-schedule
official fee at Tier 1**, tiered  
schedule down to **0.05% at Pro  
5**

**Kraken** Fee model Missing Qualifying fee tier can https://support.kraken.com/articles/cross-platform-fee-tier-changes
use **30-day spot  
volume or Assets on  
Platform (AoP)**

**Kraken** AUD funding Generic / Reverify supported AUD https://support.kraken.com/au/articles/360045033231-how-do-i-deposit-aud-
unverified funding using Kraken's  
Australian  
documentation

**Kraken** `lastVerifiedAt` Missing Set to actual Official Kraken sources above
verification date,  
e.g. `2026-09-17` for  
this research pass

**Independent Ownership IG acquired **Acquired by IG Group; https://www.independentreserve.com/blog/news/announcement-ig-group-completes-acquisition-of-independent-reserve
Reserve** 70%; founders acquisition completed  
retained 30% 30 January 2026**. Do  
not retain precise  
70/30 split without  
authoritative support.

**Independent Maker/taker model Separate maker Replace with official https://www.independentreserve.com/au/fees
Reserve** and taker **single  
records brokerage/trading-fee  
volume schedule**

**Independent Trading fee Maker from Official schedule https://www.independentreserve.com/au/fees
Reserve** 0.10%; taker starts at **0.50% and  
0.50% → 0.02% tiers down to 0.02% at  
AUD \$200m rolling  
30-day volume**

**Independent BTC withdrawal Approx. 0.0003 **0.0001 BTC** on https://www.independentreserve.com/au/fees
Reserve** BTC current official  
schedule

**Independent Listed assets Approx. 35--41 Remove approximate https://www.independentreserve.com/au
Reserve** third-party range;  
derive current  
list/count from  
official provider data

**CoinSpot** AUD funding PayID / POLi / Remove **POLi** from https://www.coinspot.com.au/learn/coinspot-101
wording bank transfer current wording.  
Current official  
material lists PayID,  
Direct Deposits,  
PayPal, PayTo, Card and
Cash

**CoinSpot** Operating entity Casey Block **Casey Block Services https://www.coinspot.com.au/public/CoinSpot%20Mastercard%20FSG.pdf?v=410
Services Pty Pty Ltd, ACN 619 574  
Ltd, 186, trading as  
third-party CoinSpot**, using  
source official disclosure

**CoinSpot** Founded 2013, Keep only with suitable https://www.coinspot.com.au
third-party current first-party  
source corporate/about  
evidence; remove  
reliance on third-party
citation

**CoinSpot** Asset count / 500+ / widest Use current official https://www.coinspot.com.au/markets
"widest" selection asset listing/count.  
Remove **"widest"**  
unless Trading Guide  
independently compares  
the relevant Australian
market

**CoinSpot** Thin-liquidity Third-party Remove from structured https://www.coinspot.com.au/markets
claim qualitative facts unless Trading  
claim Guide develops an  
objective liquidity  
methodology

**Swyftx** Asset count 410+ **No current correction https://swyftx.com/au/features/
required**; continue  
short-cycle  
verification

**BTC Markets** AUD/USDT trading 0.85% → 0.10% **No change required** https://www.btcmarkets.net/fees
fee based on current  
official schedule

**BTC Markets** BTC maker/taker -0.05% / 0.20% **No change required** https://www.btcmarkets.net/fees
for supported BTC  
market pairs
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Kraken

### Standard spot fees

Current official Kraken fee documentation supports replacing the
placeholders with:

- Tier 1 maker: **0.40%**
- Tier 1 taker: **0.80%**
- Standard maker rates can tier down to **0%**
- Taker rates can tier down to **0.05% at Pro 5**

Official source: https://www.kraken.com/features/fee-schedule

Kraken has separate schedules for some markets, including eligible
maker-rebate pairs. The seed should therefore label these as **Kraken
Pro standard spot fees** rather than implying one schedule applies to
every market.

### Fee-tier methodology

Kraken announced changes effective 9 July 2026. Its documentation
describes qualifying tiers using spot trading activity or Assets on
Platform (AoP).

Official source:
https://support.kraken.com/articles/cross-platform-fee-tier-changes

### Suggested seed values

```ts
{
  feeType: ProviderFeeType.MAKER,
  label: "Kraken Pro standard spot maker fee",
  valueType: FeeValueType.TIERED,
  percentage: 0.4,
  displayValue: "0.40% at Tier 1, tiered down to 0%",
  jurisdiction: "AU",
  sourceUrl: "https://www.kraken.com/features/fee-schedule",
  verificationStatus: VerificationStatus.VERIFIED,
  verifiedAt: new Date("2026-09-17"),
},
{
  feeType: ProviderFeeType.TAKER,
  label: "Kraken Pro standard spot taker fee",
  valueType: FeeValueType.TIERED,
  percentage: 0.8,
  displayValue: "0.80% at Tier 1, tiered down to 0.05% at Pro 5",
  jurisdiction: "AU",
  sourceUrl: "https://www.kraken.com/features/fee-schedule",
  verificationStatus: VerificationStatus.VERIFIED,
  verifiedAt: new Date("2026-09-17"),
}
```

## Independent Reserve

### Trading fee structure

The official Australian schedule presents a brokerage/trading fee based
on rolling 30-day AUD trading volume. It starts at **0.50%** and
decreases to **0.02% at AUD \$200 million**.

Official source: https://www.independentreserve.com/au/fees

Suggested representation:

```ts
{
  feeType: ProviderFeeType.TRADING,
  label: "Trading fee",
  valueType: FeeValueType.TIERED,
  percentage: 0.5,
  displayValue:
    "0.50% starting fee, tiered down to 0.02% based on rolling 30-day AUD trading volume",
  jurisdiction: "AU",
  sourceUrl: "https://www.independentreserve.com/au/fees",
  verificationStatus: VerificationStatus.VERIFIED,
  verifiedAt: new Date("2026-09-17"),
}
```

### Bitcoin withdrawal

Current official fee: **0.0001 BTC**.

Official source: https://www.independentreserve.com/au/fees

```diff
- 0.0003 BTC
+ 0.0001 BTC
```

### Ownership

Independent Reserve states that IG Group completed its acquisition
effective **30 January 2026**.

Official source:
https://www.independentreserve.com/blog/news/announcement-ig-group-completes-acquisition-of-independent-reserve

Recommended value:

```ts
{
  label: "Ownership",
  value: "Acquired by IG Group; acquisition completed 30 January 2026",
  jurisdiction: "AU",
  sourceUrl:
    "https://www.independentreserve.com/blog/news/announcement-ig-group-completes-acquisition-of-independent-reserve",
  verificationStatus: VerificationStatus.VERIFIED,
  verifiedAt: new Date("2026-09-17"),
}
```

Do not retain a precise 70% / 30% split unless an authoritative
transaction source confirms that exact post-completion ownership
structure.

### Listed assets

Remove an approximate third-party range such as `35–41`. Use an
officially derived current list/count or leave the field unverified.

Official provider: https://www.independentreserve.com/au

## CoinSpot

### AUD funding

Current CoinSpot material lists funding methods including:

- PayID
- Direct Deposits
- PayPal
- PayTo
- Card
- Cash

Official source: https://www.coinspot.com.au/learn/coinspot-101

Remove POLi from the current provider wording unless it is reconfirmed
by current official documentation.

### Operating entity

Official disclosure identifies **Casey Block Services Pty Ltd, ACN 619
574 186, trading as CoinSpot**.

Official source:
https://www.coinspot.com.au/public/CoinSpot%20Mastercard%20FSG.pdf?v=410

```ts
{
  label: "Operating entity",
  value: "Casey Block Services Pty Ltd (ACN 619 574 186)",
  jurisdiction: "AU",
  sourceUrl:
    "https://www.coinspot.com.au/public/CoinSpot%20Mastercard%20FSG.pdf?v=410",
  verificationStatus: VerificationStatus.VERIFIED,
  verifiedAt: new Date("2026-09-17"),
}
```

**Regulatory wording caution:** this FSG concerns financial services
associated with the CoinSpot Mastercard. It should not be used to imply
that every CoinSpot spot-crypto service falls within the same AFSL
scope.

### Asset count and "widest" claim

Remove **"widest coin selection of any Australian exchange"** unless
Trading Guide independently researches the relevant comparison universe
with a documented methodology.

Official asset/market source: https://www.coinspot.com.au/markets

### Liquidity claim

The existing "thin liquidity outside major coins" statement is
qualitative and third-party sourced. Remove it from structured factual
data unless Trading Guide develops an objective liquidity methodology.

## Swyftx

The current **410+ crypto assets** value remains supported by Swyftx's
official features material at this verification date.

Official source: https://swyftx.com/au/features/

No immediate correction is required. Keep this field on a short
verification cycle because supported assets change.

## BTC Markets

The current official fee schedule continues to support:

- AUD/USDT exchange fee: **0.85% at the lowest volume tier**
- Fee decreases to **0.10% above \$5 million rolling volume**
- Supported BTC-pair maker rate: **-0.05%**
- Supported BTC-pair taker rate: **0.20%**

Official source: https://www.btcmarkets.net/fees

No correction is required for those existing fields.

## Recommended verification hierarchy

For Trading Guide, prefer this hierarchy before marking structured data
`VERIFIED`:

1.  Official fee schedule or product documentation
2.  Official legal/regulatory disclosure
3.  Official provider support documentation
4.  Official company announcement
5.  Government or regulator source
6.  Reliable third-party reporting/review --- normally `UNVERIFIED`
    until confirmed by a primary source

Third-party reviews are useful for discovering facts, but a structured
field marked `VERIFIED` should preferably link to the provider or
regulator that owns the fact.

## Highest-priority changes

```text
Kraken
  Maker fee          placeholder → 0.40% → 0%
  Taker fee          placeholder → 0.80% → 0.05%
  Fee methodology    missing → qualifying volume/AoP model
  Sources            generic → specific official documentation

Independent Reserve
  Fee representation separate maker/taker → official trading-fee schedule
  Trading fee        0.50% → 0.02%
  BTC withdrawal     0.0003 → 0.0001 BTC
  Ownership          IG acquisition completed 30 Jan 2026
  Asset count        remove approximate 35–41

CoinSpot
  POLi                remove from current funding wording
  Operating entity   retain value, replace third-party source
  "widest" claim     remove unless independently demonstrated
  liquidity claim    remove from structured factual data

Swyftx
  410+ assets         no current change

BTC Markets
  0.85% → 0.10%      no current change
  -0.05% / 0.20%     no current change
```

---

_Research checked: 17 September 2026. Fee schedules, supported assets,
funding methods and regulatory information can change. Reverify
time-sensitive fields before publication._
