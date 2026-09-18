Yes. I inspected the latest attached project first, and I would **not bolt “trading platforms” onto the existing crypto structure as just another `ProviderType`**. Your current foundation is good, but there is an architectural issue we should fix before adding CMC Invest, CommSec, Stake, Interactive Brokers, Webull, etc.

The important shift is:

> **Trading Guide should become the umbrella product. Crypto exchanges and share-trading platforms become verticals underneath it.**

Your current code is still fundamentally crypto-first: the homepage metadata says `"Trading Guide"`, the homepage hero says `"Crypto exchanges, compared with evidence"`, the header has `Crypto` and `Compare Cryptocurrencies`, and all five seeded providers are `CRYPTO_EXCHANGE`. At the same time, your Prisma schema already hints at the future with `BROKER`, `MULTI_ASSET_BROKER`, and `TRADING_PLATFORM`.

## 1. First, what competitors are doing

There are useful lessons from the Australian market.

Finder treats **Share Trading** as a top-level comparison vertical and compares 30+ platforms using things such as Australian brokerage, US brokerage, asset classes, markets, features, FX fees, research tools, device support, and investor type. Its 2026 methodology says it analysed 40 platforms and thousands of data points. ([finder.com.au][1])

Canstar similarly presents **Online Share Trading Platforms** as a distinct comparison product and surfaces things like custodial structure, app availability, live pricing, ETFs, US markets and fees directly in the comparison UI. ([Canstar][2])

ASX itself frames the underlying entity as the **broker**, with brokers differing by products, markets and services. It distinguishes online brokers from full-service brokers. ([Australian Securities Exchange][3])

Moneysmart also makes an important distinction: users generally buy shares through a broker, while costs may include brokerage, platform fees and foreign-exchange fees. ([Moneysmart][4])

That gives us an important architecture lesson:

```text
Company / Brand
      ↓
Broker / Provider
      ↓
Specific offering / account / platform
      ↓
Markets + products + fees + features
```

Do not collapse those into one flat row.

---

# 2. The biggest Prisma issue in your current model

You currently have:

```prisma
enum ProviderType {
  CRYPTO_EXCHANGE
  BROKER
  MULTI_ASSET_BROKER
  TRADING_PLATFORM
  WALLET_PROVIDER
  OTHER
}
```

and:

```prisma
model Provider {
  ...
  providerType ProviderType?
  facts        ProviderFact[]
  fees         ProviderFee[]
  features     ProviderFeature[]
  regulations  ProviderRegulation[]
  ...
}
```

That works reasonably well for five crypto exchanges.

It becomes problematic with something such as CMC.

A company can simultaneously be:

```text
broker
trading platform
share trading provider
CFD provider
forex provider
multi-asset provider
```

So this:

```prisma
providerType ProviderType?
```

forces you to select one identity when several are true.

More importantly, different offerings belonging to the same provider can have:

- different fees;
- different asset classes;
- different licences;
- different legal entities;
- different custody arrangements;
- different market access;
- different terms.

That means I would **not simply add more values to `ProviderType`**.

---

# 3. Architecture I recommend

Think in four levels:

```text
Provider
   ↓
Offering
   ↓
Capabilities / Markets / Products
   ↓
Facts / Fees / Features / Regulation
```

For example:

```text
CMC Markets
│
├── CMC Invest
│     ├── ASX shares
│     ├── US shares
│     ├── ETFs
│     ├── CHESS sponsorship
│     └── share-trading fee structure
│
└── CMC Markets CFD
      ├── CFDs
      ├── Forex
      ├── indices
      └── different pricing/regulatory context
```

That distinction will save you a lot of pain later.

---

# 4. Keep `Provider` as the parent

I like your existing `Provider` concept.

I would make it mean:

> **The identifiable provider/brand/company represented on Trading Guide.**

For example:

```text
CoinSpot
Swyftx
Kraken
CMC Markets
Stake
CommSec
Interactive Brokers
Webull
```

Something approximately like:

```prisma
model Provider {
  id                 String             @id @default(cuid())
  name               String
  slug               String             @unique
  logo               String?
  website            String?
  description        String?            @db.Text

  verificationStatus VerificationStatus @default(UNVERIFIED)
  lastVerifiedAt     DateTime?

  seoTitle           String?
  seoDescription     String?
  noIndex            Boolean            @default(false)

  offerings          ProviderOffering[]

  sources            ProviderSource[]
  articles           ArticleProvider[]
  partnerships       AffiliatePartnership[]

  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
}
```

