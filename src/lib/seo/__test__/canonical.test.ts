import assert from "node:assert/strict";
import test from "node:test";
import { canonicalCompareSlugMulti, parseCompareSlugs } from "../canonical";

test("canonical comparison slugs are deterministic", () => {
  assert.equal(
    canonicalCompareSlugMulti(["stake", "commsec"]),
    "commsec-vs-stake"
  );
  assert.equal(
    canonicalCompareSlugMulti(["commsec", "stake"]),
    "commsec-vs-stake"
  );
});

test("comparison parser preserves hyphens inside provider slugs", () => {
  assert.deepEqual(parseCompareSlugs("btc-markets-vs-etoro"), [
    "btc-markets",
    "etoro",
  ]);
});

test("comparison parser removes duplicate selections", () => {
  assert.deepEqual(parseCompareSlugs("stake-vs-stake"), ["stake"]);
});
