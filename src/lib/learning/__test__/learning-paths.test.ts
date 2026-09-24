import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { LEARNING_PATHS, getLearningContext } from "../paths";

const appRoot = join(process.cwd(), "src/app");

function routePageExists(href: string) {
  const segments = href.split("/").filter(Boolean);
  const direct = join(appRoot, ...segments, "page.tsx");
  if (existsSync(direct)) return true;
  // App Router route groups do not appear in URLs, so search the known guide groups.
  if (segments[0] === "guides" && segments.length === 2) {
    for (const group of ["(share-trading)", "(crypto)"]) {
      if (existsSync(join(appRoot, "guides", group, segments[1], "page.tsx")))
        return true;
    }
  }
  return false;
}

test("learning paths have unique IDs, lesson IDs and lesson URLs", () => {
  assert.equal(
    new Set(LEARNING_PATHS.map((path) => path.id)).size,
    LEARNING_PATHS.length
  );
  const hrefs = new Set<string>();
  for (const path of LEARNING_PATHS) {
    assert.ok(
      path.lessons.length >= 2,
      `${path.id} should have at least two lessons`
    );
    assert.equal(
      new Set(path.lessons.map((lesson) => lesson.id)).size,
      path.lessons.length
    );
    for (const lesson of path.lessons) {
      assert.ok(
        lesson.minutes > 0,
        `${lesson.id} needs a positive reading time`
      );
      assert.ok(
        !hrefs.has(lesson.href),
        `${lesson.href} appears in more than one journey`
      );
      hrefs.add(lesson.href);
    }
  }
});

test("every configured lesson and practice link resolves to an App Router page", () => {
  for (const path of LEARNING_PATHS) {
    for (const lesson of path.lessons)
      assert.ok(
        routePageExists(lesson.href),
        `Missing lesson route: ${lesson.href}`
      );
    for (const practice of Object.values(path.practiceByLesson ?? {}))
      assert.ok(
        routePageExists(practice.href),
        `Missing practice route: ${practice.href}`
      );
  }
});

test("getLearningContext returns correct previous/next boundaries", () => {
  for (const path of LEARNING_PATHS) {
    path.lessons.forEach((lesson, index) => {
      const context = getLearningContext(lesson.href);
      assert.ok(context);
      assert.equal(context.path.id, path.id);
      assert.equal(context.index, index);
      assert.equal(
        context.previous?.id,
        index > 0 ? path.lessons[index - 1].id : undefined
      );
      assert.equal(
        context.next?.id,
        index < path.lessons.length - 1 ? path.lessons[index + 1].id : undefined
      );
    });
  }
  assert.equal(getLearningContext("/guides/not-a-learning-lesson"), undefined);
});
