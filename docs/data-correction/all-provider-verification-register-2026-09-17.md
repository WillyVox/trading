# Trading Guide --- Provider Verification Register

**Research date:** 17 September 2026\
**Scope:** BTC Markets, CoinSpot, Kraken, Independent Reserve and
Swyftx\
**Method:** Prefer current first-party provider documentation. Where a
field cannot be supported confidently by a current primary source, it is
marked `UNVERIFIED` rather than filled from an old review.

> **Important:** `VERIFIED` means the stated field was supported by the
> linked source at the research date. It does not mean the provider,
> product, investment, security model or regulatory status is endorsed
> or guaranteed. Fees, asset listings, payment methods and regulatory
> scope can change.

---

# 1. BTC Markets

## Provider-level fields

---

Field Latest value Status Source

---

Name BTC Markets VERIFIED https://www.btcmarkets.net

Slug `btc-markets` Internal ---

Website `https://www.btcmarkets.net` VERIFIED https://www.btcmarkets.net

Description Australian cryptocurrency exchange VERIFIED https://www.btcmarkets.net ;
offering Advanced Trade/order-book https://www.btcmarkets.net/fees
markets and Quick Buy/Sell, with AUD  
funding and Australian operations

Provider type `CRYPTO_EXCHANGE` VERIFIED https://www.btcmarkets.net

Jurisdiction Australia VERIFIED https://www.btcmarkets.net/regulation

Verification `VERIFIED` --- Based on sources below
status

Last verified `2026-09-17` --- This research pass

Seed asset BTC, ETH, SOL, XRP PARTIAL These are representative seed symbols,
symbols not a complete asset list. Use
https://www.btcmarkets.net for current
markets.

Logo `/images/providers/btc-markets.svg` Internal ---
--------------------------------------------------------------------------------------------------------------------

## Facts

---

Field Latest value Status Source

---

Headquarters / Australia VERIFIED https://www.btcmarkets.net
market

AUD support Yes VERIFIED https://www.btcmarkets.net/fees

Platform type Centralised VERIFIED https://www.btcmarkets.net
cryptocurrency  
exchange

Trading **Advanced VERIFIED https://www.btcmarkets.net/fees
interfaces Trade/order book  
and Quick  
Buy/Sell**

AUSTRAC status Registered with VERIFIED https://www.btcmarkets.net/terms-of-service ;
AUSTRAC as a https://www.btcmarkets.net/regulation
VASP; BTC  
Markets'  
regulation page  
also describes  
it as a  
registered  
Digital Currency  
Exchange
-----------------------------------------------------------------------------------------------------

### Recommended wording change

The current seed says **"Simple Trade"**. The current official fee page
uses **"Quick Buy/Sell"**, so update the label and related prose to the
provider's current terminology.

## Fees

---

Field Latest value Status Source

---

AUD/USDT Advanced **0.85% at VERIFIED https://www.btcmarkets.net/fees
Trade fee \$0.01--\$500  
rolling 30-day  
volume,  
decreasing  
through tiers to  
0.10% above  
\$5m**

Supported **-0.05% maker VERIFIED https://www.btcmarkets.net/fees
BTC-pair maker rebate**  
fee

Supported **0.20%** VERIFIED https://www.btcmarkets.net/fees
BTC-pair taker  
fee

Quick Buy/Sell Variable spread VERIFIED https://www.btcmarkets.net/fees
pricing included in  
quoted price; no  
additional Quick  
Buy/Sell trading  
fee

AUD Use the current VERIFIED SOURCE https://www.btcmarkets.net/fees
funding/deposit Deposit &  
fees Withdrawal Fees  
section rather  
than hard-coding  
historical  
payment-method  
assumptions

Crypto withdrawal Asset/network VERIFIED SOURCE https://www.btcmarkets.net/fees
fees specific and  
time-sensitive;  
read from current  
fee schedule  
rather than  
storing as  
permanent facts
-------------------------------------------------------------------------------------------

## Features

---

Field Latest value Status Source

---

AUD deposits Yes VERIFIED https://www.btcmarkets.net/fees

PayID Supported in existing VERIFIED https://www.btcmarkets.net
official funding  
documentation; recheck  
before publishing  
payment-method-specific  
limits

Bank transfer Supported VERIFIED https://www.btcmarkets.net

