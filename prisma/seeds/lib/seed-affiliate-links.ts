import { PrismaClient } from "@prisma/client";
import { affiliateSeeds } from "../affiliate-links";
import { isLivePartnershipStatus } from "@/lib/affiliates/status";

export async function seedAffiliateLinks(prisma: PrismaClient) {
  for (const seed of affiliateSeeds) {
    // A link seeded active: true against a non-live partnership (e.g. a
    // PROSPECT/placeholder, as BTC Markets briefly was) would make the
    // disclosure pages' "no active commercial relationship" claims false the
    // moment the seed runs -- fail loudly instead of writing it silently.
    if (seed.active && !isLivePartnershipStatus(seed.partnershipStatus)) {
      throw new Error(
        `Affiliate seed for "${seed.partnerSlug}" sets active: true but ` +
          `partnershipStatus is ${seed.partnershipStatus}, not an approved/live ` +
          `agreement. Set active: false until a real partnership is in place, ` +
          `or correct the status if the agreement is genuinely live.`
      );
    }
    const provider = await prisma.provider.findUnique({
      where: {
        slug: seed.providerSlug,
      },
    });

    if (!provider) {
      console.warn(
        `Affiliate seed skipped: provider "${seed.providerSlug}" does not exist.`
      );
      continue;
    }

    // Find an existing partnership for this provider.
    let partnership = await prisma.affiliatePartnership.findFirst({
      where: {
        providerId: provider.id,
      },
      include: {
        programs: true,
      },
    });

    // Create one if the provider does not have a partnership yet.
    if (!partnership) {
      partnership = await prisma.affiliatePartnership.create({
        data: {
          providerId: provider.id,
          status: seed.partnershipStatus,
        },
        include: {
          programs: true,
        },
      });
    }

    // For the seed, reuse the first existing program if one exists.
    // Otherwise create a default program.
    let program = partnership.programs[0];

    if (!program) {
      program = await prisma.affiliateProgram.create({
        data: {
          partnershipId: partnership.id,
          commissionType: seed.commissionType,
          notes: seed.notes,
        },
      });
    }

    await prisma.affiliateLink.upsert({
      where: {
        partnerSlug: seed.partnerSlug,
      },
      update: {
        programId: program.id,
        approvedUrl: seed.approvedUrl,
        placement: seed.placement,
        campaign: seed.campaign,
        active: seed.active,
      },
      create: {
        programId: program.id,
        partnerSlug: seed.partnerSlug,
        approvedUrl: seed.approvedUrl,
        placement: seed.placement,
        campaign: seed.campaign,
        active: seed.active,
      },
    });

    console.log(
      `Seeded affiliate link for ${provider.name} (${seed.partnerSlug})`
    );
  }
}
