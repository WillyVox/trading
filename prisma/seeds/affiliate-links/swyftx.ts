import { AffiliatePartnerStatus, CommissionType } from "@prisma/client";

export const SwyftxLinks = {
  providerSlug: "swyftx",
  partnerSlug: "swyftx",
  approvedUrl: "https://swyftx.com",
  placement: "PROVIDER_PROFILE",
  campaign: "default",
  commissionType: CommissionType.NONE,
  partnershipStatus: AffiliatePartnerStatus.PROSPECT,
  notes:
    "Placeholder affiliate configuration. Replace approvedUrl with an approved tracking URL and activate only after an official affiliate agreement is approved.",
  active: false
};