Notice that I would gradually move product-specific information away from `Provider`.

---

# 5. Add `ProviderOffering`

This is the most important addition I would make.

```prisma
model ProviderOffering {
  id          String   @id @default(cuid())
  providerId  String

  name        String
  slug        String

  offeringType OfferingType

  description String?  @db.Text

  active      Boolean  @default(true)

  provider    Provider @relation(
    fields: [providerId],
    references: [id],
    onDelete: Cascade
  )

  markets     OfferingMarket[]
  products    OfferingProduct[]
  fees        OfferingFee[]
  features    OfferingFeature[]
  regulations OfferingRegulation[]

  @@unique([providerId, slug])
  @@index([providerId])
  @@index([offeringType])
}
```

Then:

```prisma
enum OfferingType {
  SHARE_TRADING
  CRYPTO_EXCHANGE
  FOREX
  CFD
  OPTIONS
  FUTURES
  MULTI_ASSET
  WALLET
  OTHER
}
```

Now you can represent:

```text
Provider: Kraken
Offering: Kraken Spot
Type: CRYPTO_EXCHANGE
```

and:

```text
Provider: CMC Markets
Offering: CMC Invest
Type: SHARE_TRADING
```

without pretending the entire company has only one product type.

---

# 6. Then model products separately

Don't make these Boolean fields:

```text
supportsShares
supportsETFs
supportsOptions
supportsCrypto
supportsForex
```

That will become painful.

Use structured product relationships.

For example:

```prisma
enum InvestmentProductType {
  AU_SHARES
  INTERNATIONAL_SHARES
  ETF
  OPTIONS
  FOREX
  CFD
  CRYPTO
  BONDS
  MANAGED_FUNDS
  FUTURES
  WARRANTS
  OTHER
}
```

Then:

```prisma
model OfferingProduct {
  id         String                @id @default(cuid())
  offeringId String
  product    InvestmentProductType

  available  Boolean               @default(true)

  notes      String?               @db.Text
  sourceUrl  String?

  verificationStatus VerificationStatus @default(UNVERIFIED)
  verifiedAt DateTime?

  offering ProviderOffering @relation(
    fields: [offeringId],
    references: [id],
    onDelete: Cascade
  )

  @@unique([offeringId, product])
}
```

That lets the comparison engine answer:

```text
Does Stake provide:
✓ ASX shares
✓ US shares
✓ ETFs
✗ Forex
✗ CFDs
```

without free-text interpretation.

---

# 7. Markets should also be structured

Products and markets are not the same thing.

For example:

```text
Product:
SHARES

Markets:
ASX
NYSE
NASDAQ
LSE
HKEX
```

So I would add:

```prisma
enum MarketCode {
  ASX
  CBOE_AU
  NYSE
  NASDAQ
  LSE
  HKEX
  SGX
  TSE
  OTHER
}
```

and:

```prisma
model OfferingMarket {
  id         String     @id @default(cuid())
  offeringId String
  market     MarketCode

  available  Boolean    @default(true)

  sourceUrl  String?
  verificationStatus VerificationStatus @default(UNVERIFIED)
  verifiedAt DateTime?

  offering ProviderOffering @relation(
    fields: [offeringId],
    references: [id],
    onDelete: Cascade
  )

  @@unique([offeringId, market])
}
```

This will eventually let users filter:

```text
Australian shares
US shares
International shares
```

properly.

---

# 8. CHESS/custody absolutely deserves structured data

This is Australia-specific and important.

Finder and other comparison sites already surface custody/CHESS distinctions, and ASX explicitly discusses CHESS sponsoring brokers. ([Canstar][2])

I would not hide this in `ProviderFact`.

Use something like:

```prisma
enum HoldingStructure {
  CHESS_SPONSORED
  CUSTODIAL
  ISSUER_SPONSORED
  MIXED
  NOT_APPLICABLE
  UNKNOWN
}
```

Potentially:

