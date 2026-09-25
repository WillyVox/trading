/**
 * Canonical public paths for crypto-exchange Offerings.
 *
 * Product-facing URLs always use ProviderOffering.slug. Keep these helpers as
 * the single construction point so profiles, comparisons, sitemap entries,
 * breadcrumbs and structured data cannot drift back to Provider.slug.
 */
export const CRYPTO_EXCHANGES_PATH = "/crypto/exchanges" as const;
export const CRYPTO_EXCHANGE_COMPARISON_PATH =
  "/compare/crypto-exchanges" as const;

export function cryptoExchangePath(offeringSlug: string): string {
  return `${CRYPTO_EXCHANGES_PATH}/${encodeURIComponent(offeringSlug)}`;
}

export function cryptoExchangeComparisonPath(compareSlug: string): string {
  return `${CRYPTO_EXCHANGE_COMPARISON_PATH}/${encodeURIComponent(compareSlug)}`;
}
