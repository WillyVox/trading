# CMC Invest (Australia) — fee research manifest

- **Offering slug:** `cmc-invest` (provider: CMC Markets)
- **Last checked:** 2026-09-19
- **Seed file:** `prisma/seeds/offerings/cmc-invest.ts` (`fees` array)
- **Jurisdiction:** AU only.

## ⚠️ Same-name pitfall: this is NOT cmcinvest.com

`cmcinvest.com` (Core / Enhanced / Premium plan table, FX 0.99% / 0.50% / 0.39%, Cash ISA, SIPP) is the **UK** entity. SIPP and Cash ISA are UK wrappers that do not exist in Australia. None of that data may be seeded here. The AU offering is published only under **cmcmarkets.com/en-au/stockbroking**. Every `sourceUrl` in the AU seed must be on `cmcmarkets.com/en-au/` (or the AU legal documents it links to).

## Primary sources (official, AU)

| What                  | URL                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Pricing               | https://www.cmcmarkets.com/en-au/stockbroking/pricing                                                                                  |
| Overview / FAQ        | https://www.cmcmarkets.com/en-au/stockbroking                                                                                          |
| FSG / legal documents | https://www.cmcmarkets.com/en-au/legal-documents/stockbroking-legal-documents (not fetched — fee tables for phone brokerage live here) |

## Australian shares and ETFs (`marketCode: ASX`, online, Standard account)

From the pricing page. "Brokerage is the greater of the dollar value or the percentage amount shown." All brokerage fees are GST-inclusive.

| Order                                                                                    | Standard                   | ALPHA (notes text only)    |
| ---------------------------------------------------------------------------------------- | -------------------------- | -------------------------- |
| First buy under $1,000, once per security, per day (excludes margin-loan-settled trades) | $0                         | $0                         |
| All other buy orders and all sell orders                                                 | greater of $11.00 or 0.10% | greater of $9.90 or 0.075% |

**Source conflict, unresolved:** the overview-page FAQ says additional ASX trades are "$11 or 0.11%"; the pricing page table says 0.10%. The pricing page is treated as authoritative for the seed, and the "all other orders" row is left `UNVERIFIED` with a note until the FSG confirms.

Also inconsistent wording: the pricing page says first buy "under $1,000"; the overview page says "up to $1,000". The seed says "$1,000 cap" and notes the wording difference.

Earlier research note said "1 trade/day, ≤$1,000". The wording on CMC's own pages is **first buy per security per day**, not one trade per day overall — corrected here.

## International shares

- $0 brokerage on US, UK, Canada and Japan listed stocks and ETFs. **"FX spreads apply."** Seeded for `NYSE` and `NASDAQ` (`FREE`).
- **FX:** CMC states FX spreads apply to all international orders. No fixed FX conversion percentage is published on the pricing page or overview page. Seeded as `FX_CONVERSION` / `VARIES` with a plain-language `displayValue`; do **not** substitute the UK plan-table percentages above.
- **Not verified:** an earlier note claimed other international markets cost "$59 or 0.59%". That figure was not found on the AU pricing page as fetched (the international tab's table did not render in the fetch). Not seeded. Re-check against the FSG before adding.

## Account tiers

ALPHA (premium account for high-volume traders) has its own ASX rates (see table). Modelled in `notes` text only until `OfferingPricingPlan` exists (deferred until IBKR is seeded).

## Open items

- Resolve 0.10% vs 0.11% against the FSG.
- Confirm the international brokerage schedule for non-US/UK/CA/JP markets from the FSG.
- Confirm phone brokerage rates from the FSG (pricing page says "View our FSG for telephone brokerage fees").
