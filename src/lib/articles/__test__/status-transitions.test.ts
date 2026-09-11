import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidArticleStatusTransition, isPubliclyVisibleArticle, ARTICLE_STATUS_TRANSITIONS } from "../status-transitions";

// The forward editorial flow.
test("DRAFT can move to REVIEW", () => {
  assert.equal(isValidArticleStatusTransition("DRAFT", "REVIEW"), true);
});

test("REVIEW can move to PUBLISHED", () => {
  assert.equal(isValidArticleStatusTransition("REVIEW", "PUBLISHED"), true);
});

test("REVIEW can move back to DRAFT", () => {
  assert.equal(isValidArticleStatusTransition("REVIEW", "DRAFT"), true);
});

test("PUBLISHED can move back to DRAFT (unpublish)", () => {
  assert.equal(isValidArticleStatusTransition("PUBLISHED", "DRAFT"), true);
});

// Archive is reachable from any live state, but only ever un-archives to DRAFT.
for (const from of ["DRAFT", "REVIEW", "PUBLISHED"] as const) {
  test(`${from} can move to ARCHIVED`, () => {
    assert.equal(isValidArticleStatusTransition(from, "ARCHIVED"), true);
  });
}

test("ARCHIVED can move back to DRAFT", () => {
  assert.equal(isValidArticleStatusTransition("ARCHIVED", "DRAFT"), true);
});

// The transitions that must NEVER be allowed.
test("DRAFT cannot publish directly", () => {
  assert.equal(isValidArticleStatusTransition("DRAFT", "PUBLISHED"), false);
});

test("ARCHIVED cannot publish directly", () => {
  assert.equal(isValidArticleStatusTransition("ARCHIVED", "PUBLISHED"), false);
});

test("ARCHIVED cannot move to REVIEW", () => {
  assert.equal(isValidArticleStatusTransition("ARCHIVED", "REVIEW"), false);
});

test("PUBLISHED cannot move directly to REVIEW", () => {
  assert.equal(isValidArticleStatusTransition("PUBLISHED", "REVIEW"), false);
});

test("a status cannot transition to itself", () => {
  for (const status of ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const) {
    assert.equal(isValidArticleStatusTransition(status, status), false, `${status} -> ${status} should be false`);
  }
});

test("every status has an explicit (possibly empty) transition list", () => {
  for (const status of ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const) {
    assert.ok(Array.isArray(ARTICLE_STATUS_TRANSITIONS[status]));
  }
});

// Guide/News route isolation (Article CMS Block 1) — the rule that backs
// getPublishedArticleBySlugAndType in service.ts.
test("a PUBLISHED GUIDE is visible when GUIDE is required", () => {
  assert.equal(isPubliclyVisibleArticle({ status: "PUBLISHED", articleType: "GUIDE" }, "GUIDE"), true);
});

test("a PUBLISHED NEWS article is NOT visible when GUIDE is required (no cross-route resolution)", () => {
  assert.equal(isPubliclyVisibleArticle({ status: "PUBLISHED", articleType: "NEWS" }, "GUIDE"), false);
});

test("a PUBLISHED GUIDE is NOT visible when NEWS is required (no cross-route resolution)", () => {
  assert.equal(isPubliclyVisibleArticle({ status: "PUBLISHED", articleType: "GUIDE" }, "NEWS"), false);
});

for (const status of ["DRAFT", "REVIEW", "ARCHIVED"] as const) {
  test(`a ${status} article of the matching type is never publicly visible`, () => {
    assert.equal(isPubliclyVisibleArticle({ status, articleType: "GUIDE" }, "GUIDE"), false);
  });
}

test("a missing article (null) is never publicly visible", () => {
  assert.equal(isPubliclyVisibleArticle(null, "GUIDE"), false);
  assert.equal(isPubliclyVisibleArticle(undefined, "NEWS"), false);
});