-- Repair structured calculator conditions on already-seeded CMC Invest rows.
-- This migration is intentionally data-only: older databases may contain the
-- Phase 2.5 labels/amounts but null advanced-condition columns, which caused a
-- A$500 buy to match the generic paid rule and hid the first-buy question.
UPDATE "OfferingFee" AS f
SET
  "pricingPlan" = 'Standard',
  "tradeSide" = 'BUY'::"FeeTradeSide",
  "firstBuyPerSecurityPerDay" = TRUE,
  "maxTradeAmount" = 1000.00,
  "maxTradeAmountInclusive" = FALSE,
  "excludesMarginLoanSettlement" = TRUE
FROM "ProviderOffering" AS o
WHERE f."offeringId" = o.id
  AND o.slug = 'cmc-invest'
  AND f.label = 'Standard: first eligible buy under $1,000';

UPDATE "OfferingFee" AS f
SET "pricingPlan"='Standard', "tradeSide"='BUY'::"FeeTradeSide", "firstBuyPerSecurityPerDay"=FALSE
FROM "ProviderOffering" AS o
WHERE f."offeringId"=o.id AND o.slug='cmc-invest' AND f.label='Standard: other buys';

UPDATE "OfferingFee" AS f
SET "pricingPlan"='Standard', "tradeSide"='BUY'::"FeeTradeSide", "minTradeAmount"=1000.00
FROM "ProviderOffering" AS o
WHERE f."offeringId"=o.id AND o.slug='cmc-invest' AND f.label='Standard: buy at or above $1,000';

UPDATE "OfferingFee" AS f
SET "pricingPlan"='Standard', "tradeSide"='SELL'::"FeeTradeSide"
FROM "ProviderOffering" AS o
WHERE f."offeringId"=o.id AND o.slug='cmc-invest' AND f.label='Standard: sell order';

UPDATE "OfferingFee" AS f
SET "pricingPlan"='Standard', "tradeSide"='BUY'::"FeeTradeSide"
FROM "ProviderOffering" AS o
WHERE f."offeringId"=o.id AND o.slug='cmc-invest' AND f.label='Standard: buy fallback when the free-buy conditions are not met';
