# Seed data

> **Production safety:** `npm run db:seed` is a development/reference-data seed, not a live-production update mechanism. Several seeders replace offering child rows (`deleteMany` + recreate), which can replace row IDs and verification metadata. For the first empty production database only, use guarded `npm run db:bootstrap:production`. After launch, use reviewed migrations or admin/editorial workflows.

Seed records are JSON-first. **Each seed record lives in its own `.json` file.** TypeScript files in the seed folders are loaders/orchestration only and must not contain provider/product records.

- `crypto-assets/*.json` — one crypto asset per file.
- `crypto-exchanges/*.json` — one self-contained Provider + CRYPTO_EXCHANGE Offering per file.
- `share-trading-platforms/*.json` — one self-contained Provider + SHARE_TRADING Offering per file.
- `affiliate-engagements/*.json` — one Offering-specific commercial engagement record per file, kept separate from editorial product data.
- `markets/*.json` — one reusable market per file.
- `lib/json.ts` — revives ISO dates from JSON before Prisma writes.
- `lib/` — seed orchestration and validation.
- `seed.ts` — top-level runner.

## Adding a crypto exchange

1. Copy an existing `.json` file in `crypto-exchanges/`.
2. Define the Provider (brand/legal-entity facts, sources and regulation) and the Offering (fees, features, assets and pros/limitations) in that JSON record.
3. Choose a globally unique slug for the Offering itself. It may equal the Provider slug when that is the clearest product identity (for example `coinspot`). Do not add `-exchange` merely to distinguish the Offering from its Provider. Use a descriptive suffix only when needed to distinguish multiple Offerings from one Provider (for example `etoro` and `etoro-crypto`).
4. Import the JSON file in `crypto-exchanges/index.ts` and append it to `CRYPTO_EXCHANGES`.
5. If it references a crypto symbol not yet present, add a new record such as `crypto-assets/dogecoin.json` and include it in `crypto-assets/index.ts`.

Dates must be ISO strings such as `"2026-09-24T00:00:00.000Z"`. The JSON loader converts them back to `Date` instances before seeding.

## Adding a share-trading platform

1. Copy an existing `.json` file in `share-trading-platforms/`.
2. Define the Provider and Offering in that JSON record.
3. Import it in `share-trading-platforms/index.ts` and append it to `SHARE_TRADING_PLATFORMS`.
4. Add a market as its own `markets/<code>.json` file only when verified offering data needs it, then include it in `markets/index.ts`.

## Adding an affiliate engagement

Create one `affiliate-engagements/<offering-slug>.json` file and add it to `affiliate-engagements/index.ts`. Research evidence URLs belong in the provider/offering JSON and must remain separate from commercial destination URLs.

The runner validates duplicate slugs and domain types before database writes. Unknown crypto asset symbols and unknown share-market codes fail loudly instead of being skipped. `npm run check:providers` reads the JSON records directly, so the verification report audits the same source-of-truth files that are seeded.

## Provider vs Offering identity

See `docs/IDENTITY-AND-SLUGS.md` for the canonical identity and slug rules. In short: Provider slugs identify organisations; Offering slugs identify the products/services users research, compare and use in tools.
