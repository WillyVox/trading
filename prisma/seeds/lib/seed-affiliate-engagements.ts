import {
  AffiliateEngagementStatus,
  AffiliatePartnerStatus,
  CommissionType,
  PrismaClient,
} from "@prisma/client";
import { affiliateEngagementSeeds } from "../affiliate-engagements";
import { isLivePartnershipStatus } from "@/lib/affiliates/status";

export async function seedAffiliateEngagements(prisma: PrismaClient) {
  for (const seed of affiliateEngagementSeeds) {
    if (
      seed.engagementStatus === "ACTIVE" &&
      !isLivePartnershipStatus(seed.partnershipStatus)
    )
      throw new Error(
        `Affiliate engagement for "${seed.offeringSlug}" cannot be ACTIVE while partnership is ${seed.partnershipStatus}.`
      );
    const provider = await prisma.provider.findUnique({
      where: { slug: seed.providerSlug },
    });
    if (!provider)
      throw new Error(
        `Affiliate engagement provider "${seed.providerSlug}" does not exist.`
      );
    const offering = await prisma.providerOffering.findUnique({
      where: { slug: seed.offeringSlug },
    });
    if (!offering || offering.providerId !== provider.id)
      throw new Error(
        `Affiliate engagement offering "${seed.offeringSlug}" must belong to provider "${seed.providerSlug}".`
      );
    let partnership = await prisma.affiliatePartnership.findFirst({
      where: { providerId: provider.id },
      orderBy: { createdAt: "desc" },
    });
    if (!partnership)
      partnership = await prisma.affiliatePartnership.create({
        data: {
          providerId: provider.id,
          status: seed.partnershipStatus as AffiliatePartnerStatus,
        },
      });
    const existing = await prisma.affiliateEngagement.findFirst({
      where: { partnershipId: partnership.id, offeringId: offering.id },
    });
    const data = {
      status: seed.engagementStatus as AffiliateEngagementStatus,
      destinationUrl: seed.destinationUrl,
      commissionType: seed.commissionType as CommissionType,
      campaignReference: seed.campaignReference,
      notes: seed.notes,
    };
    if (existing)
      await prisma.affiliateEngagement.update({
        where: { id: existing.id },
        data,
      });
    else
      await prisma.affiliateEngagement.create({
        data: {
          partnershipId: partnership.id,
          offeringId: offering.id,
          ...data,
        },
      });
    console.log(
      `Seeded affiliate engagement for ${provider.name} -> ${offering.slug}`
    );
  }
}
