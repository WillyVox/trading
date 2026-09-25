# Provider and Offering identity

This document defines the canonical identity rules for Trading Guide.

## Domain boundary

### Provider

A `Provider` is the organisation, brand, legal or commercial entity that provides one or more products/services.

`Provider.slug` identifies that organisation. It remains useful for provider-level facts, sources, regulation, affiliate relationships, administration and any future organisation-level pages.

### ProviderOffering

A `ProviderOffering` is the actual product/service that a Trading Guide visitor researches, compares or uses in a tool.

`ProviderOffering.slug` is the canonical product identity. It is globally unique and is the intended identity for product profiles, comparisons, tools, analytics and Offering-owned presentation/assets.

## Slug invariants

1. Provider and Offering slugs live in different tables and may be identical.
2. Do not add a suffix merely to make an Offering slug different from its Provider slug.
3. An Offering slug should describe the Offering itself.
4. When one Provider has multiple Offerings, use distinct descriptive Offering slugs, e.g. `etoro` and `etoro-crypto`.
5. `ProviderOffering.slug` remains globally unique.
6. Provider-level commercial/regulatory relationships remain Provider-based until explicitly redesigned.

Examples:

| Provider                       | Provider slug                    | Offering                 | Offering slug  |
| ------------------------------ | -------------------------------- | ------------------------ | -------------- |
| CoinSpot                       | `coinspot`                       | CoinSpot Crypto Exchange | `coinspot`     |
| Kraken                         | `kraken`                         | Kraken Crypto Exchange   | `kraken`       |
| Commonwealth Bank of Australia | `commonwealth-bank-of-australia` | CommSec                  | `commsec`      |
| CMC Markets                    | `cmc-markets`                    | CMC Invest               | `cmc-invest`   |
| eToro                          | `etoro`                          | eToro Share Trading      | `etoro`        |
| eToro                          | `etoro`                          | eToro Crypto             | `etoro-crypto` |

## Current transition boundary

Phase 0/1 normalises the Offering data model only. Existing crypto public routing is deliberately unchanged in this phase and may still resolve through Provider slugs. The next routing phase will make crypto profile/comparison services Offering-centric and will handle canonical URLs/redirects explicitly.
