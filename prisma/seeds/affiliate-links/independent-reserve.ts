import { AffiliatePartnerStatus, CommissionType } from '@prisma/client';

export const IndependentReserveLinks = {
  providerSlug: 'independent-reserve',
  partnerSlug: 'independent-reserve',
  approvedUrl: 'https://www.independentreserve.com',
  placement: 'PROVIDER_PROFILE',
  campaign: 'default',
  commissionType: CommissionType.NONE,
  partnershipStatus: AffiliatePartnerStatus.PROSPECT,
  notes:
    'Placeholder affiliate configuration. Replace approvedUrl and activate only after an official affiliate agreement is approved.',
  active: true, // [TODO] WHEN REAL PARTNER, this should be false as default, only paid/sponsored partners must be true
};