Card deposit Existing provider VERIFIED / https://www.btcmarkets.net
documentation supports TIME-SENSITIVE
card funding; recheck  
fee/limits before  
publishing

Mobile app Yes VERIFIED https://www.btcmarkets.net

API access Yes VERIFIED https://docs.btcmarkets.net/

Two-factor Yes VERIFIED https://www.btcmarkets.net
authentication

Cold storage Yes; BTC Markets VERIFIED https://www.btcmarkets.net/institutional
describes  
cold-wallet/multi-layer  
custody practices
-----------------------------------------------------------------------------------------------------------

## Pros / limitations

---

Type Latest wording Status Source

---

Pro Offers VERIFIED https://www.btcmarkets.net/fees
order-book/Advanced  
Trade plus simpler  
Quick Buy/Sell  
pricing

Pro AUSTRAC-registered VERIFIED https://www.btcmarkets.net/regulation
Australian provider

Pro Uses cold-storage VERIFIED https://www.btcmarkets.net/institutional
security controls

Limitation Lowest-volume VERIFIED https://www.btcmarkets.net/fees
AUD/USDT Advanced  
Trade tier is 0.85%

Limitation Quick Buy/Sell uses a VERIFIED https://www.btcmarkets.net/fees
variable spread  
rather than the  
Advanced Trade fee  
schedule
-------------------------------------------------------------------------------------------------------

## Recommended regulation record

```ts
{
  jurisdiction: "AU",
  regulator: "AUSTRAC",
  status:
    "Registered with AUSTRAC as a virtual asset service provider (VASP); BTC Markets also describes itself as a registered Digital Currency Exchange",
  sourceUrl: "https://www.btcmarkets.net/terms-of-service",
  verifiedAt: new Date("2026-09-17"),
}
```

---

# 2. CoinSpot

## Provider-level fields

---

Field Latest value Status Source

---

Name CoinSpot VERIFIED https://www.coinspot.com.au

Slug `coinspot` Internal ---

Website `https://www.coinspot.com.au` VERIFIED https://www.coinspot.com.au

Description Australian cryptocurrency platform VERIFIED https://www.coinspot.com.au/fees ;
offering Instant Buy/Sell/Swap, https://www.coinspot.com.au/otc
Markets and OTC trading, with AUD  
funding including PayID and Direct  
Deposit

Provider type `CRYPTO_EXCHANGE` VERIFIED https://www.coinspot.com.au

Jurisdiction Australia VERIFIED https://www.coinspot.com.au

Verification `VERIFIED` for --- Sources below
status primary-source-backed fields

Last verified `2026-09-17` --- This research pass

Seed asset BTC, ETH, SOL PARTIAL Representative only; do not treat
symbols as full listing

Logo `/images/providers/coinspot.svg` Internal ---
------------------------------------------------------------------------------------------------------------

## Facts

---

Field Latest value Status Source

---

Market Australia VERIFIED https://www.coinspot.com.au

AUD support Yes VERIFIED https://www.coinspot.com.au/fees

Platform type Centralised VERIFIED https://www.coinspot.com.au/fees ; https://www.coinspot.com.au/otc
cryptocurrency  
platform with  
instant trading,  
Markets and OTC

Operating entity **Casey Block VERIFIED https://www.coinspot.com.au/public/CoinSpot%20Mastercard%20FSG.pdf?v=410
Services Pty Ltd,  
ACN 619 574 186,  
trading as  
CoinSpot**

Founded 2013 KEEP ONLY WITH https://www.coinspot.com.au
CURRENT
PRIMARY-SOURCE
SUPPORT

Asset count Do not store "500+ TIME-SENSITIVE https://www.coinspot.com.au/markets
/ widest" from a  
third-party review;  
derive current  
count from  
CoinSpot's live  
markets/catalogue
-------------------------------------------------------------------------------------------------------------------------------------

## Fees

---

Field Latest value Status Source

---

Market Orders **0.1%** VERIFIED https://www.coinspot.com.au/fees

OTC **0.1%** VERIFIED https://www.coinspot.com.au/fees

Instant Buy / **1%** VERIFIED https://www.coinspot.com.au/fees
Sell / Swap

Take Profit / **1%** VERIFIED https://www.coinspot.com.au/fees
Stop / Limit  
Orders

Recurring Buy **1%** VERIFIED https://www.coinspot.com.au/fees

PayID deposit **Free** VERIFIED https://www.coinspot.com.au/fees

