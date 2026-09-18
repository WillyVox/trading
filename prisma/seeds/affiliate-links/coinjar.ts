/**
 * https://www.coinjar.com/au/affiliates
 *
 */

import { AffiliatePartnerStatus, CommissionType } from "@prisma/client";
export const CoinJarLinks = {
  providerSlug: "coinjar",
  partnerSlug: "coinjar",
  approvedUrl: "https://www.coinjar.com/au",
  placement: "PROVIDER_PROFILE",
  campaign: "default",
  commissionType: CommissionType.REVSHARE, // CoinJar splits 50% of trading fees
  partnershipStatus: AffiliatePartnerStatus.PROSPECT,
  notes:
    "Placeholder affiliate configuration. Official program runs via Impact.com. Replace approvedUrl and activate only after an official affiliate agreement is approved.",
  active: true, // [TODO] WHEN REAL PARTNER, this should be false as default, only paid/sponsored partners must be true
};
