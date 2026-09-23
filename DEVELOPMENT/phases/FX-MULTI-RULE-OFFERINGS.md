# FX offerings with multiple pricing rules

An offering can legitimately publish more than one `FX_CONVERSION` fee. eToro Share Trading is the current example: an ASX-specific AUD-account rule and a generic rule for other conversion scenarios.

`getFxOfferings()` therefore groups fee rows by offering instead of turning each fee row into a duplicate platform option. `FxOfferingOption.rules` preserves every published rule.

The standalone FX calculator shows one platform row and, only when needed, a separate **FX pricing scenario** selector. The combined trading-cost calculator already knows the selected market, so it chooses an exact market-specific FX rule first and falls back to a generic rule only when no market-specific rule exists.

`FREE` is represented explicitly and calculates to A$0 only when the published rule itself says the selected scenario has no FX conversion fee. `VARIES`, missing, stale and unverified pricing are never converted to zero.

This is intentionally a data-model fix rather than UI name deduplication: deduplicating by offering slug while retaining only one fee would silently discard legitimate pricing scenarios.
