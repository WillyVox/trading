import { test } from "node:test";
import assert from "node:assert/strict";
import { parseArticleFile } from "../parser";

const FRONTMATTER_HEADER = (body: string) => `---\n${body}\n---\n\nSome content.`;

test("maps providerRelationships (providerSlug) onto the payload", () => {
  const result = parseArticleFile(
    FRONTMATTER_HEADER(
      [
        'title: "Title"',
        'slug: "title"',
        "providerRelationships:",
        "  - kraken",
        "  - providerSlug: binance",
        "    relationship: COMPARED",
      ].join("\n")
    )
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.payload.providerRelationships, [
    { providerSlug: "kraken", relationship: "MENTIONED" },
    { providerSlug: "binance", relationship: "COMPARED" },
  ]);
});

test("merges the deprecated relatedProviders alias into providerRelationships", () => {
  const result = parseArticleFile(
    FRONTMATTER_HEADER(['title: "Title"', 'slug: "title"', "relatedProviders:", "  - kraken"].join("\n"))
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.payload.providerRelationships, [{ providerSlug: "kraken", relationship: "MENTIONED" }]);
  assert.ok(result.warnings.some((w) => w.includes("providerRelationships")));
});

test("providerRelationships wins over relatedProviders on a slug collision", () => {
  const result = parseArticleFile(
    FRONTMATTER_HEADER(
      [
        'title: "Title"',
        'slug: "title"',
        "relatedProviders:",
        "  - slug: kraken",
        "    relationship: MENTIONED",
        "providerRelationships:",
        "  - providerSlug: kraken",
        "    relationship: FEATURED",
      ].join("\n")
    )
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.payload.providerRelationships, [{ providerSlug: "kraken", relationship: "FEATURED" }]);
});

test("maps sources[].sourceType onto the payload", () => {
  const result = parseArticleFile(
    FRONTMATTER_HEADER(
      [
        'title: "Title"',
        'slug: "title"',
        "sources:",
        '  - label: "AUSTRAC"',
        '    url: "https://austrac.gov.au"',
        "    sourceType: REGULATOR",
      ].join("\n")
    )
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.payload.sources, [
    { label: "AUSTRAC", url: "https://austrac.gov.au", sourceType: "REGULATOR" },
  ]);
});

test("maps the deprecated sources[].type alias onto sourceType", () => {
  const result = parseArticleFile(
    FRONTMATTER_HEADER(
      [
        'title: "Title"',
        'slug: "title"',
        "sources:",
        '  - label: "AUSTRAC"',
        '    url: "https://austrac.gov.au"',
        "    type: REGULATOR",
      ].join("\n")
    )
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.payload.sources, [
    { label: "AUSTRAC", url: "https://austrac.gov.au", sourceType: "REGULATOR" },
  ]);
});

test("passes through cryptoAssetSlugs, featuredImageAlt, affiliateDisclosureRequired, scheduledAt, lastReviewedAt", () => {
  const result = parseArticleFile(
    FRONTMATTER_HEADER(
      [
        'title: "Title"',
        'slug: "title"',
        "cryptoAssetSlugs:",
        "  - bitcoin",
        'featuredImageAlt: "A description"',
        "affiliateDisclosureRequired: true",
        'scheduledAt: "2026-09-20"',
        'lastReviewedAt: "2026-09-12"',
      ].join("\n")
    )
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.payload.cryptoAssetSlugs, ["bitcoin"]);
  assert.equal(result.payload.featuredImageAlt, "A description");
  assert.equal(result.payload.affiliateDisclosureRequired, true);
  assert.equal(result.payload.scheduledAt, "2026-09-20");
  assert.equal(result.payload.lastReviewedAt, "2026-09-12");
});
