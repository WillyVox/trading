import { PrismaClient } from "@prisma/client";
import { CRYPTO_EXCHANGES } from "../prisma/seeds/crypto-exchanges";
import { SHARE_TRADING_PLATFORMS } from "../prisma/seeds/share-trading-platforms";
import { seedAffiliateEngagements } from "../prisma/seeds/lib/seed-affiliate-engagements";
import { seedCryptoAssets } from "../prisma/seeds/lib/seed-crypto-assets";
import { seedCryptoExchanges } from "../prisma/seeds/lib/seed-crypto-exchanges";
import { seedShareTradingPlatforms } from "../prisma/seeds/lib/seed-share-trading-platforms";
import { validateCatalogSlugs } from "../prisma/seeds/lib/validation";
const prisma = new PrismaClient();
const CONFIRMATION = "FIRST_PRODUCTION_BOOTSTRAP_ONLY";
async function main() {
  if (process.env.PRODUCTION_BOOTSTRAP_CONFIRMED !== CONFIRMATION)
    throw new Error(
      `Refusing production bootstrap. Set PRODUCTION_BOOTSTRAP_CONFIRMED=${CONFIRMATION} only for the reviewed first-production bootstrap.`
    );
  if (process.env.PRODUCTION_BACKUP_VERIFIED !== "true")
    throw new Error(
      "Refusing production bootstrap until PRODUCTION_BACKUP_VERIFIED=true."
    );
  const [
    users,
    articles,
    providers,
    offerings,
    affiliateEvents,
    affiliateEngagements,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.article.count(),
    prisma.provider.count(),
    prisma.providerOffering.count(),
    prisma.affiliateEvent.count(),
    prisma.affiliateEngagement.count(),
  ]);
  const existing = {
    users,
    articles,
    providers,
    offerings,
    affiliateEvents,
    affiliateEngagements,
  };
  if (Object.values(existing).some((count) => count > 0))
    throw new Error(
      `Refusing first-production bootstrap because the database is not empty. Observed counts: ${JSON.stringify(existing)}. Do not use seed/bootstrap to update a live database.`
    );
  validateCatalogSlugs(CRYPTO_EXCHANGES, SHARE_TRADING_PLATFORMS);
  await seedCryptoAssets(prisma);
  await seedCryptoExchanges(prisma);
  await seedShareTradingPlatforms(prisma);
  await seedAffiliateEngagements(prisma);
  console.log(
    "Initial production reference-data bootstrap complete. Do not rerun after production data exists."
  );
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
