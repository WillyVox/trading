# moomoo Australia — seed research manifest

Checked: 2026-09-22. Scope: Australian share-trading offering only. Official first-party sources are preferred.

| Fact | Official source | Seed representation | Status / caveat |
|---|---|---|---|
| AU entity / AFSL | https://www.moomoo.com/au | Moomoo Securities Australia Ltd; AFSL 224663 is stated on AU site | Verified provider identity; AFSL is not duplicated as a ProviderRegulation until a stable official regulatory/FSG source is refreshed. |
| ASX brokerage | https://www.moomoo.com/au/pricing | GREATER_OF A$3 / 0.03%; GST inclusive | Verified. Promotions excluded. |
| ASX ownership | https://www.moomoo.com/au/support/topic6_506 | CHESS_SPONSORED; HIN=true; FinClear Execution Limited | Verified. New clients default to CHESS-sponsored from 8 Apr 2024; custodial account can be requested. |
| US standard order | https://www.moomoo.com/au/pricing | FLAT US$0.99 for NYSE/NASDAQ | Verified headline; pass-through/service fees and FX excluded. Fractional/recurring sub-one-share pricing differs. |
| US fractional/recurring | https://www.moomoo.com/au/feature/recurring-investment | Not separately calculable in current rule engine | Official page says US$0.99/trade or 0.99% of transaction amount, whichever is less. Current engine lacks LEAST_OF/cap semantics. |
| Hong Kong access | https://www.moomoo.com/au/pricing | HKEX market AVAILABLE | Verified. HK brokerage is deliberately not seeded because the published schedule combines a greater-of commission with a separate flat platform fee and the current calculator does not aggregate those components safely. |
| FX | https://www.moomoo.com/au/learn/how-to-exchange-currency-on-moomoo | VARIES | Official AU source confirms displayed exchange rate but a current fixed percentage was not sufficiently verified; no 0.55% assumption is seeded. |
| US custody | https://www.moomoo.com/au/learn/is-stake-chess-sponsored | CUSTODIAL; Futu Clearing Inc. | Verified from Moomoo AU explainer. |

Review due for pricing rows: 2026-11-06.
