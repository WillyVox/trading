# Phase 8.3 — moomoo + eToro provider expansion

Implemented 22 Sep 2026 from current official Australian provider sources.

## Added

- moomoo share-trading offering with ASX/US/HK market coverage, CHESS/custody data, products, account types, sourced features/pros/limitations, and conservative structured fees.
- eToro share-trading offering under the shared Australian provider identity.
- eToro crypto offering under the same provider identity.
- HKEX reusable market.
- COPY_TRADING reusable offering feature plus additive Prisma enum migration.
- Share-trading seeder support for OfferingFeature and OfferingProsCon children.
- Research manifests for all three new offerings.

## Deliberate non-modelling

- moomoo: no fixed FX percentage is inferred; current official AU material reviewed did not establish one strongly enough. HK composite brokerage and US fractional capped pricing are documented but not forced into an incompatible calculator rule.
- eToro shares: stock commission remains VARIES until the dynamic Australian country/exchange mapping can be verified reliably; no $1/$2 exchange mapping is guessed.
- eToro crypto: opening and closing 1% fees are separate; a future closing fee is not folded into a current buy estimate. Platform-to-wallet 2% is labelled as that specific transfer stage; external blockchain fees remain variable.
- eToro spot crypto is not described as ASIC-regulated. The provider AFSL and the crypto regulatory caveat are kept distinct.

## Validation note

The source archive had no complete dependency installation. `npm ci` timed out in the execution environment before a usable local Prisma/TypeScript toolchain was created, so Prisma validation, TypeScript, lint, tests and build must be run locally before merge.
