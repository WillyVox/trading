import assert from "node:assert/strict";
import test from "node:test";
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

test("calculates a verified percentage fee", () => {
  assert.equal(calculateCryptoFee(base, 500).amount, 5);
});

test("rounds monetary output to cents", () => {
  assert.equal(
    calculateCryptoFee({ ...base, percentage: 0.1 }, 1000.01).amount,
    1
  );
});

test("selects the highest rolling-volume tier reached", () => {
  const result = calculateCryptoFee(tiered, {
    amount: 1_000,
    rolling30DayVolume: 300_000,
  });
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.percentage, 0.5);
  assert.equal(result.amount, 5);
});

test("uses the lower tier immediately below a threshold", () => {
  const result = calculateCryptoFee(tiered, {
    amount: 1_000,
    rolling30DayVolume: 299_999.99,
  });
  assert.equal(result.percentage, 0.55);
});

test("supports Kraken-style volume OR assets-on-platform qualification", () => {
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

  assert.equal(
    selectCryptoFeeTier(rule, {
      amount: 1_000,
      rolling30DayVolume: 0,
      assetsOnPlatform: 20_000,
    })?.percentage,
    0.22
  );
  assert.equal(
    selectCryptoFeeTier(rule, {
      amount: 1_000,
      rolling30DayVolume: 10_000,
      assetsOnPlatform: 0,
    })?.percentage,
    0.22
  );
});

test("requires qualification input for structured tiered pricing", () => {
  assert.equal(calculateCryptoFee(tiered, 500).status, "TIERED_NEEDS_INPUT");
});

test("does not treat variable fees as zero", () => {
  assert.equal(
    calculateCryptoFee({ ...base, calculationBasis: "VARIES" }, 500).status,
    "VARIABLE"
  );
});

test("blocks stale and unverified records", () => {
  assert.equal(
    calculateCryptoFee({ ...base, verificationStatus: "STALE" }, 500).status,
    "STALE"
  );
  assert.equal(
    calculateCryptoFee({ ...base, verificationStatus: "UNVERIFIED" }, 500)
      .status,
    "UNKNOWN"
  );
});

test("rejects invalid amounts", () => {
  assert.equal(calculateCryptoFee(base, 0).status, "UNSUPPORTED");
});
