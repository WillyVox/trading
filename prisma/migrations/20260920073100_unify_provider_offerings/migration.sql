-- Canonical comparison subjects: ProviderOffering now supports crypto and future domains.
ALTER TYPE "OfferingType" ADD VALUE IF NOT EXISTS 'CRYPTO_EXCHANGE';
ALTER TYPE "OfferingType" RENAME VALUE 'CFD' TO 'CFD_TRADING';
ALTER TYPE "OfferingType" ADD VALUE IF NOT EXISTS 'FOREX_TRADING';
ALTER TYPE "OfferingType" ADD VALUE IF NOT EXISTS 'CRYPTO_WALLET';

-- Rename the existing CFD enum value so historical rows keep their meaning.

ALTER TYPE "FeeCategory" ADD VALUE IF NOT EXISTS 'CRYPTO_TRADING';
ALTER TYPE "FeeCategory" ADD VALUE IF NOT EXISTS 'MAKER';
ALTER TYPE "FeeCategory" ADD VALUE IF NOT EXISTS 'TAKER';
ALTER TYPE "FeeCategory" ADD VALUE IF NOT EXISTS 'INSTANT_BUY';
ALTER TYPE "FeeCategory" ADD VALUE IF NOT EXISTS 'FIAT_DEPOSIT';
ALTER TYPE "FeeCategory" ADD VALUE IF NOT EXISTS 'FIAT_WITHDRAWAL';
ALTER TYPE "FeeCategory" ADD VALUE IF NOT EXISTS 'CRYPTO_WITHDRAWAL';
ALTER TYPE "FeeCategory" ADD VALUE IF NOT EXISTS 'SPREAD';

CREATE TYPE "OfferingFeatureType" AS ENUM ('AUD_DEPOSITS','AUD_WITHDRAWALS','PAYID','BANK_TRANSFER','CARD_DEPOSIT','MOBILE_APP','WEB_PLATFORM','LIMIT_ORDERS','MARKET_ORDERS','STOP_ORDERS','RECURRING_BUYS','STAKING','API_ACCESS','ADVANCED_CHARTING','TWO_FACTOR_AUTH','COLD_STORAGE','SMSF_SUPPORT','OTC_DESK','OTHER');
CREATE TYPE "OfferingProsConsType" AS ENUM ('PRO','LIMITATION');

CREATE TABLE "OfferingFeature" (
  "id" TEXT NOT NULL, "offeringId" TEXT NOT NULL, "featureType" "OfferingFeatureType" NOT NULL,
  "label" TEXT, "value" TEXT, "available" BOOLEAN, "sourceUrl" TEXT, "jurisdiction" TEXT,
  "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED', "verifiedAt" TIMESTAMP(3),
  CONSTRAINT "OfferingFeature_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "OfferingProsCon" (
  "id" TEXT NOT NULL, "offeringId" TEXT NOT NULL, "type" "OfferingProsConsType" NOT NULL,
  "label" TEXT NOT NULL, "detail" TEXT, "sourceUrl" TEXT, "jurisdiction" TEXT,
  "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED', "verifiedAt" TIMESTAMP(3), "position" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "OfferingProsCon_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "OfferingCryptoAsset" (
  "offeringId" TEXT NOT NULL, "assetId" TEXT NOT NULL,
  CONSTRAINT "OfferingCryptoAsset_pkey" PRIMARY KEY ("offeringId","assetId")
);
CREATE UNIQUE INDEX "OfferingFeature_offeringId_featureType_key" ON "OfferingFeature"("offeringId","featureType");
CREATE INDEX "OfferingFeature_offeringId_idx" ON "OfferingFeature"("offeringId");
CREATE INDEX "OfferingFeature_featureType_idx" ON "OfferingFeature"("featureType");
CREATE INDEX "OfferingProsCon_offeringId_idx" ON "OfferingProsCon"("offeringId");
CREATE INDEX "OfferingProsCon_offeringId_type_idx" ON "OfferingProsCon"("offeringId","type");
CREATE INDEX "OfferingCryptoAsset_assetId_idx" ON "OfferingCryptoAsset"("assetId");
CREATE INDEX "ProviderOffering_offeringType_idx" ON "ProviderOffering"("offeringType");
CREATE INDEX "ProviderOffering_offeringType_active_idx" ON "ProviderOffering"("offeringType","active");
ALTER TABLE "OfferingFeature" ADD CONSTRAINT "OfferingFeature_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OfferingProsCon" ADD CONSTRAINT "OfferingProsCon_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OfferingCryptoAsset" ADD CONSTRAINT "OfferingCryptoAsset_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OfferingCryptoAsset" ADD CONSTRAINT "OfferingCryptoAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "CryptoAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Existing offering rows were created as SHARE_TRADING by the project's seed.
-- Make the domain discriminator mandatory only after filling any historical nulls.
UPDATE "ProviderOffering" SET "offeringType" = 'SHARE_TRADING' WHERE "offeringType" IS NULL;
ALTER TABLE "ProviderOffering" ALTER COLUMN "offeringType" SET NOT NULL;