Direct Deposit **Free** VERIFIED https://www.coinspot.com.au/fees

Cash deposit **2.5%** VERIFIED https://www.coinspot.com.au/fees

Card deposit **1.22%** VERIFIED https://www.coinspot.com.au/fees

PayPal deposit **0.5%** VERIFIED https://www.coinspot.com.au/fees

AUD bank **Free** VERIFIED https://www.coinspot.com.au/fees
withdrawal

PayPal AUD **2%** VERIFIED https://www.coinspot.com.au/fees
withdrawal

Crypto Standard flat VERIFIED https://www.coinspot.com.au/fees
withdrawal transaction/mining  
fee; current amount  
is shown on the  
relevant wallet page
----------------------------------------------------------------------------------------------

### Important correction

Remove **POLi** from the current description, deposit-fee label and pro
wording. CoinSpot's current official fee page lists PayID and Direct
Deposit as the free AUD deposit methods and also lists Cash, Card and
PayPal.

Also change the current crypto-withdrawal representation from
`FeeValueType.FREE`. CoinSpot explicitly says a transaction/mining fee
applies, so `VARIABLE` or an equivalent network/asset-specific
representation is more accurate.

## Features

---

Field Latest value Status Source

---

AUD deposits Yes VERIFIED https://www.coinspot.com.au/fees

AUD withdrawals Yes VERIFIED https://www.coinspot.com.au/fees

PayID Yes VERIFIED https://www.coinspot.com.au/fees

Bank / Direct Yes VERIFIED https://www.coinspot.com.au/fees
Deposit

Mobile app Yes VERIFIED https://www.coinspot.com.au

Recurring Buy Yes; fee VERIFIED https://www.coinspot.com.au/fees
schedule  
explicitly lists  
Recurring Buy

OTC desk Yes VERIFIED https://www.coinspot.com.au/otc

SMSF support Reverify against REVERIFY https://www.coinspot.com.au
current CoinSpot  
first-party SMSF  
documentation  
before upgrading  
old third-party  
seed field

Advanced Do not mark REVERIFY https://www.coinspot.com.au/markets
charting VERIFIED solely  
from the old  
third-party  
review; reverify  
against current  
product  
documentation

Cold storage Reverify with REVERIFY https://www.coinspot.com.au
current  
first-party  
security  
documentation  
before upgrading  
the old  
third-party  
field

Two-factor Reverify with REVERIFY https://www.coinspot.com.au
authentication current  
first-party  
security  
documentation  
before upgrading  
the old  
third-party  
field

Staking Do not infer; UNVERIFIED https://www.coinspot.com.au
keep `null`  
unless current  
Australian  
product  
documentation  
confirms it
---------------------------------------------------------------------------------------------

## Pros / limitations

---

Type Latest wording Status Source

---

Pro Market Orders VERIFIED https://www.coinspot.com.au/fees
and OTC are  
priced at 0.1%

Pro PayID and Direct VERIFIED https://www.coinspot.com.au/fees
Deposit are  
fee-free; AUD  
bank withdrawal  
is free

Limitation Instant VERIFIED https://www.coinspot.com.au/fees
Buy/Sell/Swap is  
1%, versus 0.1%  
for Market  
Orders

Remove "Widest coin REMOVE Comparative claim is not justified
selection of any by the current seed methodology
Australian  
exchange"

Remove "Markets order REMOVE / RESEARCH Requires Trading Guide's own
book has thin SEPARATELY objective liquidity methodology
liquidity  
outside major  
coins"
------------------------------------------------------------------------------------------

## Regulatory wording

CoinSpot's legal/regulatory wording needs product-level precision. The
CoinSpot Mastercard FSG identifies Casey Block Services Pty Ltd and an
AFSL context, but that should **not** be presented as evidence that
every spot-crypto exchange service is covered by the AFSL.

Keep AUSTRAC/crypto-exchange status and AFSL/Card-related scope distinct
in the public UI.

Primary legal source:\
https://www.coinspot.com.au/public/CoinSpot%20Mastercard%20FSG.pdf?v=410

---

# 3. Kraken

## Provider-level fields

---

Field Latest value Status Source

---

Name Kraken VERIFIED https://www.kraken.com

Slug `kraken` Internal ---

Website `https://www.kraken.com` VERIFIED https://www.kraken.com

