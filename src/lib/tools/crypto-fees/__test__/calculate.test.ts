import { describe, expect, it } from "vitest";
import { calculateCryptoFee } from "../calculate";
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
};

describe("calculateCryptoFee", () => {
  it("calculates a verified percentage fee", () =>
    expect(calculateCryptoFee(base, 500).amount).toBe(5));
  it("rounds monetary output to cents", () =>
    expect(
      calculateCryptoFee({ ...base, percentage: 0.1 }, 1000.01).amount
    ).toBe(1));
  it("does not turn tiered pricing into a guessed fee", () =>
    expect(
      calculateCryptoFee({ ...base, calculationBasis: "TIERED" }, 500).status
    ).toBe("TIERED_NEEDS_INPUT"));
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
