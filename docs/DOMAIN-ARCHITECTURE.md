# Product-domain architecture

Current architecture after the 2026-09-20 cleanup.

- `Provider` is the organisation/brand/legal entity.
- `ProviderOffering` is the comparable product/service.
- Application catalog logic is domain-owned, not exposed through a generic Offering service.
- Crypto exchange logic lives in `src/lib/crypto-exchanges/`.
- Share-trading logic lives in `src/lib/share-trading/`.
- Shared comparison components in `src/components/compare/` are presentation-only.
- There is no runtime comparison-domain resolver.

## Comparison routes

- All crypto exchanges: `/compare/crypto-exchanges`
- Custom crypto comparison: `/compare/crypto-exchanges/[slug]`
- All share-trading platforms: `/compare/trading-platforms`
- Custom share-trading comparison: `/compare/trading-platforms/[slug]`
- `/compare` is only a navigation/entry page across the two product domains.

A route knows its product domain before querying data. Crypto queries always constrain `OfferingType.CRYPTO_EXCHANGE`; share-trading queries always constrain `OfferingType.SHARE_TRADING`.

## Shared vs domain-specific

Shared infrastructure: Prisma/repository utilities, affiliates, verification, sources, SEO helpers, and comparison UI primitives.

Domain-specific: catalog queries, profile data, filters, comparison row construction, fee interpretation, and feature semantics.
