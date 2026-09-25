import { PrismaClient } from "@prisma/client";
import { CRYPTO_EXCHANGES } from "./crypto-exchanges";
import { SHARE_TRADING_PLATFORMS } from "./share-trading-platforms";
import { seedAffiliateEngagements } from "./lib/seed-affiliate-engagements";
import { seedCryptoAssets } from "./lib/seed-crypto-assets";
import { seedCryptoExchanges } from "./lib/seed-crypto-exchanges";
import { seedShareTradingPlatforms } from "./lib/seed-share-trading-platforms";
import { validateCatalogSlugs } from "./lib/validation";

const prisma = new PrismaClient();

async function main() {
  validateCatalogSlugs(CRYPTO_EXCHANGES, SHARE_TRADING_PLATFORMS);
  await seedCryptoAssets(prisma);
  await seedCryptoExchanges(prisma);
  await seedShareTradingPlatforms(prisma);
  await seedAffiliateEngagements(prisma);
  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
