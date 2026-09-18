import {
  FeeValueType,
  ProviderFeatureType,
  ProviderFeeType,
  ProviderProsConsType,
  ProviderSourceType,
  ProviderType,
  VerificationStatus,
} from '@prisma/client';

export const Swyftx = {
  name: 'Swyftx',
  slug: 'swyftx',
  website: 'https://swyftx.com',
  logo: '/images/providers/swyftx.svg',
  description:
    'Australian-owned and operated cryptocurrency platform supporting AUD funding, 410+ crypto assets, Auto Invest and tiered trading fees based on rolling 30-day trading volume.',
  providerType: ProviderType.CRYPTO_EXCHANGE,
  jurisdictions: ['AU'],
  verificationStatus: VerificationStatus.VERIFIED,
  lastVerifiedAt: new Date('2026-09-17'),
  assetSymbols: ['BTC', 'ETH', 'SOL', 'XRP'],
  facts: [
    {
      label: 'Headquarters',
      value: 'Milton, Brisbane, Queensland, Australia',
      jurisdiction: 'AU',
      sourceUrl: 'https://swyftx.com/facts/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      label: 'Legal entity',
      value: 'Swyftx Pty Ltd',
      jurisdiction: 'AU',
      sourceUrl: 'https://swyftx.com/facts/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      label: 'ABN',
      value: '72 623 556 730',
      jurisdiction: 'AU',
      sourceUrl: 'https://swyftx.com/facts/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      label: 'AUD Support',
      value: 'Yes',
      jurisdiction: 'AU',
      sourceUrl: 'https://swyftx.com/au/features/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      label: 'Platform Type',
      value: 'Centralised cryptocurrency trading platform',
      jurisdiction: 'AU',
      sourceUrl: 'https://swyftx.com/au/features/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      label: 'Advertised crypto assets',
      value: '410+',
      jurisdiction: 'AU',
      sourceUrl: 'https://swyftx.com/au/features/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
  ],
  fees: [
    {
      feeType: ProviderFeeType.TRADING,
      label: 'Standard trading fee',
      valueType: FeeValueType.TIERED,
      percentage: 0.6,
      displayValue:
        '0.60% below AUD $100,000 rolling 30-day volume, tiered down to 0.10% at AUD $6m+',
      jurisdiction: 'AU',
      sourceUrl:
        'https://support.swyftx.com/en/articles/12005536-our-trading-fees',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      feeType: ProviderFeeType.SPREAD,
      label: 'Trading spread',
      valueType: FeeValueType.VARIABLE,
      displayValue:
        'Variable by asset, liquidity and market conditions; separate from the trading fee',
      jurisdiction: 'AU',
      sourceUrl: 'https://swyftx.com/facts/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
  ],
  features: [
    {
      featureType: ProviderFeatureType.AUD_DEPOSITS,
      available: true,
      sourceUrl: 'https://swyftx.com/au/features/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      featureType: ProviderFeatureType.AUD_WITHDRAWALS,
      available: true,
      sourceUrl: 'https://swyftx.com/au/features/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      featureType: ProviderFeatureType.BANK_TRANSFER,
      available: true,
      sourceUrl: 'https://swyftx.com/au/features/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      featureType: ProviderFeatureType.CARD_DEPOSIT,
      available: true,
      sourceUrl: 'https://swyftx.com/au/features/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      featureType: ProviderFeatureType.MOBILE_APP,
      available: true,
      sourceUrl: 'https://swyftx.com/au/features/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      featureType: ProviderFeatureType.RECURRING_BUYS,
      label: 'Auto Invest',
      available: true,
      sourceUrl: 'https://swyftx.com/au/features/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      featureType: ProviderFeatureType.TWO_FACTOR_AUTH,
      available: true,
      sourceUrl: 'https://swyftx.com/facts/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      featureType: ProviderFeatureType.COLD_STORAGE,
      available: true,
      sourceUrl: 'https://swyftx.com/facts/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
  ],
  prosCons: [
    {
      type: ProviderProsConsType.PRO,
      label:
        'Trading fees decrease from 0.60% to 0.10% as rolling 30-day volume increases',
      sourceUrl:
        'https://support.swyftx.com/en/articles/12005536-our-trading-fees',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      type: ProviderProsConsType.PRO,
      label: 'Provider currently advertises more than 410 crypto assets',
      sourceUrl: 'https://swyftx.com/au/features/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      type: ProviderProsConsType.LIMITATION,
      label:
        'Crypto trades incur a variable spread in addition to the trading fee',
      sourceUrl: 'https://swyftx.com/facts/',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
    {
      type: ProviderProsConsType.LIMITATION,
      label:
        'The 0.10% trading-fee tier requires at least AUD $6 million of rolling 30-day trading volume',
      sourceUrl:
        'https://support.swyftx.com/en/articles/12005536-our-trading-fees',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date('2026-09-17'),
    },
  ],
  sources: [
    {
      label: 'Official website',
      url: 'https://swyftx.com',
      sourceType: ProviderSourceType.OFFICIAL_WEBSITE,
    },
    {
      label: 'Official trading fees',
      url: 'https://support.swyftx.com/en/articles/12005536-our-trading-fees',
      sourceType: ProviderSourceType.OFFICIAL_FEES,
    },
    {
      label: 'Official platform facts',
      url: 'https://swyftx.com/facts/',
      sourceType: ProviderSourceType.OFFICIAL_WEBSITE,
    },
  ],
  regulations: [
    {
      jurisdiction: 'AU',
      regulator: 'AUSTRAC',
      status:
        'Swyftx Pty Ltd is registered as a Digital Currency Exchange Provider',
      sourceUrl: 'https://swyftx.com/facts/',
      verifiedAt: new Date('2026-09-17'),
    },
    {
      jurisdiction: 'AU',
      regulator: 'ASIC',
      status:
        'Swyftx Pty Ltd states it holds AFSL 568543; its disclosure separately states no AFSL for spot crypto, so licence scope must be displayed separately from spot-crypto services',
      sourceUrl: 'https://swyftx.com/facts/',
      verifiedAt: new Date('2026-09-17'),
    },
  ],
};
