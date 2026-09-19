-- Provider catalog membership now lives exclusively on ProviderOffering.offeringType.
-- Provider remains the brand/legal-entity record.
ALTER TABLE "Provider" DROP COLUMN "providerType";
DROP TYPE "ProviderType";