Description Global cryptocurrency platform VERIFIED https://support.kraken.com/au/articles/360046261932-australia-faq ;
with Australian local operations https://support.kraken.com/au/articles/where-is-kraken-licensed-or-regulated
through Bit Trade Pty Ltd;  
offers Kraken and Kraken Pro  
spot trading, AUD funding and  
other products subject to  
eligibility

Provider type `CRYPTO_EXCHANGE` VERIFIED https://www.kraken.com

Jurisdiction Australia VERIFIED https://support.kraken.com/au/articles/where-is-kraken-licensed-or-regulated

Verification Upgrade AU record to `VERIFIED` VERIFIED Sources below
status

Last verified `2026-09-17` --- This research pass

Seed asset BTC, ETH, SOL, XRP PARTIAL Representative only
symbols

Logo `/images/providers/kraken.svg` Internal ---
------------------------------------------------------------------------------------------------------------------------------------------------------

## Facts

---

Field Latest value Status Source

---

AUD support Yes VERIFIED https://support.kraken.com/au/articles/360045033231-how-do-i-deposit-aud-

Platform type Centralised VERIFIED https://www.kraken.com
cryptocurrency  
platform /  
exchange

Australian **Bit Trade Pty VERIFIED https://support.kraken.com/au/articles/where-is-kraken-licensed-or-regulated
operating entity Ltd, ACN 163 237  
634**

Australian Bit Trade is VERIFIED https://support.kraken.com/au/articles/where-is-kraken-licensed-or-regulated
regulatory registered with  
status AUSTRAC as a  
**Digital  
Currency  
Exchange and  
Independent  
Remittance  
Dealer**

Australian **Beaufort VERIFIED https://support.kraken.com/au/articles/where-is-kraken-licensed-or-regulated
derivatives Fiduciaries Pty  
entity Ltd, ACN 162 139  
871, AFSL  
545124**

Derivatives Australian VERIFIED https://support.kraken.com/au/articles/eligibility-and-terms-for-australian-wholesale-clients
availability Kraken  
Derivatives are  
for eligible  
**wholesale  
clients**, not  
ordinary retail  
clients

Founded Kraken says it VERIFIED https://support.kraken.com/au/articles/360046261932-australia-faq
was founded in  
the US in  
**2011**

Australian Bit Kraken says Bit VERIFIED https://support.kraken.com/au/articles/360046261932-australia-faq
Trade Trade was  
acquisition acquired by  
Kraken in  
**2020**
-------------------------------------------------------------------------------------------------------------------------------------------------------

## Fees

---

Field Latest value Status Source

---

Kraken Pro **0.40% Tier 1 → VERIFIED https://www.kraken.com/features/fee-schedule
standard spot 0% from Tier  
maker 12**

Kraken Pro **0.80% Tier 1 → VERIFIED https://www.kraken.com/features/fee-schedule
standard spot 0.05% at Pro 5**  
taker

Standard spot Best qualifying VERIFIED https://www.kraken.com/features/fee-schedule
tier basis tier based on  
**Spot 30-day  
volume or Assets  
on Platform  
(AoP)**

Instant Buy/Sell **1%** according VERIFIED https://www.kraken.com/features/fee-schedule
trading fee to current  
Kraken fee  
schedule;  
payment fees can  
also apply

Custom order fee **1.5%** VERIFIED https://www.kraken.com/features/fee-schedule
according to  
current Kraken  
fee schedule

Selected Separate VERIFIED https://www.kraken.com/features/fee-schedule
maker-rebate schedule exists;  
pairs selected pairs  
can have  
different maker  
rates including  
rebates
------------------------------------------------------------------------------------------------------

### Recommended seed values

