import { test } from "node:test";
import assert from "node:assert/strict";
import {
  pickConcept,
  buildFeaturedImageSvg,
  buildBrandOgImage,
} from "../featured-image-svg";

test("pickConcept prefers searchIntent over articleType", () => {
  assert.equal(
    pickConcept({ searchIntent: "HOW_TO", articleType: "NEWS" }),
    "steps"
  );
  assert.equal(pickConcept({ searchIntent: "COMPARISON" }), "compare");
  assert.equal(pickConcept({ searchIntent: "FEES" }), "fees");
  assert.equal(pickConcept({ searchIntent: "SECURITY" }), "security");
  assert.equal(pickConcept({ searchIntent: "WALLET" }), "security");
  assert.equal(pickConcept({ searchIntent: "REGULATION" }), "verify");
  assert.equal(pickConcept({ searchIntent: "LEARN" }), "learn");
  assert.equal(pickConcept({ searchIntent: "MARKET_EDUCATION" }), "learn");
});

test("pickConcept falls back to articleType when searchIntent is absent", () => {
  assert.equal(pickConcept({ articleType: "NEWS" }), "news");
  assert.equal(pickConcept({ articleType: "GUIDE" }), "steps");
});

test("pickConcept defaults to steps when neither field is set", () => {
  assert.equal(pickConcept({}), "steps");
});

test("buildFeaturedImageSvg produces a well-formed, sized SVG", () => {
  const svg = buildFeaturedImageSvg({ searchIntent: "COMPARISON" });
  assert.match(
    svg,
    /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="1200" height="630"/
  );
  assert.match(svg, /<\/svg>$/);
});

test("buildFeaturedImageSvg adds a coin badge only for a recognized crypto asset", () => {
  const withBitcoin = buildFeaturedImageSvg({
    searchIntent: "HOW_TO",
    cryptoAssetSlugs: ["bitcoin"],
  });
  assert.match(withBitcoin, />B<\/text>/);

  const withUnknownAsset = buildFeaturedImageSvg({
    searchIntent: "HOW_TO",
    cryptoAssetSlugs: ["some-new-token"],
  });
  assert.doesNotMatch(withUnknownAsset, /cx="1040" cy="150"/);

  const withNoAsset = buildFeaturedImageSvg({ searchIntent: "HOW_TO" });
  assert.doesNotMatch(withNoAsset, /cx="1040" cy="150"/);
});

test("buildFeaturedImageSvg never embeds a currency glyph, only A-Z monograms", () => {
  const svg = buildFeaturedImageSvg({
    searchIntent: "HOW_TO",
    cryptoAssetSlugs: ["ethereum"],
  });
  assert.doesNotMatch(svg, /[\u20BF\u039E]/); // no ₿ (U+20BF) or Ξ (U+039E)
  assert.match(svg, />E<\/text>/);
});
test("buildBrandOgImage produces a well-formed SVG with no topic motif", () => {
  const svg = buildBrandOgImage();
  assert.match(
    svg,
    /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="1200" height="630"/
  );
  assert.match(svg, /Trading Guide/);
  assert.match(svg, /<\/svg>$/);
});
