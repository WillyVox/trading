import { AffiliatePartnerStatus, CommissionType } from "@prisma/client";

export const CoinSpotLinks = {
  providerSlug: "coinspot",
  partnerSlug: "coinspot",
  approvedUrl: "https://www.coinspot.com.au",
  placement: "PROVIDER_PROFILE",
  campaign: "default",
  commissionType: CommissionType.NONE,
  partnershipStatus: AffiliatePartnerStatus.PROSPECT,
  notes:
    "Placeholder affiliate configuration. Replace approvedUrl and activate only after an official affiliate agreement is approved.",
  active: false,
};
