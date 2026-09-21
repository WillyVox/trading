import { AffiliatePartnerStatus, CommissionType } from "@prisma/client";

export const BtcMarketsLinks = {
  providerSlug: "btc-markets",
  partnerSlug: "btc-markets",
  approvedUrl: "https://www.btcmarkets.net",
  placement: "PROVIDER_PROFILE",
  campaign: "default",
  commissionType: CommissionType.NONE,
  partnershipStatus: AffiliatePartnerStatus.PROSPECT,
  notes:
    "Placeholder affiliate configuration. Replace approvedUrl with an approved tracking URL and activate only after an official affiliate agreement is approved.",
  active: false, // Confirmed 2026-09-21: only a genuine paid/sponsored, non-PROSPECT partnership should ever set this true.
};
