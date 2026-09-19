# Architecture

seedMarkets()
↓
Market
ASX / NYSE / NASDAQ

seedOfferings()
↓

Provider
CMC Markets
↓
ProviderOffering
CMC Invest
├── OfferingMarket
│ ├── ASX
│ ├── NYSE
│ └── NASDAQ
│
├── OfferingProduct
│ ├── AU_SHARES
│ ├── INTERNATIONAL_SHARES
│ └── ETF
│
├── OfferingCustody
│ ├── ASX → CHESS_SPONSORED
│ └── US → CUSTODIAL
│
└── OfferingAccountType
└── SMSF
│
└── OfferingFee (Phase 2)
├── BROKERAGE / FX_CONVERSION / EXCHANGE_TRANSFER ...
│ ├── marketCode → marketId (null = offering-wide)
│ ├── channel? (CommSec: CDIA / own bank / phone / third party)
│ ├── calculationBasis: FLAT / PERCENTAGE / GREATER_OF / TIERED / FREE / VARIES
│ ├── isPromotional + validFrom/validTo + promotionalTerms
│ └── OfferingFeeTier[] (TIERED only; array order = position)

Research for every seeded fee lives in docs/research/offerings/<slug>.md.
Fee rows are validated at seed time by assertValidFeeSeed() (types.ts).
