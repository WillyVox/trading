-- Phase 1: normalize crypto Offering slugs.
--
-- Provider.slug remains the organisation identity. ProviderOffering.slug is the
-- canonical product/service identity. For single-product crypto brands these
-- values may intentionally be identical; the tables have independent unique
-- constraints, so no artificial "-exchange" suffix is required.
--
-- Update existing rows in place so Offering IDs and all child relations remain
-- stable. eToro Crypto intentionally remains "etoro-crypto" because the same
-- Provider also has the globally unique share-trading Offering slug "etoro".

UPDATE "ProviderOffering"
SET "slug" = CASE "slug"
  WHEN 'btc-markets-exchange' THEN 'btc-markets'
  WHEN 'coinjar-exchange' THEN 'coinjar'
  WHEN 'coinspot-exchange' THEN 'coinspot'
  WHEN 'independent-reserve-exchange' THEN 'independent-reserve'
  WHEN 'kraken-exchange' THEN 'kraken'
  WHEN 'swyftx-exchange' THEN 'swyftx'
  ELSE "slug"
END,
"updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" IN (
  'btc-markets-exchange',
  'coinjar-exchange',
  'coinspot-exchange',
  'independent-reserve-exchange',
  'kraken-exchange',
  'swyftx-exchange'
);