```prisma
model OfferingHolding {
  id              String           @id @default(cuid())
  offeringId      String
  jurisdiction    String
  holdingStructure HoldingStructure

  notes           String?          @db.Text
  sourceUrl       String?

  verificationStatus VerificationStatus @default(UNVERIFIED)
  verifiedAt      DateTime?

  offering ProviderOffering @relation(...)
}
```

Then your comparison table can say:

| Platform   | Australian share holding |
| ---------- | ------------------------ |
| Platform A | CHESS-sponsored          |
| Platform B | Custodial                |
| Platform C | CHESS-sponsored          |

without manually typing it into articles.

---

# 9. Your fee model needs expansion

Your existing:

```prisma
enum ProviderFeeType {
  TRADING
  MAKER
  TAKER
  INSTANT_BUY
  DEPOSIT
  WITHDRAWAL
  FIAT_DEPOSIT
  FIAT_WITHDRAWAL
  SPREAD
  OTHER
}
```

is strongly crypto-oriented.

For share trading you will need concepts such as:

```text
AU brokerage
US brokerage
international brokerage
FX conversion
platform fee
account fee
inactivity fee
market-data fee
transfer fee
options contract fee
```

I would evolve it into something closer to:

```prisma
enum FeeType {
  BROKERAGE
  FX_CONVERSION
  PLATFORM
  ACCOUNT
  INACTIVITY
  MARKET_DATA
  DEPOSIT
  WITHDRAWAL
  TRANSFER
  MAKER
  TAKER
  SPREAD
  OPTIONS_CONTRACT
  OTHER
}
```

But the crucial piece is context.

For example:

```text
BROKERAGE
market = ASX
currency = AUD
```

versus:

```text
BROKERAGE
market = NASDAQ
currency = USD
```

Therefore I would add fields such as:

```prisma
market     MarketCode?
product    InvestmentProductType?
```

to the fee record.

Then:

```text
Stake
BROKERAGE
ASX
$3
```

is fundamentally different from:

```text
Stake
BROKERAGE
US_SHARES
US$3
```

---

# 10. Don't make a separate `TradingPlatform` table yet

This is an important design decision.

You may be tempted to create:

```prisma
model Broker {}
model CryptoExchange {}
model TradingPlatform {}
```

I would avoid that.

You'd quickly get:

```text
Is CMC a Broker or TradingPlatform?

Is Interactive Brokers a broker or platform?

Is eToro a broker, multi-asset platform or crypto provider?

Is Kraken an exchange or trading platform?
```

Answer:

**sometimes several simultaneously.**

Better:

```text
Provider
     ↓
Offering
     ↓
Products / Markets / Features
```

This is compositional rather than inheritance-like.

---

# 11. Features need to become broader

Your current `ProviderFeatureType` contains good crypto entries:

```text
PAYID
CARD_DEPOSIT
RECURRING_BUYS
STAKING
COLD_STORAGE
OTC_DESK
```

but you'll need trading-platform functionality too.

For example:

```prisma
enum OfferingFeatureType {
  WEB_PLATFORM
  IOS_APP
  ANDROID_APP

  MARKET_ORDERS
  LIMIT_ORDERS
  STOP_ORDERS
  CONDITIONAL_ORDERS

  FRACTIONAL_SHARES
  RECURRING_INVESTING
  DIVIDEND_REINVESTMENT

  LIVE_MARKET_DATA
  ADVANCED_CHARTING
  STOCK_SCREENER
  WATCHLISTS
  PRICE_ALERTS

  DEMO_ACCOUNT
  API_ACCESS

  SMSF_SUPPORT
  JOINT_ACCOUNT
  COMPANY_ACCOUNT

  PAYID
  BANK_TRANSFER
  CARD_DEPOSIT

  TWO_FACTOR_AUTH

  STAKING
  COLD_STORAGE
  OTC_DESK

  OTHER
}
```

You don't necessarily need all of these on day one.

But the architecture should allow them.

---

# 12. Regulation needs more precision, not less

Your current:

```prisma
ProviderRegulation
```

is useful but attached only to Provider.

For multi-product brokers that becomes dangerous.

For example, the brand may have:

```text
Australian entity A
→ AFSL
→ Share trading

Australian entity B
→ another authorisation
→ CFD service
```

So longer term I would introduce:

```text
Provider
   ↓
LegalEntity
   ↓
RegulatoryAuthorisation
```