```ts
{
  feeType: ProviderFeeType.MAKER,
  label: "Kraken Pro standard spot maker fee",
  valueType: FeeValueType.TIERED,
  percentage: 0.4,
  displayValue: "0.40% at Tier 1, tiered down to 0% from Tier 12",
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

## Features

---

Field Latest value Status Source

---

AUD deposits Yes VERIFIED https://support.kraken.com/au/articles/360045033231-how-do-i-deposit-aud-

PayID Yes VERIFIED https://support.kraken.com/articles/360045033651-aud-bank-transfers-with-osko-and-payid

Bank Transfer / Yes VERIFIED https://support.kraken.com/articles/360045033651-aud-bank-transfers-with-osko-and-payid
Osko

BSB / Yes VERIFIED https://support.kraken.com/au/articles/360045033231-how-do-i-deposit-aud-
account-number  
deposit

AUD withdrawals Yes via supported VERIFIED https://support.kraken.com/articles/360045033651-aud-bank-transfers-with-osko-and-payid
bank-transfer/Osko  
flow; **PayID  
withdrawals are not  
currently supported**

Mobile app Yes VERIFIED https://www.kraken.com

API access Yes VERIFIED https://docs.kraken.com

Staking / Product availability REVERIFY https://support.kraken.com/au
rewards is  
jurisdiction/product  
dependent; do not  
publish generic  
`STAKING: true` for AU  
without checking the  
current Australian  
eligibility page

Kraken Pro Yes VERIFIED https://www.kraken.com/features/fee-schedule
-------------------------------------------------------------------------------------------------------------------------------------------------------

## Recommended regulations

```ts
regulations: [
  {
    jurisdiction: 'AU',
    regulator: 'AUSTRAC',
    status:
      'Bit Trade Pty Ltd (ACN 163 237 634) is registered as a Digital Currency Exchange and Independent Remittance Dealer',
    sourceUrl:
      'https://support.kraken.com/au/articles/where-is-kraken-licensed-or-regulated',
    verifiedAt: new Date('2026-09-17'),
  },
  {
    jurisdiction: 'AU',
    regulator: 'ASIC',
    status:
      'Kraken Derivatives are offered to eligible Australian wholesale clients through Beaufort Fiduciaries Pty Ltd (ACN 162 139 871), AFSL 545124',
    sourceUrl:
      'https://support.kraken.com/au/articles/where-is-kraken-licensed-or-regulated',
    verifiedAt: new Date('2026-09-17'),
  },
];
```

Do not merge the spot-exchange AUSTRAC registration and
wholesale-derivatives AFSL into one generic "Kraken is AFSL regulated"
claim.

---

# 4. Independent Reserve

## Provider-level fields

---

Field Latest value Status Source

---

Name Independent Reserve VERIFIED https://www.independentreserve.com/au

Slug `independent-reserve` Internal ---

Website `https://www.independentreserve.com` VERIFIED https://www.independentreserve.com/au

Description Australian cryptocurrency exchange VERIFIED https://www.independentreserve.com/au ;
established in 2013, offering transparent https://www.independentreserve.com/au/features/smsf
order-book trading, recurring buys, API, OTC,  
mobile trading and SMSF/business account  
support

Provider type `CRYPTO_EXCHANGE` VERIFIED https://www.independentreserve.com/au

Jurisdiction Australia VERIFIED https://www.independentreserve.com/au

Verification Upgrade AU record to `VERIFIED` for VERIFIED Sources below
status primary-source-backed fields

Last verified `2026-09-17` --- This research pass

Seed asset BTC, ETH, SOL, XRP PARTIAL Representative only; not full asset list
symbols

Logo `/images/providers/independent-reserve.svg` Internal ---
------------------------------------------------------------------------------------------------------------------------------------------

## Facts

---

Field Latest value Status Source

---

Market Australia VERIFIED https://www.independentreserve.com/au

Founded **2013** VERIFIED https://www.independentreserve.com/au/institutions

Platform type Centralised VERIFIED https://www.independentreserve.com/au/fees
cryptocurrency exchange  
with transparent order  
book

Ownership **IG Group completed VERIFIED https://www.independentreserve.com/blog/news/announcement-ig-group-completes-acquisition-of-independent-reserve
its acquisition of  
Independent Reserve  
effective 30 January  
2026**

AUSTRAC Registered DCE; VERIFIED https://www.independentreserve.com/au
registration **DCE-100461150-001**

Customer scale Provider currently says VERIFIED / https://www.independentreserve.com/au
**over 500,000 TIME-SENSITIVE
investors**

Listed Do not keep approximate TIME-SENSITIVE https://www.independentreserve.com/au/buy
cryptocurrencies `35–41`; derive from  
current official  
buy/markets catalogue
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Fees

---

Field Latest value Status Source

---

Trading/brokerage **0.50% starting VERIFIED https://www.independentreserve.com/au/fees
fee fee → 0.02% at  
AUD \$200m  
rolling 30-day  
volume**

