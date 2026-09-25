-- Finalise the Offering-level affiliate domain after the Engagement migration.
-- Safety first: refuse to drop old commercial rows that were not deterministically
-- mapped to an AffiliateEngagement. Resolve any multi-Offering Provider mapping
-- explicitly, then rerun prisma migrate deploy.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "AffiliateLink" l
    JOIN "AffiliateProgram" pr ON pr."id" = l."programId"
    JOIN "AffiliatePartnership" p ON p."id" = pr."partnershipId"
    WHERE NOT EXISTS (
      SELECT 1 FROM "AffiliateEngagement" e
      WHERE e."partnershipId" = p."id"
    )
  ) THEN
    RAISE EXCEPTION 'Affiliate cleanup blocked: at least one prior commercial destination has no AffiliateEngagement. Map multi-Offering Providers explicitly before removing the old tables.';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "AffiliateClick" c
    WHERE NOT EXISTS (
      SELECT 1 FROM "AffiliateEngagement" e
      WHERE e."id" = 'migrated_' || c."linkId"
    )
  ) THEN
    RAISE EXCEPTION 'Affiliate cleanup blocked: historical clicks exist for a commercial destination without a deterministic Engagement mapping. Migrate those events explicitly before removing the old tables.';
  END IF;
END $$;

-- Preserve deterministic historical click records created for Engagements that
-- Phase 8 backfilled with id = migrated_<old-link-id>.
INSERT INTO "AffiliateEvent" (
  "id", "engagementId", "eventType", "sourcePage", "placement", "campaign", "createdAt"
)
SELECT
  'migrated_' || c."id",
  'migrated_' || c."linkId",
  'CLICK'::"AffiliateEventType",
  c."sourcePage",
  c."placement",
  c."campaign",
  c."createdAt"
FROM "AffiliateClick" c
WHERE EXISTS (
  SELECT 1 FROM "AffiliateEngagement" e
  WHERE e."id" = 'migrated_' || c."linkId"
)
AND NOT EXISTS (
  SELECT 1 FROM "AffiliateEvent" e
  WHERE e."id" = 'migrated_' || c."id"
);

DROP TABLE "AffiliateConversion";
DROP TABLE "AffiliateClick";
DROP TABLE "AffiliateLink";
DROP TABLE "AffiliateProgram";
