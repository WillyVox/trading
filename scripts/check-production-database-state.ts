import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const [
    users,
    articles,
    providers,
    offerings,
    fees,
    affiliateClicks,
    affiliateConversions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.article.count(),
    prisma.provider.count(),
    prisma.providerOffering.count(),
    prisma.offeringFee.count(),
    prisma.affiliateClick.count(),
    prisma.affiliateConversion.count(),
  ]);
  console.log("Trading Guide production database state");
  console.table({
    users,
    articles,
    providers,
    offerings,
    fees,
    affiliateClicks,
    affiliateConversions,
  });
  console.log("\nRead-only inspection complete. No data was modified.");
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
