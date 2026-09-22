import assert from "node:assert/strict";
import test from "node:test";
import { CONTENT_OPPORTUNITIES } from "../content-opportunities";

test("Phase 9.2 keeps a deliberate 50-item editorial opportunity map", () => {
  assert.equal(CONTENT_OPPORTUNITIES.length, 50);
  assert.equal(new Set(CONTENT_OPPORTUNITIES.map((item) => item.id)).size, 50);
});

test("the roadmap contains build-now, next, later and explicit do-not-build decisions", () => {
  const priorities = new Set(
    CONTENT_OPPORTUNITIES.map((item) => item.priority)
  );
  for (const priority of [
    "BUILD_NOW",
    "BUILD_NEXT",
    "LATER",
    "DO_NOT_BUILD",
  ] as const) {
    assert.ok(priorities.has(priority));
  }
});

test("build-now pages require evidence and connect to an existing product surface", () => {
  for (const item of CONTENT_OPPORTUNITIES.filter(
    (entry) => entry.priority === "BUILD_NOW"
  )) {
    assert.ok(item.evidenceNeeded.length > 0, item.id);
    assert.ok(item.supports.length > 0, item.id);
    assert.ok(item.rationale.length > 30, item.id);
  }
});

test("do-not-build entries never expose a target path", () => {
  for (const item of CONTENT_OPPORTUNITIES.filter(
    (entry) => entry.priority === "DO_NOT_BUILD"
  )) {
    assert.equal(item.targetPath, undefined, item.id);
  }
});

test("target paths are unique so one search intent does not create competing URLs", () => {
  const paths = CONTENT_OPPORTUNITIES.flatMap((item) =>
    item.targetPath ? [item.targetPath] : []
  );
  assert.equal(new Set(paths).size, paths.length);
});
