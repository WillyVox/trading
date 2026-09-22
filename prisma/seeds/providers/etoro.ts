import { ProviderSourceType, VerificationStatus } from "@prisma/client";

const CHECKED = new Date("2026-09-22");

/**
 * Shared Australian provider identity for both eToro offerings.
 * Product-specific facts belong on ProviderOffering children; this object is
 * intentionally limited to legal/entity-level facts that are true for both.
 */
export const ETORO_AU_PROVIDER_BASE = {
  name: "eToro AUS Capital Limited",
  slug: "etoro-australia",
  website: "https://www.etoro.com/au/",
  description:
    "Australian eToro entity providing access to a multi-asset investment platform. Regulated financial products and non-leveraged cryptoassets have different regulatory treatment in Australia.",
  jurisdictions: ["AU"],
  verificationStatus: VerificationStatus.VERIFIED,
  lastVerifiedAt: CHECKED,
};

export const ETORO_AU_PROVIDER = {
  ...ETORO_AU_PROVIDER_BASE,
  facts: [
    {
      label: "Australian operating entity",
      value: "eToro AUS Capital Limited (ACN 612 791 803)",
      jurisdiction: "AU",
      sourceUrl: "https://www.etoro.com/au/trading/markets/",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: CHECKED,
    },
    {
      label: "Australian Financial Services Licence",
      value: "AFSL 491139",
      jurisdiction: "AU",
      sourceUrl: "https://www.etoro.com/au/trading/markets/",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: CHECKED,
    },
  ],
  sources: [
    {
      label: "eToro Australia",
      url: "https://www.etoro.com/au/",
      sourceType: ProviderSourceType.OFFICIAL_WEBSITE,
      jurisdiction: "AU",
      checkedAt: CHECKED,
      verificationStatus: VerificationStatus.VERIFIED,
    },
    {
      label: "eToro Australia fees",
      url: "https://www.etoro.com/au/trading/fees/",
      sourceType: ProviderSourceType.OFFICIAL_FEES,
      jurisdiction: "AU",
      checkedAt: CHECKED,
      verificationStatus: VerificationStatus.VERIFIED,
    },
    {
      label: "eToro Australia markets and regulatory disclosure",
      url: "https://www.etoro.com/au/trading/markets/",
      sourceType: ProviderSourceType.OFFICIAL_WEBSITE,
      jurisdiction: "AU",
      checkedAt: CHECKED,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  ],
  regulations: [
    {
      jurisdiction: "AU",
      regulator: "ASIC",
      registrationId: "AFSL 491139",
      status:
        "eToro AUS Capital Limited is authorised to provide financial services under AFSL 491139. This must not be presented as ASIC regulation of non-leveraged spot cryptoasset trading.",
      sourceUrl: "https://www.etoro.com/au/trading/markets/",
      verifiedAt: CHECKED,
    },
  ],
};
