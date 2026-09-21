import { describe, expect, it } from "vitest";
import { calculateCryptoFee, selectCryptoFeeTier } from "../calculate";
import type { CryptoFeeRule } from "../types";

const base: CryptoFeeRule = {
  feeId: "1",
  offeringSlug: "x",
  offeringName: "X",
  providerName: "X",
  category: "INSTANT_BUY",
  label: "fee",
  calculationBasis: "PERCENTAGE",
  flatAmount: null,
  percentage: 1,
  currency: "AUD",
  displayValue: "1%",
  notes: null,
  sourceUrl: "https://example.com/fees",
  verificationStatus: "VERIFIED",
  verifiedAt: "2026-09-22T00:00:00.000Z",
  reviewDueAt: null,
  tierVolumeCurrency: null,
  tierAssetsCurrency: null,
  tiers: [],
};

const tiered: CryptoFeeRule = {
  ...base,
  calculationBasis: "TIERED",
  percentage: 0.6,
  tierVolumeCurrency: "AUD",
  tiers: [
    {
      position: 0,
      percentage: 0.6,
      flatAmount: null,
      minRolling30DayVolume: 0,
      minAssetsOnPlatform: null,
    },
    {
      position: 1,
      percentage: 0.55,
      flatAmount: null,
      minRolling30DayVolume: 100_000,
      minAssetsOnPlatform: null,
    },
    {
      position: 2,
      percentage: 0.5,
      flatAmount: null,
      minRolling30DayVolume: 300_000,
      minAssetsOnPlatform: null,
    },
  ],
};

describe("calculateCryptoFee", () => {
  it("calculates a verified percentage fee", () =>
    expect(calculateCryptoFee(base, 500).amount).toBe(5));

  it("rounds monetary output to cents", () =>
    expect(
      calculateCryptoFee({ ...base, percentage: 0.1 }, 1000.01).amount
    ).toBe(1));

  it("selects the highest rolling-volume tier reached", () => {
    const result = calculateCryptoFee(tiered, {
      amount: 1_000,
      rolling30DayVolume: 300_000,
    });
    expect(result.status).toBe("CALCULATED");
    expect(result.percentage).toBe(0.5);
    expect(result.amount).toBe(5);
  });

  it("uses the lower tier immediately below a threshold", () => {
    const result = calculateCryptoFee(tiered, {
      amount: 1_000,
      rolling30DayVolume: 299_999.99,
    });
    expect(result.percentage).toBe(0.55);
  });

  it("supports Kraken-style volume OR assets-on-platform qualification", () => {
    const rule: CryptoFeeRule = {
      ...tiered,
      tierVolumeCurrency: "USD",
      tierAssetsCurrency: "USD",
      tiers: [
        {
          position: 0,
          percentage: 0.4,
          flatAmount: null,
          minRolling30DayVolume: 0,
          minAssetsOnPlatform: null,
        },
        {
          position: 1,
          percentage: 0.22,
          flatAmount: null,
          minRolling30DayVolume: 10_000,
          minAssetsOnPlatform: 20_000,
        },
      ],
    };
    expect(
      selectCryptoFeeTier(rule, {
        amount: 1_000,
        rolling30DayVolume: 0,
        assetsOnPlatform: 20_000,
      })?.percentage
    ).toBe(0.22);
    expect(
      selectCryptoFeeTier(rule, {
        amount: 1_000,
        rolling30DayVolume: 10_000,
        assetsOnPlatform: 0,
      })?.percentage
    ).toBe(0.22);
  });

  it("requires qualification input for structured tiered pricing", () =>
    expect(calculateCryptoFee(tiered, 500).status).toBe("TIERED_NEEDS_INPUT"));

  it("does not treat variable fees as zero", () =>
    expect(
      calculateCryptoFee({ ...base, calculationBasis: "VARIES" }, 500).status
    ).toBe("VARIABLE"));

  it("blocks stale and unverified records", () => {
    expect(
      calculateCryptoFee({ ...base, verificationStatus: "STALE" }, 500).status
    ).toBe("STALE");
    expect(
      calculateCryptoFee({ ...base, verificationStatus: "UNVERIFIED" }, 500)
        .status
    ).toBe("UNKNOWN");
  });

  it("rejects invalid amounts", () =>
    expect(calculateCryptoFee(base, 0).status).toBe("UNSUPPORTED"));
});
