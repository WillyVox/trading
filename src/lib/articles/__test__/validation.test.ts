import { test } from "node:test";
import assert from "node:assert/strict";
import { validateArticleForm } from "../validation";

function minimalValid(overrides: Record<string, unknown> = {}) {
  return {
    title: "How to Buy Bitcoin",
    slug: "how-to-buy-bitcoin",
    articleType: "GUIDE",
    content: "<p>Some content.</p>",
    ...overrides,
  };
}

test("accepts a minimal valid submission", () => {
  const result = validateArticleForm(minimalValid());
  assert.equal(result.ok, true);
  assert.equal(result.data?.slug, "how-to-buy-bitcoin");
});

test("rejects a missing title", () => {
  const result = validateArticleForm(minimalValid({ title: "" }));
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes("title")));
});

test("rejects a missing articleType", () => {
  const result = validateArticleForm(minimalValid({ articleType: undefined }));
  assert.equal(result.ok, false);
});

test("rejects an unknown articleType", () => {
  const result = validateArticleForm(minimalValid({ articleType: "COMPARISON" }));
  assert.equal(result.ok, false);
});

test("rejects empty content", () => {
  const result = validateArticleForm(minimalValid({ content: "   " }));
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes("content") || e.includes("Content")));
});

const invalidSlugs = ["How To Buy Bitcoin!!!", "/crypto/guides/x", "double--hyphen", "-leading", "trailing-"];
for (const slug of invalidSlugs) {
  test(`rejects malformed slug: ${slug}`, () => {
    const result = validateArticleForm(minimalValid({ slug }));
    assert.equal(result.ok, false);
  });
}

test("rejects an invalid canonicalUrl", () => {
  const result = validateArticleForm(minimalValid({ canonicalUrl: "not-a-url" }));
  assert.equal(result.ok, false);
});

test("rejects a malformed provider relationship", () => {
  const result = validateArticleForm(
    minimalValid({ providerRelationships: [{ providerId: "", relationship: "MENTIONED" }] })
  );
  assert.equal(result.ok, false);
});

test("rejects an unknown provider relationship type", () => {
  const result = validateArticleForm(
    minimalValid({ providerRelationships: [{ providerId: "prov_1", relationship: "SPONSORED" }] })
  );
  assert.equal(result.ok, false);
});

test("rejects a source with an invalid URL", () => {
  const result = validateArticleForm(minimalValid({ sources: [{ label: "Source", url: "ftp://bad" }] }));
  assert.equal(result.ok, false);
});

test("accepts a fully populated submission", () => {
  const result = validateArticleForm(
    minimalValid({
      category: "exchanges",
      excerpt: "A short excerpt.",
      author: "Jane Editor",
      keyTakeaways: ["Takeaway one", "Takeaway two"],
      tags: ["bitcoin", "beginner"],
      searchIntent: "BEGINNER",
      seoTitle: "How to Buy Bitcoin in Australia",
      seoDescription: "A guide for Australians.",
      canonicalUrl: "https://example.com/guides/bitcoin",
      featuredImage: "/images/bitcoin.png",
      featuredImageAlt: "Bitcoin logo",
      noIndex: false,
      region: "AU",
      providerRelationships: [{ providerId: "prov_1", relationship: "FEATURED" }],
      cryptoAssetIds: ["asset_1"],
      relatedGuideIds: ["article_1"],
      sources: [{ label: "AUSTRAC", url: "https://austrac.gov.au", sourceType: "REGULATOR" }],
    })
  );
  assert.equal(result.ok, true);
});