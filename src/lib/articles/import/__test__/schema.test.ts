import { test } from "node:test";
import assert from "node:assert/strict";
import { validateFrontmatter } from "../schema";

test("accepts minimal valid frontmatter", () => {
  const result = validateFrontmatter({ title: "How to Trade Crypto", slug: "how-to-trade-crypto" }, "Some content.");
  assert.equal(result.ok, true);
  assert.equal(result.data?.slug, "how-to-trade-crypto");
});

test("rejects missing required fields", () => {
  const result = validateFrontmatter({ title: "" }, "Some content.");
  assert.equal(result.ok, false);
  assert.ok(result.errors.length > 0);
});

test("rejects empty body even with valid frontmatter", () => {
  const result = validateFrontmatter({ title: "Title", slug: "title" }, "   ");
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes("content")));
});

const invalidSlugs = [
  "How To Trade Crypto!!!",
  "/crypto/guides/test",
  "?article=123",
  "double--hyphen",
  "-leading-hyphen",
  "trailing-hyphen-",
];

for (const slug of invalidSlugs) {
  test(`rejects malformed slug: ${slug}`, () => {
    const result = validateFrontmatter({ title: "Title", slug }, "content");
    assert.equal(result.ok, false);
  });
}

test("accepts valid slug", () => {
  const result = validateFrontmatter({ title: "Title", slug: "how-to-trade-crypto" }, "content");
  assert.equal(result.ok, true);
});

test("rejects invalid source URL", () => {
  const result = validateFrontmatter(
    { title: "Title", slug: "title", sources: [{ label: "Bad", url: "not-a-url" }] },
    "content"
  );
  assert.equal(result.ok, false);
});

test("rejects invalid region", () => {
  const result = validateFrontmatter({ title: "Title", slug: "title", region: "MARS" }, "content");
  assert.equal(result.ok, false);
});

test("warns (does not fail) when status is not DRAFT", () => {
  const result = validateFrontmatter({ title: "Title", slug: "title", status: "PUBLISHED" }, "content");
  assert.equal(result.ok, true);
  assert.ok(result.warnings.some((w) => w.includes("ignored")));
});

test("accepts sourceType without warning", () => {
  const result = validateFrontmatter(
    {
      title: "Title",
      slug: "title",
      sources: [{ label: "Src", url: "https://example.com", sourceType: "REGULATOR" }],
    },
    "content"
  );
  assert.equal(result.ok, true);
  assert.equal(result.data?.sources?.[0].sourceType, "REGULATOR");
  assert.ok(!result.warnings.some((w) => w.toLowerCase().includes("sourcetype")));
});

test("rejects an unrecognized sourceType enum value", () => {
  const result = validateFrontmatter(
    {
      title: "Title",
      slug: "title",
      sources: [{ label: "Src", url: "https://example.com", sourceType: "BLOG" }],
    },
    "content"
  );
  assert.equal(result.ok, false);
});

test("warns when source uses the deprecated `type` field (recognized value)", () => {
  const result = validateFrontmatter(
    { title: "Title", slug: "title", sources: [{ label: "Src", url: "https://example.com", type: "REGULATOR" }] },
    "content"
  );
  assert.equal(result.ok, true);
  assert.ok(result.warnings.some((w) => w.includes("deprecated") && w.includes("sourceType")));
});

test("warns when source uses the deprecated `type` field with an unrecognized value", () => {
  const result = validateFrontmatter(
    { title: "Title", slug: "title", sources: [{ label: "Src", url: "https://example.com", type: "BLOG" }] },
    "content"
  );
  assert.equal(result.ok, true);
  assert.ok(result.warnings.some((w) => w.includes("not a recognized sourceType")));
});

test("warns when the deprecated relatedProviders key is used", () => {
  const result = validateFrontmatter(
    { title: "Title", slug: "title", relatedProviders: ["kraken"] },
    "content"
  );
  assert.equal(result.ok, true);
  assert.ok(result.warnings.some((w) => w.includes("providerRelationships")));
});

test("accepts providerRelationships with providerSlug", () => {
  const result = validateFrontmatter(
    {
      title: "Title",
      slug: "title",
      providerRelationships: [{ providerSlug: "kraken", relationship: "COMPARED" }],
    },
    "content"
  );
  assert.equal(result.ok, true);
  assert.ok(!result.warnings.some((w) => w.includes("providerRelationships")));
});

test("accepts cryptoAssetSlugs, featuredImageAlt and affiliateDisclosureRequired", () => {
  const result = validateFrontmatter(
    {
      title: "Title",
      slug: "title",
      cryptoAssetSlugs: ["bitcoin"],
      featuredImageAlt: "A description of the image",
      affiliateDisclosureRequired: true,
    },
    "content"
  );
  assert.equal(result.ok, true);
  assert.deepEqual(result.data?.cryptoAssetSlugs, ["bitcoin"]);
  assert.equal(result.data?.featuredImageAlt, "A description of the image");
  assert.equal(result.data?.affiliateDisclosureRequired, true);
});

test("warns on regional variant missing canonicalArticleSlug", () => {
  const result = validateFrontmatter({ title: "Title", slug: "title", region: "AU" }, "content");
  assert.equal(result.ok, true);
  assert.ok(result.warnings.some((w) => w.includes("canonicalArticleSlug")));
});

test("accepts explicit articleType without warning", () => {
  const result = validateFrontmatter({ title: "Title", slug: "title", articleType: "NEWS" }, "content");
  assert.equal(result.ok, true);
  assert.equal(result.data?.articleType, "NEWS");
  assert.ok(!result.warnings.some((w) => w.includes("articleType")));
});

test("warns (does not fail) when articleType is omitted", () => {
  const result = validateFrontmatter({ title: "Title", slug: "title" }, "content");
  assert.equal(result.ok, true);
  assert.equal(result.data?.articleType, undefined);
  assert.ok(result.warnings.some((w) => w.includes("articleType")));
});

test("rejects an unknown articleType", () => {
  const result = validateFrontmatter({ title: "Title", slug: "title", articleType: "COMPARISON" }, "content");
  assert.equal(result.ok, false);
});