something like:

```prisma
model ProviderLegalEntity {
  id          String   @id @default(cuid())
  providerId  String

  legalName   String
  abn         String?
  acn         String?
  country     String

  provider    Provider @relation(...)
  authorisations RegulatoryAuthorisation[]
}
```

and:

```prisma
model RegulatoryAuthorisation {
  id             String @id @default(cuid())
  legalEntityId  String

  regulator      String
  licenceType    String
  licenceNumber  String?
  status         String?

  scope          String? @db.Text

  sourceUrl      String?
  verifiedAt     DateTime?
}
```

This will help you avoid misleading badges such as:

```text
ASIC regulated ✓
```

when the actual licence may only cover a narrower service.

---

# 13. My recommended Prisma hierarchy

Ultimately:

```text
Provider
│
├── ProviderLegalEntity
│      └── RegulatoryAuthorisation
│
├── ProviderOffering
│      │
│      ├── OfferingProduct
│      ├── OfferingMarket
│      ├── OfferingFee
│      ├── OfferingFeature
│      ├── OfferingHolding
│      └── OfferingRegulation / entity linkage
│
├── ProviderSource
│
├── ArticleProvider
│
└── AffiliatePartnership
```

That is the architecture I would build toward.

---

# 14. But don't migrate everything at once

I **would not implement all of this in one Prisma migration**.

Your current crypto system is working.

Do it incrementally.

### Phase A — minimum schema expansion

Add:

```text
ProviderOffering
OfferingProduct
OfferingMarket
OfferingFeature
OfferingFee
```

Keep current:

```text
ProviderFact
ProviderFee
ProviderFeature
ProviderRegulation
```

for backwards compatibility.

Then migrate crypto data progressively.

### Phase B

Add:

```text
HoldingStructure
share-trading-specific structured attributes
```

### Phase C

Add:

```text
LegalEntity
RegulatoryAuthorisation
```

### Phase D

Move existing provider-level facts into offering-level records where appropriate.

That avoids breaking all your current pages at once.

---

# 15. Homepage should change significantly

Your homepage currently says:

> Crypto exchanges, compared with evidence.

If Trading Guide is becoming broader, I would reposition the homepage around **platform research**, not crypto.

Something like:

### Eyebrow

```text
Independent trading research · Australia
```

### H1

My preferred:

> **Trading platforms, compared with evidence.**

Alternative:

> **Compare trading platforms with confidence.**

But because your brand differentiation is source verification, I prefer the first.

### Description

Something like:

> Research Australian share-trading platforms and crypto exchanges using source-linked fees, features, market access and regulatory information.

Then two primary CTAs:

```text
Compare trading platforms
Compare crypto exchanges
```

---

# 16. Homepage information architecture

I would restructure the homepage approximately like this:

```text
HERO
Trading platforms, compared with evidence.

[Compare share trading platforms]
[Compare crypto exchanges]

Source-linked facts · Independent editorial · Transparent methodology


EXPLORE BY MARKET

┌─────────────────────┐
│ Share Trading       │
│                     │
│ Compare platforms   │
│ Fees                │
│ CHESS / custody     │
│ Global markets      │
└─────────────────────┘

┌─────────────────────┐
│ Crypto              │
│                     │
│ Compare exchanges   │
│ Fees                │
│ Assets              │
│ Regulation          │
└─────────────────────┘

┌─────────────────────┐
│ Forex / CFDs        │
│                     │
│ Coming later        │
└─────────────────────┘


POPULAR COMPARISONS

CMC Invest vs Stake
CommSec vs CMC Invest
...
CoinSpot vs Swyftx
...


HOW WE RESEARCH

Source linked
Verified
Independent
Transparent methodology


LATEST GUIDES


LATEST NEWS


METHODOLOGY / DISCLOSURE
```

The important improvement is that the homepage stops looking like:

> a crypto comparison site

and starts looking like:

> an Australian trading/investment platform research product.

---

# 17. Header: your existing navigation won't scale

Right now desktop has:

```text
Crypto
Compare Cryptocurrencies
News
```

while mobile has:

```text
Crypto
Compare
Methodology
News
```

You already have navigation drift between desktop and mobile.

I would fix that before adding another vertical.

