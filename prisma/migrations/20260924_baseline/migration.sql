-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('NEWS', 'GUIDE');

-- CreateEnum
CREATE TYPE "ArticleSourceType" AS ENUM ('OFFICIAL_PROVIDER', 'REGULATOR', 'GOVERNMENT', 'OFFICIAL_DOCUMENTATION', 'NEWS', 'RESEARCH', 'OTHER');

-- CreateEnum
CREATE TYPE "ArticleProviderRelationship" AS ENUM ('MENTIONED', 'COMPARED', 'FEATURED');

-- CreateEnum
CREATE TYPE "ArticleSearchIntent" AS ENUM ('LEARN', 'HOW_TO', 'BEGINNER', 'COMPARISON', 'PROVIDER_GUIDE', 'FEES', 'SECURITY', 'WALLET', 'REGULATION', 'MARKET_EDUCATION');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'UNVERIFIED', 'STALE');

-- CreateEnum
CREATE TYPE "ProviderSourceType" AS ENUM ('OFFICIAL_WEBSITE', 'OFFICIAL_FEES', 'OFFICIAL_TERMS', 'OFFICIAL_SUPPORT', 'REGULATOR', 'GOVERNMENT', 'APP_STORE', 'THIRD_PARTY_RESEARCH', 'OTHER');

-- CreateEnum
CREATE TYPE "OfferingType" AS ENUM ('CRYPTO_EXCHANGE', 'SHARE_TRADING', 'CFD_TRADING', 'FOREX_TRADING', 'MANAGED_FUND', 'SUPERANNUATION', 'CRYPTO_WALLET', 'OTHER');

-- CreateEnum
CREATE TYPE "OfferingFeatureType" AS ENUM ('AUD_DEPOSITS', 'AUD_WITHDRAWALS', 'PAYID', 'BANK_TRANSFER', 'CARD_DEPOSIT', 'MOBILE_APP', 'WEB_PLATFORM', 'LIMIT_ORDERS', 'MARKET_ORDERS', 'STOP_ORDERS', 'RECURRING_BUYS', 'STAKING', 'API_ACCESS', 'ADVANCED_CHARTING', 'COPY_TRADING', 'TWO_FACTOR_AUTH', 'COLD_STORAGE', 'SMSF_SUPPORT', 'OTC_DESK', 'OTHER');

-- CreateEnum
CREATE TYPE "OfferingProsConsType" AS ENUM ('PRO', 'LIMITATION');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'CONDITIONAL', 'LIMITED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "InvestmentProductType" AS ENUM ('AU_SHARES', 'INTERNATIONAL_SHARES', 'ETF', 'OPTIONS', 'BONDS', 'MANAGED_FUNDS', 'FUTURES', 'WARRANTS', 'FOREX', 'CFD', 'OTHER');

