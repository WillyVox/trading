-- CreateEnum
CREATE TYPE "OfferingType" AS ENUM ('SHARE_TRADING', 'CFD', 'MANAGED_FUND', 'SUPERANNUATION', 'OTHER');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'CONDITIONAL', 'LIMITED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "InvestmentProductType" AS ENUM ('AU_SHARES', 'INTERNATIONAL_SHARES', 'ETF', 'OPTIONS', 'BONDS', 'MANAGED_FUNDS', 'FUTURES', 'WARRANTS', 'FOREX', 'CFD', 'OTHER');

-- CreateEnum
CREATE TYPE "CustodyType" AS ENUM ('CHESS_SPONSORED', 'ISSUER_SPONSORED', 'CUSTODIAL', 'DIRECT_REGISTRATION', 'OMNIBUS', 'MIXED', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('INDIVIDUAL', 'JOINT', 'COMPANY', 'TRUST', 'SMSF', 'MINOR', 'ADVISER', 'PROFESSIONAL', 'OTHER');

-- CreateTable
CREATE TABLE "Market" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" TEXT,
    "exchangeCode" TEXT,
    "currency" TEXT,
    "region" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderOffering" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "description" TEXT,
    "offeringType" "OfferingType",
    "jurisdiction" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "lastVerifiedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferingMarket" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "availability" "AvailabilityStatus" NOT NULL DEFAULT 'UNKNOWN',
    "notes" TEXT,
    "sourceUrl" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "OfferingMarket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferingProduct" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "productType" "InvestmentProductType" NOT NULL,
    "availability" "AvailabilityStatus" NOT NULL DEFAULT 'UNKNOWN',
    "notes" TEXT,
    "sourceUrl" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "OfferingProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferingCustody" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "marketId" TEXT,
    "custodyType" "CustodyType" NOT NULL,
    "hinSupported" BOOLEAN,
    "custodianName" TEXT,
    "description" TEXT,
    "sourceUrl" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "OfferingCustody_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferingAccountType" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "availability" "AvailabilityStatus" NOT NULL DEFAULT 'UNKNOWN',
    "notes" TEXT,
    "sourceUrl" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "OfferingAccountType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Market_code_key" ON "Market"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderOffering_slug_key" ON "ProviderOffering"("slug");

-- CreateIndex
CREATE INDEX "ProviderOffering_providerId_idx" ON "ProviderOffering"("providerId");

-- CreateIndex
CREATE INDEX "OfferingMarket_offeringId_idx" ON "OfferingMarket"("offeringId");

-- CreateIndex
CREATE INDEX "OfferingMarket_marketId_idx" ON "OfferingMarket"("marketId");

-- CreateIndex
CREATE UNIQUE INDEX "OfferingMarket_offeringId_marketId_key" ON "OfferingMarket"("offeringId", "marketId");

-- CreateIndex
CREATE INDEX "OfferingProduct_offeringId_idx" ON "OfferingProduct"("offeringId");

-- CreateIndex
CREATE UNIQUE INDEX "OfferingProduct_offeringId_productType_key" ON "OfferingProduct"("offeringId", "productType");

-- CreateIndex
CREATE INDEX "OfferingCustody_offeringId_idx" ON "OfferingCustody"("offeringId");

-- CreateIndex
CREATE INDEX "OfferingCustody_marketId_idx" ON "OfferingCustody"("marketId");

-- CreateIndex
CREATE INDEX "OfferingAccountType_offeringId_idx" ON "OfferingAccountType"("offeringId");

-- CreateIndex
CREATE UNIQUE INDEX "OfferingAccountType_offeringId_accountType_key" ON "OfferingAccountType"("offeringId", "accountType");

-- AddForeignKey
ALTER TABLE "ProviderOffering" ADD CONSTRAINT "ProviderOffering_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingMarket" ADD CONSTRAINT "OfferingMarket_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingMarket" ADD CONSTRAINT "OfferingMarket_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingProduct" ADD CONSTRAINT "OfferingProduct_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingCustody" ADD CONSTRAINT "OfferingCustody_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingCustody" ADD CONSTRAINT "OfferingCustody_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingAccountType" ADD CONSTRAINT "OfferingAccountType_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
