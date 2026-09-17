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