-- CreateEnum
CREATE TYPE "CustodyType" AS ENUM ('CHESS_SPONSORED', 'ISSUER_SPONSORED', 'CUSTODIAL', 'DIRECT_REGISTRATION', 'OMNIBUS', 'MIXED', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('INDIVIDUAL', 'JOINT', 'COMPANY', 'TRUST', 'SMSF', 'MINOR', 'ADVISER', 'PROFESSIONAL', 'OTHER');

-- CreateEnum
CREATE TYPE "FeeCategory" AS ENUM ('BROKERAGE', 'FX_CONVERSION', 'ACCOUNT_KEEPING', 'INACTIVITY', 'WITHDRAWAL', 'DEPOSIT', 'EXCHANGE_TRANSFER', 'CRYPTO_TRADING', 'MAKER', 'TAKER', 'INSTANT_BUY', 'FIAT_DEPOSIT', 'FIAT_WITHDRAWAL', 'CRYPTO_WITHDRAWAL', 'SPREAD', 'OTHER');

-- CreateEnum
CREATE TYPE "FeeCalculationBasis" AS ENUM ('FLAT', 'PERCENTAGE', 'GREATER_OF', 'TIERED', 'FREE', 'VARIES');

-- CreateEnum
CREATE TYPE "FeeTradeSide" AS ENUM ('ANY', 'BUY', 'SELL');

-- CreateEnum
CREATE TYPE "FeeChannel" AS ENUM ('ONLINE_STANDARD_SETTLEMENT', 'ONLINE_OWN_BANK_SETTLEMENT', 'PHONE_OR_ESTATE', 'THIRD_PARTY_SETTLEMENT');

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
    "passwordHash" TEXT,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "articleType" "ArticleType" NOT NULL,
    "keyTakeaways" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "author" TEXT,
    "reviewer" TEXT,
    "category" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "featuredImage" TEXT,
    "featuredImageAlt" TEXT,
    "affiliateDisclosureRequired" BOOLEAN NOT NULL DEFAULT false,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "lastReviewedAt" TIMESTAMP(3),
    "searchIntent" "ArticleSearchIntent",
    "region" TEXT,
    "canonicalArticleId" TEXT,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleRelated" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "relatedArticleId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleRelated_pkey" PRIMARY KEY ("id")
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
    "sourceType" "ArticleSourceType",

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
    "offeringType" "OfferingType" NOT NULL,
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
CREATE TABLE "OfferingFeature" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "featureType" "OfferingFeatureType" NOT NULL,
    "label" TEXT,
    "value" TEXT,
    "available" BOOLEAN,
    "sourceUrl" TEXT,
    "jurisdiction" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "OfferingFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferingProsCon" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "type" "OfferingProsConsType" NOT NULL,
    "label" TEXT NOT NULL,
    "detail" TEXT,
    "sourceUrl" TEXT,
    "jurisdiction" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OfferingProsCon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferingCryptoAsset" (
    "offeringId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "OfferingCryptoAsset_pkey" PRIMARY KEY ("offeringId","assetId")
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
    "reviewDueAt" TIMESTAMP(3),
    "verifiedByUserId" TEXT,

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
    "reviewDueAt" TIMESTAMP(3),
    "verifiedByUserId" TEXT,

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
    "reviewDueAt" TIMESTAMP(3),
    "verifiedByUserId" TEXT,

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
    "reviewDueAt" TIMESTAMP(3),
    "verifiedByUserId" TEXT,

    CONSTRAINT "OfferingAccountType_pkey" PRIMARY KEY ("id")
);

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
    "pricingPlan" TEXT,
    "tradeSide" "FeeTradeSide",
    "firstBuyPerSecurityPerDay" BOOLEAN,
    "minTradeAmount" DECIMAL(14,2),
    "maxTradeAmount" DECIMAL(14,2),
    "maxTradeAmountInclusive" BOOLEAN NOT NULL DEFAULT true,
    "excludesMarginLoanSettlement" BOOLEAN NOT NULL DEFAULT false,
    "gstPercent" DECIMAL(5,2),
    "tierVolumeCurrency" TEXT,
    "tierAssetsCurrency" TEXT,
    "isPromotional" BOOLEAN NOT NULL DEFAULT false,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "promotionalTerms" TEXT,
    "sourceUrl" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),
    "reviewDueAt" TIMESTAMP(3),
    "verifiedByUserId" TEXT,

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
    "minRolling30DayVolume" DECIMAL(18,2),
    "minAssetsOnPlatform" DECIMAL(18,2),

    CONSTRAINT "OfferingFeeTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "description" TEXT,
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

-- CreateTable
CREATE TABLE "RateLimitHit" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitHit_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "Article_category_idx" ON "Article"("category");

-- CreateIndex
CREATE INDEX "Article_region_idx" ON "Article"("region");

-- CreateIndex
CREATE INDEX "Article_searchIntent_idx" ON "Article"("searchIntent");

-- CreateIndex
CREATE INDEX "Article_status_articleType_publishedAt_idx" ON "Article"("status", "articleType", "publishedAt");

