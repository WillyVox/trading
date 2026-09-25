-- Phase 8: separate Provider-level agreements from Offering-level engagements.
-- This migration is additive. Legacy AffiliateProgram/AffiliateLink/AffiliateClick
-- tables remain intact so rollout can be verified before a later cleanup.
CREATE TYPE "AffiliateEngagementStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ENDED');
CREATE TYPE "AffiliateEventType" AS ENUM ('CLICK', 'REDIRECT', 'CONVERSION');

ALTER TABLE "AffiliatePartnership"
  ADD COLUMN "network" TEXT,
  ADD COLUMN "externalPartnerId" TEXT,
  ADD COLUMN "agreementReference" TEXT,
  ADD COLUMN "startedAt" TIMESTAMP(3),
  ADD COLUMN "endedAt" TIMESTAMP(3),
  ADD COLUMN "notes" TEXT;

CREATE TABLE "AffiliateEngagement" (
  "id" TEXT NOT NULL,
  "partnershipId" TEXT NOT NULL,
  "offeringId" TEXT NOT NULL,
  "status" "AffiliateEngagementStatus" NOT NULL DEFAULT 'DRAFT',
  "destinationUrl" TEXT NOT NULL,
  "commissionType" "CommissionType" NOT NULL DEFAULT 'NONE',
  "commissionValue" DECIMAL(12,4),
  "commissionCurrency" TEXT,
  "campaignReference" TEXT,
  "trackingCode" TEXT,
  "validFrom" TIMESTAMP(3),
  "validUntil" TIMESTAMP(3),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AffiliateEngagement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AffiliateEvent" (
  "id" TEXT NOT NULL,
  "engagementId" TEXT NOT NULL,
  "eventType" "AffiliateEventType" NOT NULL DEFAULT 'CLICK',
  "sourcePage" TEXT,
  "placement" TEXT,
  "campaign" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AffiliateEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AffiliateEngagement_partnershipId_idx" ON "AffiliateEngagement"("partnershipId");
CREATE INDEX "AffiliateEngagement_offeringId_status_idx" ON "AffiliateEngagement"("offeringId", "status");
CREATE INDEX "AffiliateEvent_engagementId_createdAt_idx" ON "AffiliateEvent"("engagementId", "createdAt");
CREATE INDEX "AffiliateEvent_eventType_createdAt_idx" ON "AffiliateEvent"("eventType", "createdAt");

ALTER TABLE "AffiliateEngagement" ADD CONSTRAINT "AffiliateEngagement_partnershipId_fkey"
  FOREIGN KEY ("partnershipId") REFERENCES "AffiliatePartnership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AffiliateEngagement" ADD CONSTRAINT "AffiliateEngagement_offeringId_fkey"
  FOREIGN KEY ("offeringId") REFERENCES "ProviderOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AffiliateEvent" ADD CONSTRAINT "AffiliateEvent_engagementId_fkey"
  FOREIGN KEY ("engagementId") REFERENCES "AffiliateEngagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill only where a Provider has exactly one Offering. Multi-Offering
-- Providers are intentionally left for explicit review; guessing could attach
-- a commercial agreement to the wrong product.
INSERT INTO "AffiliateEngagement" (
  "id", "partnershipId", "offeringId", "status", "destinationUrl",
  "commissionType", "campaignReference", "notes", "createdAt", "updatedAt"
)
SELECT
  'migrated_' || l."id",
  p."id",
  o."id",
  CASE WHEN l."active" AND p."status" IN ('APPROVED','ACTIVE')
       THEN 'ACTIVE'::"AffiliateEngagementStatus"
       ELSE 'DRAFT'::"AffiliateEngagementStatus" END,
  l."approvedUrl",
  pr."commissionType",
  l."campaign",
  pr."notes",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "AffiliateLink" l
JOIN "AffiliateProgram" pr ON pr."id" = l."programId"
JOIN "AffiliatePartnership" p ON p."id" = pr."partnershipId"
JOIN "ProviderOffering" o ON o."providerId" = p."providerId"
WHERE (SELECT COUNT(*) FROM "ProviderOffering" x WHERE x."providerId" = p."providerId") = 1
  AND NOT EXISTS (
    SELECT 1 FROM "AffiliateEngagement" e
    WHERE e."partnershipId" = p."id" AND e."offeringId" = o."id"
  );