Use **one shared navigation config**.

---

# 18. Header structure I recommend

For the next stage:

```text
Trading Guide

Trading Platforms
Crypto
Compare ▾
Guides ▾
News
```

Where:

### Trading Platforms

```text
Overview
Compare platforms
All platforms
Share trading guides
```

### Crypto

```text
Crypto overview
Crypto exchanges
Compare exchanges
Crypto guides
```

### Compare

```text
Share trading platforms
Crypto exchanges
```

Later:

```text
Forex brokers
CFD platforms
```

You probably don't need Methodology occupying primary-navigation space.

Methodology belongs well in:

```text
footer
trust sections
comparison pages
```

unless research methodology becomes a major brand feature you want prominently exposed.

---

# 19. Recommended route architecture

This deserves care because changing URLs later is SEO-expensive.

I would **not** put everything underneath `/crypto` anymore.

Recommended:

```text
/
```

### Share trading vertical

```text
/share-trading
/share-trading/platforms
/share-trading/platforms/[slug]
/share-trading/compare
/share-trading/guides
/share-trading/guides/[slug]
```

### Crypto vertical

Keep:

```text
/crypto
/crypto/exchanges
/crypto/exchanges/[slug]
/crypto/guides
/crypto/guides/[slug]
```

I'd eventually consider:

```text
/crypto/compare
```

rather than relying entirely on generic `/compare`.

### Generic comparison hub

```text
/compare
```

becomes:

> What do you want to compare?

```text
Share trading platforms
Crypto exchanges
```

This is much stronger than today's `/compare`, which calls `getProviders()` without a provider-type filter and would start mixing brokers and crypto exchanges as soon as you seed them.

That's a concrete problem in the current code.

---

# 20. This current function will need attention

You already support:

```ts
getProviders({
  providerType,
});
```

which is good.

But `/compare/page.tsx` currently calls:

```ts
getProviders();
```

with no filtering.

Today that's fine because every record is a crypto exchange.

Once you add:

```text
CMC
Stake
CommSec
IBKR
```

the page would show:

```text
CoinSpot
CMC Invest
Independent Reserve
Interactive Brokers
Kraken
Stake
Swyftx
...
```

in one comparison selector.

That's not the product experience you want.

The comparison system needs a **comparison context**:

```text
share trading
crypto exchanges
forex
CFD
```

before provider selection.

---

# 21. Site identity also needs changing

Your current `siteConfig` is:

```ts
name: "Trading Guide";
```

and:

```ts
description: "Independent, source-linked crypto exchange comparisons and guides for Australia.";
```

I would change the brand layer eventually to:

```text
Trading Guide
```

not:

```text
Trading Guide
```

with something more like:

> Independent, source-linked research and comparisons for Australian trading platforms and crypto exchanges.

Potential default title:

> Trading Guide Australia — Compare Trading Platforms & Crypto Exchanges

We should research keywords before finalising SEO wording, but architecturally the brand needs to become vertical-neutral.

---

# 22. Article architecture should also become vertical-aware

Your current:

```prisma
Article
```

has:

```text
ArticleType
category
searchIntent
providers
cryptoAssets
```

The `cryptoAssets` relation is naturally crypto-specific.

I would not start adding:

```text
shareAssets
forexPairs
etfs
```

directly to Article.

Instead eventually add something like:

```prisma
enum ContentVertical {
  SHARE_TRADING
  CRYPTO
  FOREX
  CFD
  GENERAL
}
```

and perhaps:

```prisma
vertical ContentVertical
```

or a many-to-many if genuine cross-vertical content becomes common.

Then your article URLs and related-content engine can understand context.

---

# 23. One thing I would not copy from competitors

Finder is very strong in breadth, data depth, category pages and comparison tooling. But it also mixes:

```text
Promoted
Exclusive Offer
Finder Score
Best
Go to site
```

very prominently inside comparison UX. ([finder.com.au][1])

Canstar similarly includes prominent partner/promoted offers. ([Canstar][2])

You can differentiate Trading Guide by being more visibly:

```text
SOURCE
↓
FACT
↓
VERIFICATION
↓
COMPARISON
```

rather than:

```text
AFFILIATE OFFER
↓
RANKING
↓
CTA
```

Your affiliate model can still make money, but the research architecture should remain visibly independent.

