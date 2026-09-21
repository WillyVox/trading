CREATE TYPE "FeeTradeSide" AS ENUM ('ANY', 'BUY', 'SELL');
ALTER TABLE "OfferingFee"
  ADD COLUMN "pricingPlan" TEXT,
  ADD COLUMN "tradeSide" "FeeTradeSide",
  ADD COLUMN "firstBuyPerSecurityPerDay" BOOLEAN,
  ADD COLUMN "minTradeAmount" DECIMAL(14,2),
  ADD COLUMN "maxTradeAmount" DECIMAL(14,2),
  ADD COLUMN "maxTradeAmountInclusive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "excludesMarginLoanSettlement" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "gstPercent" DECIMAL(5,2);
