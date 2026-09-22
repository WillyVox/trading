import assert from "node:assert/strict";
import test from "node:test";
import {
  CURATED_COMPARISONS,
  getCuratedComparison,
} from "../curated-comparisons";
import { canonicalCompareSlugMulti } from "../canonical";

test("curated comparison slugs are canonical and unique", () => {
  const keys = new Set<string>();
  for (const item of CURATED_COMPARISONS) {
    assert.equal(item.slug, canonicalCompareSlugMulti(item.slugs));
    const key = `${item.domain}:${item.slug}`;
    assert.equal(keys.has(key), false);
    keys.add(key);
  }
});

test("only explicitly curated comparisons resolve as indexable content", () => {
  assert.ok(getCuratedComparison("trading-platforms", "commsec-vs-stake"));
  assert.equal(
    getCuratedComparison("trading-platforms", "commsec-vs-etoro"),
    undefined
  );
});

test("curated entries carry substantive editorial metadata", () => {
  for (const item of CURATED_COMPARISONS) {
    assert.ok(item.title.length > 20);
    assert.ok(item.description.length > 50);
    assert.ok(item.intro.length > 80);
    assert.ok(item.focus.length >= 4);
  }
});