That is probably your strongest product differentiation.

---

# 24. What I would compare on the first trading-platform release

Don't try to capture 100 attributes immediately.

Start with the things Australian users most need:

```text
Provider
Platform/offering

Australian brokerage
US brokerage
FX conversion fee

ASX access
US market access

CHESS-sponsored / custodial

Fractional shares

Supported products:
- Australian shares
- international shares
- ETFs
- options

Order types:
- market
- limit
- stop

Platform:
- web
- iOS
- Android

Account support:
- individual
- joint
- SMSF

Regulation / legal entity

Source
Verification date
```

Finder's current material also highlights brokerage, FX fees, market access, investment products, trading features, supported devices, research/education and support as meaningful comparison dimensions. ([finder.com.au][5])

---

# 25. Providers I would use for the first dataset

Not 30.

Start with perhaps 6–8 highly recognisable platforms and make their data excellent.

Candidates worth researching:

```text
CommSec
CMC Invest
Stake
Interactive Brokers Australia
Webull
Moomoo
nabtrade
Superhero
```

ASX's current retail online-broker directory includes CMC Markets Stockbroking, Commonwealth Securities, Interactive Brokers Australia, nabtrade and Webull among others. ([Australian Securities Exchange][3])

I would verify each against official provider and ASIC/ASX sources before seeding anything.

---

# 26. My recommended target architecture

Conceptually:

```text
                         TRADING GUIDE
                              │
            ┌─────────────────┴──────────────────┐
            │                                    │
      SHARE TRADING                            CRYPTO
            │                                    │
    Trading platforms                       Exchanges
            │                                    │
       ┌────┴────┐                           ┌────┴────┐
       │         │                           │         │
    Compare    Guides                     Compare    Guides
       │                                     │
       └──────────────┬──────────────────────┘
                      │
                   Provider
                      │
                 Offering
              ┌───────┼────────┐
              │       │        │
           Markets  Products  Fees
              │       │        │
          Features   Holding  Sources
                      │
                  Regulation
```

That's the direction I would choose.

---

# 27. What I would do next — before writing code

I would **not modify Prisma yet**.

The very next task should be a **formal domain-model audit** against 5–8 real Australian trading platforms.

Take:

```text
CommSec
CMC Invest
Stake
Interactive Brokers
Webull
Moomoo
Superhero
nabtrade
```

and try to represent all of these using the proposed model.

For every provider, test:

```text
brand
legal entity
offering
markets
products
brokerage
FX fee
holding structure
features
regulation
sources
affiliate program
```

If the model handles those cleanly **and still represents CoinSpot/Kraken properly**, then approve the Prisma migration.

That's much safer than designing the schema abstractly and finding six months later that CMC Invest and CMC CFD cannot be represented correctly.

## My recommended implementation order

1. **Domain model validation against real brokers**
2. Finalise URL taxonomy
3. Finalise Prisma architecture
4. Add new schema _additively_
5. Seed 5–8 trading platforms from primary sources
6. Build `/share-trading`
7. Build `/share-trading/platforms`
8. Build individual platform pages
9. Build share-trading comparison engine
10. Redesign homepage
11. Update header/navigation
12. Broaden site metadata/SEO identity
13. Add guides/content cluster
14. Only then expand affiliate integrations

The **Prisma/domain model should come before homepage/header implementation**, because navigation should reflect the product structure, and the product structure should reflect the actual data model—not the other way around.

[1]: https://www.finder.com.au/share-trading?utm_source=chatgpt.com "Online Stock Brokers 2026: 30+ Platforms, From $0 | Finder"
[2]: https://www.canstar.com.au/online-trading/?utm_source=chatgpt.com "Compare Online Share Trading Platforms | Canstar"
[3]: https://www.asx.com.au/investors/start-investing/find-a-broker-adviser?utm_source=chatgpt.com "Find a stock broker or adviser | ASX"
[4]: https://moneysmart.gov.au/shares/how-to-buy-and-sell-shares?utm_source=chatgpt.com "How to buy and sell shares - Moneysmart.gov.au"
[5]: https://www.finder.com.au/share-trading/best-online-share-trading-platforms?utm_source=chatgpt.com "6 Best trading platforms in Australia 2026 | Finder"
