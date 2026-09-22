/**
 * Deliberately a small, real set rather than an exhaustive exchange list --
 * see docs/IMPLEMENTATION-PLAN.md §13: Market is a reusable model precisely
 * so it grows as real, verified offering data needs it, not by pre-seeding
 * every exchange a broker might plausibly support. Both CMC Invest and
 * CommSec advertise broader "international markets" access than just the
 * US, but neither offering seed below claims specific non-US markets we
 * haven't independently confirmed at the per-exchange level (see the
 * UNVERIFIED notes on their OfferingMarket rows).
 */
export const SEED_MARKETS = [
  {
    code: "ASX",
    name: "Australian Securities Exchange",
    countryCode: "AU",
    exchangeCode: "ASX",
    currency: "AUD",
    region: "Australia",
  },
  {
    code: "NYSE",
    name: "New York Stock Exchange",
    countryCode: "US",
    exchangeCode: "NYSE",
    currency: "USD",
    region: "North America",
  },
  {
    code: "NASDAQ",
    name: "Nasdaq",
    countryCode: "US",
    exchangeCode: "NASDAQ",
    currency: "USD",
    region: "North America",
  },
  {
    code: "HKEX",
    name: "Hong Kong Stock Exchange",
    countryCode: "HK",
    exchangeCode: "HKEX",
    currency: "HKD",
    region: "Asia",
  },
];
