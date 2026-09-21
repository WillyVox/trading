-- Removes the legacy Provider-level product tables superseded by
-- ProviderOffering (see the 2026-09-16/18/20 offering migrations and the
-- 2026-09-20 offering-architecture cleanup). Provider now carries only
-- organisation/company-level data (facts, sources, regulations);
-- product/service data (fees, features, pros/cons, supported assets) lives
-- exclusively on ProviderOffering and its child tables going forward.
--
-- Safe by construction, not just by intent: as of this migration, no
-- application code reads or writes any of these four tables (confirmed by
-- removing their last remaining callers in the same change that produced
-- this migration), and prisma/seeds/README.md already documents "do not add
-- ProviderFee/ProviderFeature/ProviderAsset/ProviderProsCon seed data" as
-- policy. This migration is the schema catching up to code and process that
-- were already true.
--
-- Tables first (drops each table's own columns, including the ones typed
-- against the enums below), then the now-unreferenced enum types --
-- mirrors the drop-then-drop-type order already used in
-- 20260920090000_remove_provider_type.
DROP TABLE "ProviderFee";
DROP TABLE "ProviderFeature";
DROP TABLE "ProviderProsCon";
DROP TABLE "ProviderAsset";

DROP TYPE "ProviderFeeType";
DROP TYPE "FeeValueType";
DROP TYPE "ProviderFeatureType";
DROP TYPE "ProviderProsConsType";
