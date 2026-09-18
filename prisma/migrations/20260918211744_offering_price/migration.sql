-- CreateEnum
CREATE TYPE "FeeCategory" AS ENUM ('BROKERAGE', 'FX_CONVERSION', 'ACCOUNT_KEEPING', 'INACTIVITY', 'WITHDRAWAL', 'DEPOSIT', 'EXCHANGE_TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "FeeCalculationBasis" AS ENUM ('FLAT', 'PERCENTAGE', 'GREATER_OF', 'TIERED', 'FREE', 'VARIES');

-- CreateEnum
CREATE TYPE "FeeChannel" AS ENUM ('ONLINE_STANDARD_SETTLEMENT', 'ONLINE_OWN_BANK_SETTLEMENT', 'PHONE_OR_ESTATE', 'THIRD_PARTY_SETTLEMENT');

-- CreateTable
CREATE TABLE "OfferingFee" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "marketId" TEXT,
    "feeCategory" "FeeCategory" NOT NULL,
    "channel" "FeeChannel",
    "label" TEXT NOT NULL,
    "calculationBasis" "FeeCalculationBasis" NOT NULL,
    "flatAmount" DECIMAL(10,2),
    "percentage" DECIMAL(6,4),
    "currency" TEXT,
    "displayValue" TEXT,
    "notes" TEXT,
    "isPromotional" BOOLEAN NOT NULL DEFAULT false,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "promotionalTerms" TEXT,
    "sourceUrl" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "OfferingFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferingFeeTier" (
    "id" TEXT NOT NULL,
    "feeId" TEXT NOT NULL,
    "minAmount" DECIMAL(14,2) NOT NULL,
    "maxAmount" DECIMAL(14,2),
    "flatAmount" DECIMAL(10,2),
    "percentage" DECIMAL(6,4),
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OfferingFeeTier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OfferingFee_offeringId_idx" ON "OfferingFee"("offeringId");

-- CreateIndex
CREATE INDEX "OfferingFee_marketId_idx" ON "OfferingFee"("marketId");

-- CreateIndex
CREATE INDEX "OfferingFee_feeCategory_idx" ON "OfferingFee"("feeCategory");

-- CreateIndex
CREATE INDEX "OfferingFeeTier_feeId_idx" ON "OfferingFeeTier"("feeId");

-- AddForeignKey
ALTER TABLE "OfferingFee" ADD CONSTRAINT "OfferingFee_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingFee" ADD CONSTRAINT "OfferingFee_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingFeeTier" ADD CONSTRAINT "OfferingFeeTier_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "OfferingFee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