-- CreateIndex
CREATE INDEX "ArticleRelated_articleId_idx" ON "ArticleRelated"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleRelated_articleId_relatedArticleId_key" ON "ArticleRelated"("articleId", "relatedArticleId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleProvider_articleId_providerId_key" ON "ArticleProvider"("articleId", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Market_code_key" ON "Market"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderOffering_slug_key" ON "ProviderOffering"("slug");

-- CreateIndex
CREATE INDEX "ProviderOffering_providerId_idx" ON "ProviderOffering"("providerId");

-- CreateIndex
CREATE INDEX "ProviderOffering_offeringType_idx" ON "ProviderOffering"("offeringType");

-- CreateIndex
CREATE INDEX "ProviderOffering_offeringType_active_idx" ON "ProviderOffering"("offeringType", "active");

-- CreateIndex
CREATE INDEX "OfferingFeature_offeringId_idx" ON "OfferingFeature"("offeringId");

-- CreateIndex
CREATE INDEX "OfferingFeature_featureType_idx" ON "OfferingFeature"("featureType");

-- CreateIndex
CREATE UNIQUE INDEX "OfferingFeature_offeringId_featureType_key" ON "OfferingFeature"("offeringId", "featureType");

-- CreateIndex
CREATE INDEX "OfferingProsCon_offeringId_idx" ON "OfferingProsCon"("offeringId");

-- CreateIndex
CREATE INDEX "OfferingProsCon_offeringId_type_idx" ON "OfferingProsCon"("offeringId", "type");

-- CreateIndex
CREATE INDEX "OfferingCryptoAsset_assetId_idx" ON "OfferingCryptoAsset"("assetId");

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

-- CreateIndex
CREATE INDEX "OfferingFee_offeringId_idx" ON "OfferingFee"("offeringId");

-- CreateIndex
CREATE INDEX "OfferingFee_marketId_idx" ON "OfferingFee"("marketId");

-- CreateIndex
CREATE INDEX "OfferingFee_feeCategory_idx" ON "OfferingFee"("feeCategory");

-- CreateIndex
CREATE INDEX "OfferingFee_reviewDueAt_idx" ON "OfferingFee"("reviewDueAt");

-- CreateIndex
CREATE INDEX "OfferingFeeTier_feeId_idx" ON "OfferingFeeTier"("feeId");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE INDEX "ProviderFact_providerId_idx" ON "ProviderFact"("providerId");

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
CREATE INDEX "ArticleCryptoAsset_assetId_idx" ON "ArticleCryptoAsset"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateLink_partnerSlug_key" ON "AffiliateLink"("partnerSlug");

-- CreateIndex
CREATE INDEX "RateLimitHit_key_createdAt_idx" ON "RateLimitHit"("key", "createdAt");

-- CreateIndex
CREATE INDEX "RateLimitHit_createdAt_idx" ON "RateLimitHit"("createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_canonicalArticleId_fkey" FOREIGN KEY ("canonicalArticleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRelated" ADD CONSTRAINT "ArticleRelated_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRelated" ADD CONSTRAINT "ArticleRelated_relatedArticleId_fkey" FOREIGN KEY ("relatedArticleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleTag" ADD CONSTRAINT "ArticleTag_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleSource" ADD CONSTRAINT "ArticleSource_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleProvider" ADD CONSTRAINT "ArticleProvider_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleProvider" ADD CONSTRAINT "ArticleProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderOffering" ADD CONSTRAINT "ProviderOffering_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingFeature" ADD CONSTRAINT "OfferingFeature_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingProsCon" ADD CONSTRAINT "OfferingProsCon_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingCryptoAsset" ADD CONSTRAINT "OfferingCryptoAsset_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingCryptoAsset" ADD CONSTRAINT "OfferingCryptoAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "CryptoAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "OfferingFee" ADD CONSTRAINT "OfferingFee_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingFee" ADD CONSTRAINT "OfferingFee_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingFeeTier" ADD CONSTRAINT "OfferingFeeTier_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "OfferingFee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderFact" ADD CONSTRAINT "ProviderFact_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderSource" ADD CONSTRAINT "ProviderSource_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderRegulation" ADD CONSTRAINT "ProviderRegulation_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

