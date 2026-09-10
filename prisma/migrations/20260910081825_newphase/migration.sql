-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ArticleProviderRelationship" AS ENUM ('MENTIONED', 'COMPARED', 'FEATURED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'UNVERIFIED', 'STALE');

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('CRYPTO_EXCHANGE', 'BROKER', 'MULTI_ASSET_BROKER', 'TRADING_PLATFORM', 'WALLET_PROVIDER', 'OTHER');

-- CreateEnum
CREATE TYPE "ProviderFeeType" AS ENUM ('TRADING', 'MAKER', 'TAKER', 'INSTANT_BUY', 'DEPOSIT', 'WITHDRAWAL', 'FIAT_DEPOSIT', 'FIAT_WITHDRAWAL', 'SPREAD', 'OTHER');

-- CreateEnum
CREATE TYPE "FeeValueType" AS ENUM ('PERCENTAGE', 'FIXED', 'TIERED', 'VARIABLE', 'FREE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ProviderFeatureType" AS ENUM ('AUD_DEPOSITS', 'AUD_WITHDRAWALS', 'PAYID', 'BANK_TRANSFER', 'CARD_DEPOSIT', 'MOBILE_APP', 'WEB_PLATFORM', 'LIMIT_ORDERS', 'MARKET_ORDERS', 'STOP_ORDERS', 'RECURRING_BUYS', 'STAKING', 'API_ACCESS', 'ADVANCED_CHARTING', 'TWO_FACTOR_AUTH', 'COLD_STORAGE', 'SMSF_SUPPORT', 'OTC_DESK');

-- CreateEnum
CREATE TYPE "ProviderSourceType" AS ENUM ('OFFICIAL_WEBSITE', 'OFFICIAL_FEES', 'OFFICIAL_TERMS', 'OFFICIAL_SUPPORT', 'REGULATOR', 'GOVERNMENT', 'APP_STORE', 'THIRD_PARTY_RESEARCH', 'OTHER');

-- CreateEnum
CREATE TYPE "AffiliatePartnerStatus" AS ENUM ('PROSPECT', 'APPLIED', 'APPROVED', 'ACTIVE', 'PAUSED', 'REJECTED', 'ENDED');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('CPA', 'REVSHARE', 'HYBRID', 'NONE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "author" TEXT,
    "reviewer" TEXT,
    "category" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "featuredImage" TEXT,
    "affiliateDisclosureRequired" BOOLEAN NOT NULL DEFAULT false,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleTag" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "ArticleTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleSource" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ArticleSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleProvider" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "relationshipType" "ArticleProviderRelationship" NOT NULL DEFAULT 'MENTIONED',

    CONSTRAINT "ArticleProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "description" TEXT,
    "providerType" "ProviderType",
    "jurisdictions" TEXT[],
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "lastVerifiedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderFact" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "jurisdiction" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "ProviderFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderFee" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "feeType" "ProviderFeeType" NOT NULL,
    "label" TEXT NOT NULL,
    "valueType" "FeeValueType" NOT NULL,
    "percentage" DECIMAL(10,6),
    "fixedAmount" DECIMAL(18,8),
    "currency" TEXT,
    "displayValue" TEXT,
    "notes" TEXT,
    "sourceUrl" TEXT,
    "jurisdiction" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "ProviderFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderFeature" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "featureType" "ProviderFeatureType" NOT NULL,
    "label" TEXT,
    "value" TEXT,
    "available" BOOLEAN,
    "sourceUrl" TEXT,
    "jurisdiction" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "ProviderFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderSource" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sourceType" "ProviderSourceType" NOT NULL,
    "jurisdiction" TEXT,
    "publishedAt" TIMESTAMP(3),
    "checkedAt" TIMESTAMP(3),
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',

    CONSTRAINT "ProviderSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderRegulation" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "regulator" TEXT NOT NULL,
    "registrationId" TEXT,
    "status" TEXT,
    "sourceUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "ProviderRegulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoAsset" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CryptoAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderAsset" (
    "providerId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "ProviderAsset_pkey" PRIMARY KEY ("providerId","assetId")
);

-- CreateTable
CREATE TABLE "ArticleCryptoAsset" (
    "articleId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "ArticleCryptoAsset_pkey" PRIMARY KEY ("articleId","assetId")
);

-- CreateTable
CREATE TABLE "AffiliatePartnership" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "status" "AffiliatePartnerStatus" NOT NULL DEFAULT 'PROSPECT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliatePartnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateProgram" (
    "id" TEXT NOT NULL,
    "partnershipId" TEXT NOT NULL,
    "commissionType" "CommissionType" NOT NULL DEFAULT 'NONE',
    "notes" TEXT,

    CONSTRAINT "AffiliateProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateLink" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "partnerSlug" TEXT NOT NULL,
    "approvedUrl" TEXT NOT NULL,
    "placement" TEXT,
    "campaign" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AffiliateLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateClick" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "sourcePage" TEXT,
    "placement" TEXT,
    "campaign" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateConversion" (
    "id" TEXT NOT NULL,
    "clickId" TEXT,
    "amount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateConversion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleProvider_articleId_providerId_key" ON "ArticleProvider"("articleId", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE INDEX "ProviderFact_providerId_idx" ON "ProviderFact"("providerId");

-- CreateIndex
CREATE INDEX "ProviderFee_providerId_idx" ON "ProviderFee"("providerId");

-- CreateIndex
CREATE INDEX "ProviderFee_feeType_idx" ON "ProviderFee"("feeType");

-- CreateIndex
CREATE INDEX "ProviderFeature_providerId_idx" ON "ProviderFeature"("providerId");

-- CreateIndex
CREATE INDEX "ProviderFeature_featureType_idx" ON "ProviderFeature"("featureType");

-- CreateIndex
CREATE INDEX "ProviderSource_providerId_idx" ON "ProviderSource"("providerId");

-- CreateIndex
CREATE INDEX "ProviderSource_sourceType_idx" ON "ProviderSource"("sourceType");

-- CreateIndex
CREATE INDEX "ProviderRegulation_providerId_idx" ON "ProviderRegulation"("providerId");

-- CreateIndex
CREATE INDEX "ProviderRegulation_jurisdiction_idx" ON "ProviderRegulation"("jurisdiction");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAsset_symbol_key" ON "CryptoAsset"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAsset_slug_key" ON "CryptoAsset"("slug");

-- CreateIndex
CREATE INDEX "ProviderAsset_assetId_idx" ON "ProviderAsset"("assetId");

-- CreateIndex
CREATE INDEX "ArticleCryptoAsset_assetId_idx" ON "ArticleCryptoAsset"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateLink_partnerSlug_key" ON "AffiliateLink"("partnerSlug");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleTag" ADD CONSTRAINT "ArticleTag_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleSource" ADD CONSTRAINT "ArticleSource_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleProvider" ADD CONSTRAINT "ArticleProvider_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleProvider" ADD CONSTRAINT "ArticleProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderFact" ADD CONSTRAINT "ProviderFact_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderFee" ADD CONSTRAINT "ProviderFee_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderFeature" ADD CONSTRAINT "ProviderFeature_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderSource" ADD CONSTRAINT "ProviderSource_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderRegulation" ADD CONSTRAINT "ProviderRegulation_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderAsset" ADD CONSTRAINT "ProviderAsset_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderAsset" ADD CONSTRAINT "ProviderAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "CryptoAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleCryptoAsset" ADD CONSTRAINT "ArticleCryptoAsset_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleCryptoAsset" ADD CONSTRAINT "ArticleCryptoAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "CryptoAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliatePartnership" ADD CONSTRAINT "AffiliatePartnership_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateProgram" ADD CONSTRAINT "AffiliateProgram_partnershipId_fkey" FOREIGN KEY ("partnershipId") REFERENCES "AffiliatePartnership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_programId_fkey" FOREIGN KEY ("programId") REFERENCES "AffiliateProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateClick" ADD CONSTRAINT "AffiliateClick_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "AffiliateLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
