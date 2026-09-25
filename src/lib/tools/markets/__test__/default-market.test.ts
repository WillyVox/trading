import assert from "node:assert/strict";
import test from "node:test";
import { getDefaultMarketCode } from "../default-market";

test("defaults to ASX when ASX is available even if it is not first", () => {
  assert.equal(getDefaultMarketCode(["NYSE", "NASDAQ", "ASX"]), "ASX");
});

test("keeps ASX as the default when it is already first", () => {
  assert.equal(getDefaultMarketCode(["ASX", "NYSE", "NASDAQ"]), "ASX");
});

test("falls back to the first available market when ASX is unavailable", () => {
  assert.equal(getDefaultMarketCode(["NYSE", "NASDAQ"]), "NYSE");
});

test("returns an empty market when no markets are available", () => {
  assert.equal(getDefaultMarketCode([]), "");
});
