import assert from "node:assert/strict";
import test from "node:test";
import { custodyFacts, effectiveCustodyStatus } from "../presentation";

test("CHESS facts explain registered holder, HIN and Australian scope", () => {
  const facts = custodyFacts("CHESS_SPONSORED");
  assert.equal(facts[0]?.value, "You / your entity");
  assert.equal(facts[1]?.value, "HIN");
  assert.match(facts[2]?.detail ?? "", /Australian/i);
});

test("custodial facts do not imply a personal HIN", () => {
  const facts = custodyFacts("CUSTODIAL");
  assert.equal(facts[0]?.value, "Custodian / nominee");
  assert.equal(facts[1]?.value, "Usually no");
});

test("verified custody evidence becomes stale after its review date", () => {
  assert.equal(
    effectiveCustodyStatus(
      { verificationStatus: "VERIFIED", reviewDueAt: "2026-09-20T00:00:00.000Z" },
      new Date("2026-09-22T00:00:00.000Z").getTime()
    ),
    "STALE"
  );
});

test("unverified status is never upgraded by review dates", () => {
  assert.equal(
    effectiveCustodyStatus(
      { verificationStatus: "UNVERIFIED", reviewDueAt: "2026-12-01T00:00:00.000Z" },
      new Date("2026-09-22T00:00:00.000Z").getTime()
    ),
    "UNVERIFIED"
  );
});
