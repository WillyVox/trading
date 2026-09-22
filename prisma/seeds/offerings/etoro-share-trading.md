# eToro Australia — share-trading seed research manifest

Checked: 2026-09-22. Scope: non-leveraged long stock/ETF investing for Australian clients. CFD positions are explicitly outside this offering.

| Fact | Official source | Seed representation | Status / caveat |
|---|---|---|---|
| AU entity / AFSL | https://www.etoro.com/au/trading/markets/ | Shared provider: eToro AUS Capital Limited, AFSL 491139 | Verified. |
| Stock ownership | https://www.etoro.com/au/trading/markets/ | CUSTODIAL; HIN=false | eToro says non-leveraged long stock/ETF investing is through eToro Service, a managed investment scheme. Scheme has legal ownership; investor has beneficial ownership; no voting rights; shares non-transferable. `CUSTODIAL` is the closest current enum and description preserves the exact structure. |
| Stock commission | https://www.etoro.com/au/trading/fees/ | VARIES, US$1 or US$2 may apply | The AU fee page's dynamic country table did not expose a sufficiently reliable Australia/exchange mapping during verification. Do not infer a per-exchange calculable fee. |
| AUD local-stock FX | https://www.etoro.com/au/trading/currency-accounts/ | FREE for ASX/AUD-account scenario | Verified; eligibility criteria apply. |
| Other FX | https://www.etoro.com/au/trading/fees/ | VARIES | Varies by scenario/location/payment method/Club level. |
| CopyTrader | https://www.etoro.com/au/copytrader/ | COPY_TRADING feature | Verified; schema enum added because this is a reusable platform capability. |

Review due for pricing rows: 2026-11-06.
