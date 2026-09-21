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

### Classifying a new `provider.facts` entry

`Provider.facts` is for organisation/company-level facts only (legal
entity, headquarters, founding year, ABN, regulator registration). It is
**not** a general-purpose bucket for anything you couldn't find a better
home for — a fact about what the product does or supports almost always
belongs on the Offering instead, in a typed field, not as free text:

```text
Is this fact about the company itself (entity, HQ, founding, regulation)?
  YES -> Provider.facts
  NO  -> Does a structured Offering field already cover it
         (an OfferingFeature type, an OfferingFeeSeed, OfferingMarket,
         OfferingCryptoAsset, etc.)?
    YES -> use that structured field -- do not also add a Provider.facts
           row duplicating it in free text
    NO  -> is it a simple supported/unsupported capability?
      YES -> add a new OfferingFeatureType value if one doesn't fit
      NO  -> Offering.description / a research note, only if genuinely
             necessary -- prefer typed structured data over a new
             free-text dumping ground
```

For a provider with more than one Offering (e.g. a broker with both
Share Trading and CFD products), this matters even more: a fact like
"AUD support: yes" is ambiguous on `Provider.facts` when it can vary by
product, but unambiguous as an `OfferingFeature` on the specific Offering
it describes.

This rule caught a real duplicate during the 2026-09-21 cleanup: every
crypto exchange seed had both a `Provider.facts` row ("AUD Support: Yes")
and the equivalent `OfferingFeature` (`AUD_DEPOSITS`/`AUD_WITHDRAWALS`,
already `available: true`) saying the same thing twice. The free-text
copy was removed from all five affected seeds -- see git history on this
file's siblings if you need the exact diff.

## Adding a share-trading platform

1. Copy an existing file in `share-trading-platforms/`.
2. Define the Provider and Offering directly.
3. Export it from `share-trading-platforms/index.ts`.
4. Add a market to `lib/markets.ts` only when verified offering data needs it.

The runner validates duplicate slugs and domain types before database writes. Unknown crypto asset symbols and unknown share-market codes fail loudly instead of being skipped.
