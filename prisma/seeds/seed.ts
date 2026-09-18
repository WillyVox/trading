import { PrismaClient } from '@prisma/client';
import { seedOfferings } from './offerings/prisma-client';
import { seedProviders } from './providers/prisma-client';
import { seedCryptoAssets } from './crypto-assets/prisma-client';
import { seedAffiliateLinks } from './affiliate-links/prisma-client';

const prisma = new PrismaClient();

async function main() {
  // ---------------------------------------
  // Crypto assets
  // ---------------------------------------

  seedCryptoAssets();
  console.log('Several cryptos are seeded.');
  // ---------------------------------------
  // Crypto providers
  // ---------------------------------------
  seedProviders();
  console.log(
    'CoinSpot, Independent Reserve, Swyftx and BTC Markets Kraken and CoinJar exchanges are seeded.'
  );

  // ---------------------------------------
  // Share-trading offerings
  // ---------------------------------------

  await seedOfferings();

  console.log('Seeded seedOfferings, share trading providers and offerings');

  // ---------------------------------------
  // Seed affiliate partnerships/programs/links
  // ---------------------------------------

  await seedAffiliateLinks();

  console.log(
    'Seeded affiliateLinks, default are true to all crypto providers....'
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
