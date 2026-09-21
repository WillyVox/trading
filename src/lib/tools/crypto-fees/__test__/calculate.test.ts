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
  const result = calculateCryptoFee(base, 500);

  assert.equal(result.status, "CALCULATED");
  assert.equal(result.amount, 5);
});

test("rounds monetary output to cents", () => {
  const result = calculateCryptoFee(
    {
      ...base,
      percentage: 0.1,
    },
    1000.01
  );

  assert.equal(result.status, "CALCULATED");
  assert.equal(result.amount, 1);
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

  assert.equal(result.status, "CALCULATED");
  assert.equal(result.percentage, 0.55);
  assert.equal(result.amount, 5.5);
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

  const qualifiedByAssets = selectCryptoFeeTier(rule, {
    amount: 1_000,
    rolling30DayVolume: 0,
    assetsOnPlatform: 20_000,
  });

  assert.ok(qualifiedByAssets);
  assert.equal(qualifiedByAssets.percentage, 0.22);

  const qualifiedByVolume = selectCryptoFeeTier(rule, {
    amount: 1_000,
    rolling30DayVolume: 10_000,
    assetsOnPlatform: 0,
  });

  assert.ok(qualifiedByVolume);
  assert.equal(qualifiedByVolume.percentage, 0.22);
});

test("requires qualification input for structured tiered pricing", () => {
  const result = calculateCryptoFee(tiered, 500);

  assert.equal(result.status, "TIERED_NEEDS_INPUT");
});

test("does not treat variable fees as zero", () => {
  const result = calculateCryptoFee(
    {
      ...base,
      calculationBasis: "VARIES",
    },
    500
  );

  assert.equal(result.status, "VARIABLE");
  assert.equal(result.amount, undefined);
});

test("blocks stale records", () => {
  const result = calculateCryptoFee(
    {
      ...base,
      verificationStatus: "STALE",
    },
    500
  );

  assert.equal(result.status, "STALE");
  assert.equal(result.amount, undefined);
});

test("blocks unverified records", () => {
  const result = calculateCryptoFee(
    {
      ...base,
      verificationStatus: "UNVERIFIED",
    },
    500
  );

  assert.equal(result.status, "UNKNOWN");
  assert.equal(result.amount, undefined);
});

test("rejects zero amounts", () => {
  const result = calculateCryptoFee(base, 0);

  assert.equal(result.status, "UNSUPPORTED");
});

test("rejects negative amounts", () => {
  const result = calculateCryptoFee(base, -1);

  assert.equal(result.status, "UNSUPPORTED");
});

test("rejects non-finite amounts", () => {
  const result = calculateCryptoFee(base, Number.POSITIVE_INFINITY);

  assert.equal(result.status, "UNSUPPORTED");
});

test("selects the entry tier at zero rolling volume", () => {
  const selected = selectCryptoFeeTier(tiered, {
    amount: 1_000,
    rolling30DayVolume: 0,
  });

  assert.ok(selected);
  assert.equal(selected.position, 0);
  assert.equal(selected.percentage, 0.6);
});

test("selects the exact tier at a rolling-volume threshold", () => {
  const selected = selectCryptoFeeTier(tiered, {
    amount: 1_000,
    rolling30DayVolume: 100_000,
  });

  assert.ok(selected);
  assert.equal(selected.position, 1);
  assert.equal(selected.percentage, 0.55);
});

test("selects the lower tier one cent below a rolling-volume threshold", () => {
  const selected = selectCryptoFeeTier(tiered, {
    amount: 1_000,
    rolling30DayVolume: 99_999.99,
  });

  assert.ok(selected);
  assert.equal(selected.position, 0);
  assert.equal(selected.percentage, 0.6);
});

test("selects the highest tier above the highest configured threshold", () => {
  const selected = selectCryptoFeeTier(tiered, {
    amount: 1_000,
    rolling30DayVolume: 1_000_000,
  });

  assert.ok(selected);
  assert.equal(selected.position, 2);
  assert.equal(selected.percentage, 0.5);
});