AUD bank-transfer **Free** VERIFIED https://www.independentreserve.com/au/fees
deposit

Australian **1%** VERIFIED https://www.independentreserve.com/au/fees
debit/credit card  
deposit

International card **3.5%** VERIFIED https://www.independentreserve.com/au/fees
deposit

PayPal deposit **1%** VERIFIED https://www.independentreserve.com/au/fees

AUD EFT withdrawal **Free** VERIFIED https://www.independentreserve.com/au/fees

AUD PayID/NPP **AUD 1.50** VERIFIED https://www.independentreserve.com/au/fees
instant withdrawal

BTC withdrawal **0.0001 BTC** VERIFIED https://www.independentreserve.com/au/fees

ETH withdrawal --- **0.003 ETH** VERIFIED https://www.independentreserve.com/au/fees
Ethereum

SOL withdrawal **0.001 SOL** VERIFIED https://www.independentreserve.com/au/fees

XRP withdrawal **0.15 XRP** VERIFIED https://www.independentreserve.com/au/fees
-------------------------------------------------------------------------------------------------------

### Important correction

Replace the current separate maker/taker seed records with the official
brokerage/trading-fee schedule. The current Australian fee page does not
present the standard spot fee as `maker 0.10% / taker 0.50%`.

Also change:

```diff
- BTC withdrawal: 0.0003 BTC
+ BTC withdrawal: 0.0001 BTC
```

## Features

---

Field Latest value Status Source

---

AUD deposits Yes VERIFIED https://www.independentreserve.com/au/fees

Bank transfer Yes VERIFIED https://www.independentreserve.com/au/fees

PayPal funding Yes VERIFIED https://www.independentreserve.com/au/fees

Card funding Yes VERIFIED https://www.independentreserve.com/au/fees

API access Yes VERIFIED https://www.independentreserve.com/au

SMSF support Yes VERIFIED https://www.independentreserve.com/au/features/smsf

Mobile app Yes VERIFIED https://www.independentreserve.com/au/features/mobile-app

Recurring Buy Yes VERIFIED https://www.independentreserve.com/au

OTC desk Yes VERIFIED https://www.independentreserve.com/au

Cold storage Vast majority of VERIFIED https://www.independentreserve.com/au/features/smsf
client digital  
assets held with  
an insured  
enterprise-grade  
qualified  
custodian in cold  
storage

Two-factor Yes VERIFIED https://www.independentreserve.com/au/features/mobile-app
authentication

1:1 reserves Provider states it VERIFIED https://www.independentreserve.com/au/features/smsf
maintains full 1:1  
reserves of client  
fiat and crypto

Segregated Yes VERIFIED https://www.independentreserve.com/au
customer funds

ISO 27001 Certified VERIFIED https://www.independentreserve.com/au
---------------------------------------------------------------------------------------------------------------------

## Pros / limitations

---

Type Latest wording Status Source

---

Pro Trading fee falls VERIFIED https://www.independentreserve.com/au/fees
from 0.50% to 0.02%  
as 30-day volume  
increases

Pro Free AUD VERIFIED https://www.independentreserve.com/au/fees
bank-transfer  
deposits and free AUD  
EFT withdrawals

Pro SMSF support, API, VERIFIED https://www.independentreserve.com/au
recurring buys,  
mobile app and OTC  
are available

Pro Provider states 1:1 VERIFIED https://www.independentreserve.com/au/features/smsf
reserves, segregated  
funds and  
qualified-custodian  
cold storage

Remove / rewrite "Tiered maker/taker CHANGE Use "trading fees fall from 0.50% to 0.02%"
fees fall as low as  
0.02%"

Remove Approximate "35--41 REMOVE Use current official catalogue rather than old
assets" limitation third-party range

Remove Comparison against REMOVE / MOVE TO Provider facts should remain provider-specific
CoinSpot's fee as an COMPARISON LAYER
intrinsic provider  
limitation
------------------------------------------------------------------------------------------------------------------

## Recommended regulation

```ts
{
  jurisdiction: "AU",
  regulator: "AUSTRAC",
  status:
    "Registered Digital Currency Exchange (DCE), registration DCE-100461150-001",
  sourceUrl: "https://www.independentreserve.com/au",
  verifiedAt: new Date("2026-09-17"),
}
```

Remove the old seed's generic ASIC statement sourced from a third-party
review unless you have a current primary regulatory source describing a
specific Australian financial-service product and licence scope.

