# CommSec — fee research manifest

- **Offering slug:** `commsec` (provider: Commonwealth Bank of Australia)
- **Last checked:** 2026-09-19
- **Seed file:** `prisma/seeds/offerings/commsec.ts` (`fees` array)
- **Jurisdiction:** AU only. Nothing below is sourced from a same-named non-AU product.

## Primary sources (official)

| What                         | URL                                                        | Notes                                                                                                                                                                                                                           |
| ---------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rates & fees (all schedules) | https://www.commsec.com.au/support/rates-and-fees.html     | Source of every schedule below.                                                                                                                                                                                                 |
| Financial Services Guide     | https://www.commsec.com.au/content/dam/EN/PDFs/FSG/fsg.pdf | Cross-check for boundaries ("up to and including"). Issue date seen: 29 Jun 2026. The PDF also contains older-looking schedules (e.g. ACA/CDIA, bank-settled "up to $25,000"); the live rates page is treated as authoritative. |
| $0 brokerage offer           | https://www.commsec.com.au/offer                           | Promo terms. Same terms repeated on commbank.com.au/investing/commsec-australian-shares.html.                                                                                                                                   |

## Australian shares — brokerage by channel (`marketCode: ASX`, `BROKERAGE`, `TIERED`)

Boundaries are "up to and including" unless stated. Values are GST-inclusive as published.

**Online, settle to CDIA / CommSec Margin Loan** → `ONLINE_STANDARD_SETTLEMENT`

| Trade value                | Fee    |
| -------------------------- | ------ |
| up to and incl. $1,000     | $5.00  |
| over $1,000 up to $3,000   | $10.00 |
| over $3,000 up to $10,000  | $19.95 |
| over $10,000 up to $25,000 | $29.95 |
| over $25,000               | 0.12%  |

Eligibility (footnote 6): trade online, CHESS-sponsored by CommSec, settle via CDIA or Margin Loan.

**Online, settle to a bank account of your choice** → `ONLINE_OWN_BANK_SETTLEMENT`

| Trade value               | Fee    |
| ------------------------- | ------ |
| up to and incl. $9,999.99 | $29.95 |
| $10,000 and above         | 0.31%  |

**Phone / deceased estates** → `PHONE_OR_ESTATE`

| Trade value                   | Fee    |
| ----------------------------- | ------ |
| up to and incl. $10,000       | $59.95 |
| over $10,000 up to $25,000    | 0.52%  |
| over $25,000 up to $1,000,000 | 0.49%  |
| over $1,000,000               | 0.11%  |

**Third-party settlement** → `THIRD_PARTY_SETTLEMENT`

| Trade value             | Fee    |
| ----------------------- | ------ |
| up to and incl. $15,000 | $99.95 |
| over $15,000            | 0.66%  |

Footnote 7 on the page: the phone/estate and third-party rows also include trades settling to CommSec Margin Loans or CBA Geared Investment Loans where CBA exercises its rights under the Margin Loan T&Cs.

Not modelled: CommSec Pocket (separate app-only schedule: $2.00 up to $1,000, 0.20% over). Pocket is a different product surface; add it when/if Pocket is seeded as its own offering.

## International shares — `GREATER_OF`, standard "International Shares" account

Seeded for the two markets that exist in `Market` today. Applies to both `NYSE` and `NASDAQ` (page lists "United States").

| Market        | Standard account              | Plus account (notes text only) |
| ------------- | ----------------------------- | ------------------------------ |
| United States | greater of USD $5.00 or 0.12% | greater of USD $9.95 or 0.20%  |

Other markets on the page (not seeded — no `Market` row yet): CA (CAD 40 or 0.40%), FR/DE/IT/NL (EUR 12 or 0.40%), HK (HKD 130 or 0.40%), JP (JPY 1,500 or 0.40%), NO (NOK 175 or 0.40%), SG (SGD 25 or 0.40%), SE (SEK 155 or 0.40%), CH (CHF 17 or 0.40%), UK (GBP 12 or 0.40%). Add `Market` rows and fee rows together when those markets are confirmed at the per-exchange level.

Footnotes: US/Canada brokerage includes SEC and FINRA fees; third-party taxes/fees are put through at cost.

## FX conversion — offering-wide, `PERCENTAGE`

0.55% per currency conversion. Conversions are automatic for each trade unless the Plus foreign-currency wallet is active and funded. Pairs with no direct conversion are charged per leg.

## Other fees seeded

- Off-market transfer fee: $54.00 per transfer (`EXCHANGE_TRANSFER`, `ASX`). Source: "Other Fees" table on the rates page.

## Promotion (time-boxed, layered on top of the standing schedule)

Source: https://www.commsec.com.au/offer

- **Who:** new-to-CommSec customers who open an Australian Shares, International Shares or ETO account between **1 Sep 2026 and 30 Sep 2026** and settle via CommSec Margin Loan or CDIA. Not open to existing customers; not valid with other offers; excludes CommSec Pocket. Not eligible if a pre-existing trading account was closed on/after 1 Sep 2026. 18+.
- **What:** $0 brokerage on up to **30 trades**, max **$50,000** per trade, for **orders placed 1 Oct 2026 – 31 Mar 2027**, placed online. Trades above $50,000 incur standard brokerage. Taxes and fees including FX still apply to international trades.
- **Modelling decision:** two dates exist (sign-up window vs. order window). `validFrom`/`validTo` are set to the **sign-up window** (1–30 Sep 2026) because that is the period in which the offer is actually obtainable; the order window is carried in `promotionalTerms`. After 30 Sep 2026 the promo badge stops rendering even though existing sign-ups can still use it through 31 Mar 2027 — a visitor arriving in October can no longer get it, and the page must not imply they can.
- The standing schedule keeps its own non-promotional rows; the promo row is an addition, never a replacement.

## Open items

- Confirm whether the bank-settled and phone schedules should carry the same ASX-only scope (page heading is "Australian Shares" — assumed ASX).
- Per-market international brokerage for non-US markets (see above).
