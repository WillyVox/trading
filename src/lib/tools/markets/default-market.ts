export const DEFAULT_MARKET_CODE = "ASX";

/**
 * Prefer the Australian Securities Exchange whenever it is available.
 * Falls back to the first available market so providers without ASX support
 * remain usable.
 */
export function getDefaultMarketCode(
  marketCodes: readonly (string | null | undefined)[]
): string {
  const codes = marketCodes.filter((code): code is string => Boolean(code));
  return codes.includes(DEFAULT_MARKET_CODE)
    ? DEFAULT_MARKET_CODE
    : (codes[0] ?? "");
}
