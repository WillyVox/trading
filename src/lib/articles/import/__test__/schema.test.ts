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

test("warns when source has a type (unsupported column)", () => {
  const result = validateFrontmatter(
    { title: "Title", slug: "title", sources: [{ label: "Src", url: "https://example.com", type: "REGULATOR" }] },
    "content"
  );
  assert.equal(result.ok, true);
  assert.ok(result.warnings.some((w) => w.includes("not stored")));
});

test("warns on regional variant missing canonicalArticleSlug", () => {
  const result = validateFrontmatter({ title: "Title", slug: "title", region: "AU" }, "content");
  assert.equal(result.ok, true);
  assert.ok(result.warnings.some((w) => w.includes("canonicalArticleSlug")));
});