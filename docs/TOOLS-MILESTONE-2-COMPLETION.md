# Tools Milestone 2 — Brokerage Calculator completion

## Architecture

The browser-facing brokerage domain is independent of Prisma. Prisma enums and database records are confined to the server service, which maps records to serializable `BrokerageRule` DTOs. `calculate.ts`, `eligibility.ts`, shared tool types, and client components have no Prisma runtime dependency.

## Calculator-ready policy

Only active share-trading offerings with non-promotional, verified brokerage rows, a market, a valid HTTPS evidence URL, a valid verification date inside the 45-day review window, and a deterministic supported fee shape are exposed to the calculator. Conditional `FREE`, `VARIES`, stale, unverified, malformed, and incomplete rules are withheld rather than interpreted as zero.

## Supported deterministic shapes

- `FLAT`
- `PERCENTAGE`
- `GREATER_OF`
- `TIERED` trade-value schedules

The pure engine can explicitly surface `STALE`, `UNKNOWN`, `VARIABLE`, and `UNSUPPORTED` when such rules are supplied directly, while the server eligibility boundary prevents them from appearing as calculator-ready choices.

## Reusable UI

Shared components now cover the tool shell/panels, calculation result, calculation breakdown, assumptions/exclusions, source verification, disclaimer, and related research links. The brokerage calculator uses these components and remains responsive from narrow mobile layouts through desktop.

## SEO and discovery

`/tools` and all currently implemented tool routes are already included in the sitemap. Brokerage Calculator has unique metadata/canonical via `buildMetadata`, breadcrumb JSON-LD, explanatory copy, and related links to provider research, comparison, beginner education, and FX tooling. Query-string scenarios are not emitted as sitemap URLs; canonical remains the route URL.

## Deliberate limitations

The calculator does not model per-share pricing, monthly-volume tiers, first-buy-per-security-per-day conditions, promotions, or pricing plans not represented by the current structured fee model. These cases must remain unavailable rather than being approximated.
