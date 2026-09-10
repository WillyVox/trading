import { PrismaClient, VerificationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const providers = [
    {
      name: "Placeholder Exchange A (AU)",
      slug: "placeholder-exchange-a",
      description: "Clearly-labeled placeholder provider — replace with real, sourced Australian data before launch.",
      providerType: "EXCHANGE",
      jurisdictions: ["AU"],
      supportedAssets: ["BTC", "ETH"],
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
    {
      name: "Placeholder Exchange B (AU)",
      slug: "placeholder-exchange-b",
      description: "Clearly-labeled placeholder provider — replace with real, sourced Australian data before launch.",
      providerType: "EXCHANGE",
      jurisdictions: ["AU"],
      supportedAssets: ["BTC", "ETH", "SOL"],
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
  ];

  for (const p of providers) {
    await prisma.provider.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log("Seeded placeholder providers. Do not publish as real data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
