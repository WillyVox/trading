import {
  FeeCalculationBasis,
  FeeCategory,
  OfferingFeatureType,
  OfferingProsConsType,
  OfferingType,
  VerificationStatus,
} from "@prisma/client";
import { ETORO_AU_PROVIDER } from "../providers/etoro";

const CHECKED = new Date("2026-09-22");
const REVIEW_DUE = new Date("2026-11-06");
const FEES = "https://www.etoro.com/au/trading/fees/";
const MARKETS = "https://www.etoro.com/au/trading/markets/";
const CRYPTO = "https://www.etoro.com/au/crypto/";
const WALLET = "https://www.etoro.com/au/crypto/wallet/";
const WALLET_FEES = "https://www.etoro.com/au/crypto/wallet/fees/";

export const EtoroCrypto = {
  provider: ETORO_AU_PROVIDER,
  offering: {
    name: "eToro Crypto",
    slug: "etoro-crypto",
    website: CRYPTO,
    description:
      "eToro's Australian non-leveraged cryptoasset investing service. Leveraged crypto positions and some other positions may be CFDs and are outside this spot-crypto comparison offering.",
    offeringType: OfferingType.CRYPTO_EXCHANGE,
    jurisdiction: "AU",
    verificationStatus: VerificationStatus.VERIFIED,
    lastVerifiedAt: CHECKED,
    assetSymbols: ["BTC", "ETH", "SOL", "XRP"],
    fees: [
      {
        feeCategory: FeeCategory.CRYPTO_TRADING,
        label: "Crypto position opening fee",
        calculationBasis: FeeCalculationBasis.PERCENTAGE,
        percentage: 1,
        displayValue: "1% when opening a crypto position",
        notes:
          "This row models the opening transaction only. eToro also charges 1% when closing a crypto position, based on the closing transaction value; Trading Guide does not add a hypothetical future closing fee to today's buy amount.",
        sourceUrl: FEES,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
      {
        feeCategory: FeeCategory.CRYPTO_TRADING,
        label: "Crypto position closing fee",
        calculationBasis: FeeCalculationBasis.PERCENTAGE,
        percentage: 1,
        displayValue: "1% when closing a crypto position",
        notes:
          "Calculated on the value when the position is closed. Kept as a separate row so a current buy calculator does not imply a fixed round-trip cost.",
        sourceUrl: FEES,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
      {
        feeCategory: FeeCategory.CRYPTO_WITHDRAWAL,
        label: "Transfer from eToro investment platform to eToro Crypto Wallet",
        calculationBasis: FeeCalculationBasis.PERCENTAGE,
        percentage: 2,
        displayValue: "2%, subject to published minimum/maximum limits",
        notes:
          "This is specifically the transfer from the eToro investment platform to the eToro Crypto Wallet. External blockchain transfers are a separate stage and can incur network fees. The published minimum/maximum transfer-fee caps are not modelled by the current percentage-only rule.",
        sourceUrl: WALLET_FEES,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
      {
        feeCategory: FeeCategory.CRYPTO_WITHDRAWAL,
        label: "External crypto send/receive network fee",
        calculationBasis: FeeCalculationBasis.VARIES,
        displayValue: "Blockchain/network fee varies",
        notes:
          "eToro states it does not charge an additional fee for transfers from or to an external source; the blockchain fee is determined by the network.",
        sourceUrl: WALLET_FEES,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
      {
        feeCategory: FeeCategory.FIAT_DEPOSIT,
        label: "AUD NPP/BECS funding",
        calculationBasis: FeeCalculationBasis.FREE,
        displayValue: "Free",
        notes: "AUD account eligibility criteria apply.",
        sourceUrl: "https://www.etoro.com/au/trading/currency-accounts/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
      {
        feeCategory: FeeCategory.FIAT_WITHDRAWAL,
        label: "AUD account withdrawal",
        calculationBasis: FeeCalculationBasis.FREE,
        displayValue: "Free from AUD account to an external account",
        notes: "USD investment-account withdrawals have different fee treatment and are not represented by this AUD-specific row.",
        sourceUrl: FEES,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
    ],
    features: [
      { featureType: OfferingFeatureType.AUD_DEPOSITS, available: true, sourceUrl: "https://www.etoro.com/au/trading/currency-accounts/", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { featureType: OfferingFeatureType.AUD_WITHDRAWALS, available: true, sourceUrl: "https://www.etoro.com/au/trading/currency-accounts/", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { featureType: OfferingFeatureType.BANK_TRANSFER, available: true, sourceUrl: "https://www.etoro.com/au/trading/currency-accounts/", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { featureType: OfferingFeatureType.MOBILE_APP, available: true, sourceUrl: WALLET, verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { featureType: OfferingFeatureType.WEB_PLATFORM, available: true, sourceUrl: CRYPTO, verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { featureType: OfferingFeatureType.TWO_FACTOR_AUTH, available: true, sourceUrl: WALLET, verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { featureType: OfferingFeatureType.COLD_STORAGE, available: true, sourceUrl: CRYPTO, verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { featureType: OfferingFeatureType.STAKING, available: true, sourceUrl: CRYPTO, verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { featureType: OfferingFeatureType.COPY_TRADING, available: true, sourceUrl: "https://www.etoro.com/au/copytrader/", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
    ],
    prosCons: [
      { type: OfferingProsConsType.PRO, label: "AUD account funding and withdrawals are available for eligible Australian users", sourceUrl: "https://www.etoro.com/au/trading/currency-accounts/", jurisdiction: "AU", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { type: OfferingProsConsType.PRO, label: "Supported crypto can be transferred to the eToro Crypto Wallet", sourceUrl: WALLET, jurisdiction: "AU", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { type: OfferingProsConsType.LIMITATION, label: "A 1% fee applies when opening and another 1% applies when closing a crypto position", sourceUrl: FEES, jurisdiction: "AU", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { type: OfferingProsConsType.LIMITATION, label: "Platform-to-eToro-Wallet crypto transfers carry a 2% fee subject to published limits", sourceUrl: WALLET_FEES, jurisdiction: "AU", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { type: OfferingProsConsType.LIMITATION, label: "eToro states non-leveraged cryptoasset trading is unregulated in Australia", detail: "Consumer protections that apply to regulated financial services/products do not apply to non-leveraged cryptoassets in the same way. Leveraged crypto positions are CFDs with different regulatory treatment.", sourceUrl: MARKETS, jurisdiction: "AU", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
    ],
  },
};
