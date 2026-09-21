-- Phase 7.1: structured qualification inputs for advanced crypto fee tiers.
ALTER TABLE "OfferingFee"
  ADD COLUMN "tierVolumeCurrency" TEXT,
  ADD COLUMN "tierAssetsCurrency" TEXT;

ALTER TABLE "OfferingFeeTier"
  ADD COLUMN "minRolling30DayVolume" DECIMAL(18,2),
  ADD COLUMN "minAssetsOnPlatform" DECIMAL(18,2);
