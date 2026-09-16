import { AffiliatePartnerStatus, CommissionType } from '@prisma/client';

export const BtcMarketsLinks = {
  providerSlug: 'btc-markets',
  partnerSlug: 'btc-markets',
  approvedUrl: 'https://www.btcmarkets.net',
  placement: 'PROVIDER_PROFILE',
  campaign: 'default',
  commissionType: CommissionType.NONE,
  partnershipStatus: AffiliatePartnerStatus.PROSPECT,
  notes:
    'Placeholder affiliate configuration. Replace approvedUrl with an approved tracking URL and activate only after an official affiliate agreement is approved.',
  active: true, // [TODO] WHEN REAL PARTNER, this should be false as default, only paid/sponsored partners must be true
};