---

# 5. Swyftx

## Provider-level fields

---

Field Latest value Status Source

---

Name Swyftx VERIFIED https://swyftx.com

Slug `swyftx` Internal ---

Website `https://swyftx.com` VERIFIED https://swyftx.com

Description Australian-owned and operated VERIFIED https://swyftx.com/au/features/ ;
cryptocurrency platform https://support.swyftx.com/en/articles/12005536-our-trading-fees
supporting AUD funding, 410+  
crypto assets, Auto Invest and  
tiered trading fees

Provider type `CRYPTO_EXCHANGE` VERIFIED https://swyftx.com/au/features/

Jurisdiction Australia VERIFIED https://swyftx.com/facts/

Verification `VERIFIED` for VERIFIED Sources below
status primary-source-backed fields

Last verified `2026-09-17` --- This research pass

Seed asset BTC, ETH, SOL, XRP PARTIAL Representative only
symbols

Logo `/images/providers/swyftx.svg` Internal ---
------------------------------------------------------------------------------------------------------------------------------------------

## Facts

---

Field Latest value Status Source

---

Headquarters **Milton, VERIFIED https://swyftx.com/facts/
Brisbane,  
Queensland,  
Australia**

Legal entity **Swyftx Pty VERIFIED https://swyftx.com/facts/
Ltd**

ABN **72 623 556 VERIFIED https://swyftx.com/facts/
730**

AUD support Yes VERIFIED https://support.swyftx.com/en/articles/11739781-create-an-account

Platform type Centralised VERIFIED https://swyftx.com/au/features/
cryptocurrency  
trading platform

Advertised crypto **410+** VERIFIED / https://swyftx.com/au/features/
assets TIME-SENSITIVE

Advertised users **1.2 million VERIFIED / https://swyftx.com/au/features/
users across TIME-SENSITIVE
Australia and  
New Zealand**

Australian Provider VERIFIED https://swyftx.com/au/features/
ownership/operation describes itself  
as Australian  
owned and  
operated
--------------------------------------------------------------------------------------------------------------------------------

## Fees

---

Field Latest value Status Source

---

Regular trading **0.60% for \< VERIFIED https://support.swyftx.com/en/articles/12005536-our-trading-fees
fee AUD \$100,000  
rolling 30-day  
volume**

Tier 1 **0.55% at ≥ VERIFIED same
\$100,000**

Tier 2 **0.50% at ≥ VERIFIED same
\$300,000**

Tier 3 **0.45% at ≥ VERIFIED same
\$400,000**

Tier 4 **0.40% at ≥ VERIFIED same
\$500,000**

Tier 5 **0.35% at ≥ VERIFIED same
\$1m**

Tier 6 **0.30% at ≥ VERIFIED same
\$3m**

Tier 7 **0.25% at ≥ VERIFIED same
\$4m**

Tier 8 **0.20% at ≥ VERIFIED same
\$5m**

Tier 9 **0.10% at ≥ VERIFIED same
\$6m**

Spread Variable; VERIFIED https://swyftx.com/facts/
separate from  
trading fee and  
liquidity  
dependent

Swap orders A swap consists VERIFIED https://support.swyftx.com/en/articles/12005536-our-trading-fees
of a sell and  
buy; each leg  
incurs the  
applicable  
trading fee

Deposit / Recheck the TIME-SENSITIVE https://support.swyftx.com/en/articles/12004727-fees-for-deposits-and-withdrawals
withdrawal fees current support  
article  
immediately  
before publishing  
method-specific  
fees
--------------------------------------------------------------------------------------------------------------------------------------------

## Features

---

Field Latest value Status Source

---

AUD deposits / Yes for VERIFIED https://support.swyftx.com/en/articles/11739781-create-an-account
withdrawals Australian  
accounts

Bank transfer Yes VERIFIED https://swyftx.com/au/features/

Card funding Yes VERIFIED https://swyftx.com/au/features/

Apple Pay / Provider VERIFIED https://swyftx.com/au/features/
Google Pay currently  
funding advertises these  
funding methods

Mobile app Yes VERIFIED https://swyftx.com/au/features/

Auto Invest Yes VERIFIED https://swyftx.com/au/features/

Bundles Yes VERIFIED https://swyftx.com/au/features/

Demo mode Yes; provider VERIFIED https://swyftx.com/au/features/
advertises \$10K  
AUD demo cash

