# Seed data

Seed data is organised by the product/service users compare, not by database table.

- `crypto-assets/` — global crypto asset catalogue.
- `crypto-exchanges/` — one self-contained Provider + CRYPTO_EXCHANGE Offering per file.
- `share-trading-platforms/` — one self-contained Provider + SHARE_TRADING Offering per file.
- `affiliate-links/` — commercial/affiliate configuration, kept separate from editorial product data.
- `lib/` — seed orchestration, validation, reusable market catalogue and seed-only types.
- `seed.ts` — top-level runner.

## Adding a crypto exchange

1. Copy an existing file in `crypto-exchanges/`.
2. Define the Provider (brand/legal-entity facts, sources and regulation) and the Offering (fees, features, assets and pros/limitations) directly.
3. Use an offering slug such as `{provider-slug}-exchange` while the application retains globally unique offering slugs.
4. Export it from `crypto-exchanges/index.ts`.
5. If it references a crypto symbol not yet present, add that asset to `crypto-assets/index.ts` first.

Do not add ProviderFee/ProviderFeature/ProviderAsset/ProviderProsCon seed data and do not recreate a Provider→Offering mapping layer.

## Adding a share-trading platform

1. Copy an existing file in `share-trading-platforms/`.
2. Define the Provider and Offering directly.
3. Export it from `share-trading-platforms/index.ts`.
4. Add a market to `lib/markets.ts` only when verified offering data needs it.

The runner validates duplicate slugs and domain types before database writes. Unknown crypto asset symbols and unknown share-market codes fail loudly instead of being skipped.
