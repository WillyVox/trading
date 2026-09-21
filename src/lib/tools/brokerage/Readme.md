Provider fee exists
        ↓
Can our structured engine represent ALL required conditions?
        │
     YES│        NO
        ↓         ↓
Calculator      Exclude it
shows it        rather than guess


-> This is safe, but the UX is not ideal. A beginner sees CommSec/Stake but has no idea why CMC and IBKR are absent.

I recommend the next fix be to expand the engine rather than simply force those providers into the dropdown. We should add structured support for concepts such as:

pricing plan
minimum fee
maximum fee
per-unit/per-share fee
trade-value tiers
monthly-volume tiers
first eligible trade/buy condition
per-security/per-day condition
market-specific rules
conditional free brokerage

Then CMC could potentially model a scenario such as:

CMC Invest
ASX
Buy
A$500

Published condition:
First eligible buy of this security today
and trade is below the applicable threshold

Estimated brokerage:
A$0.00

Assumptions
• This is a buy order
• It is the first eligible buy for this security today
• Other published eligibility conditions are satisfied

Not included