Two-factor Supported VERIFIED https://support.swyftx.com/en/articles/12015136-set-up-two-factor-authentication-2fa
authentication

Cold storage Multi-layered VERIFIED https://swyftx.com/facts/
hot/cold storage  
architecture

ISO 27001 Provider states VERIFIED https://swyftx.com/facts/
ISO 27001  
certification
----------------------------------------------------------------------------------------------------------------------------------------------

## Regulatory status

Swyftx's own facts page currently says:

- Legal entity: Swyftx Pty Ltd
- ABN: 72 623 556 730
- AUSTRAC: Digital Currency Exchange Provider
- Swyftx Pty Ltd holds AFSL 568543
- The same disclosure separately states **"No Australian Financial
  Services Licence (Spot Crypto)"**

That distinction is important. Do not render the provider simply as
**"AFSL-regulated crypto exchange"**. The public UI should preserve the
product/scope distinction.

Primary source: https://swyftx.com/facts/

Recommended AUSTRAC record:

```ts
{
  jurisdiction: "AU",
  regulator: "AUSTRAC",
  status:
    "Swyftx Pty Ltd is registered as a Digital Currency Exchange Provider",
  sourceUrl: "https://swyftx.com/facts/",
  verifiedAt: new Date("2026-09-17"),
}
```

Any AFSL record should describe the licence and its actual
product/service scope separately from spot crypto.

---

# Cross-provider changes to make now

---

Provider Field Action

---

BTC Markets "Simple Trade" Rename to current official
terminology **Quick
Buy/Sell**

BTC Markets Verification date Refresh verified fields to
`2026-09-17` after applying
this audit

CoinSpot POLi Remove from current
description, fee and pro
wording

CoinSpot Crypto withdrawal Change: external-wallet
`FREE` transfers have a
transaction/mining fee

CoinSpot Card deposit Current official fee page
says **1.22%**

CoinSpot PayPal withdrawal Current official fee page
says **2%**

CoinSpot Operating entity source Replace third-party review
with official FSG

CoinSpot "widest coin selection" Remove unless independently
proven by Trading Guide

CoinSpot Thin-liquidity claim Remove from structured
facts unless independently
measured

Kraken Verification status Upgrade researched AU
fields from `UNVERIFIED`

Kraken Maker `0.40%` Tier 1 → `0%` from
Tier 12 on standard spot
schedule

Kraken Taker `0.80%` Tier 1 → `0.05%` at
Pro 5

Kraken Fee tier basis Add Spot 30-day volume /
AoP qualification

Kraken AU entity Add Bit Trade Pty Ltd, ACN
163 237 634

Kraken AUSTRAC Add DCE + Independent
Remittance Dealer
registration

Kraken Derivatives Keep separate: Beaufort
Fiduciaries Pty Ltd, AFSL
545124, wholesale clients

Independent Reserve Maker/taker records Replace with official
unified trading/brokerage
fee schedule

Independent Reserve Trading fee `0.50% → 0.02%`

Independent Reserve BTC withdrawal `0.0003 BTC → 0.0001 BTC`

Independent Reserve Ownership IG Group acquisition
completed effective 30 Jan
2026

Independent Reserve Asset count Remove approximate `35–41`;
use live official catalogue

Independent Reserve SMSF / 2FA / cold Upgrade to primary-source
storage VERIFIED

Swyftx 410+ assets Still supported; refresh
verification date

Swyftx Headquarters Add Milton, Brisbane,
Queensland

Swyftx Legal entity Add Swyftx Pty Ltd, ABN 72
623 556 730

Swyftx Regulatory wording Keep AUSTRAC and
AFSL/product scope separate
---------------------------------------------------------------------------

---

# Source-quality policy for Trading Guide

Use this order when setting `VerificationStatus.VERIFIED`:

1.  Provider's current official fee/product page
2.  Provider's current legal/regulatory disclosure
3.  Government/regulator register or official record
4.  Provider's current support documentation
5.  Provider's official corporate announcement
6.  Reliable independent source only when a primary source is
    unavailable

Avoid upgrading a third-party review to `VERIFIED` merely because the
claim appears plausible.

For fast-changing fields---fees, withdrawal costs, asset counts, payment
methods, trading limits and regulatory product scope---keep a short
re-verification cycle and display the verification date to users.
