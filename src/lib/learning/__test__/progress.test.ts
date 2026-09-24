import assert from "node:assert/strict";
import test from "node:test";
import { LEARNING_PATHS } from "../paths";
import {
  EMPTY_LEARNING_PROGRESS,
  getPathProgress,
  type StoredLearningProgress,
} from "../progress";

const path = LEARNING_PATHS[0];
function progress(
  completedLessonIds: string[],
  lastVisitedLessonId?: string
): StoredLearningProgress {
  return {
    version: 1,
    paths: {
      [path.id]: {
        completedLessonIds,
        lastVisitedLessonId,
        updatedAt: "2026-09-24T00:00:00.000Z",
      },
    },
  };
}

test("new learner starts at lesson one with zero progress", () => {
  const state = getPathProgress(path, EMPTY_LEARNING_PROGRESS);
  assert.equal(state.completedCount, 0);
  assert.equal(state.percent, 0);
  assert.equal(state.resumeLesson.id, path.lessons[0].id);
  assert.equal(state.isComplete, false);
});

test("completed lessons determine percentage and next incomplete lesson", () => {
  const completed = path.lessons.slice(0, 2).map((lesson) => lesson.id);
  const state = getPathProgress(path, progress(completed, path.lessons[1].id));
  assert.equal(state.completedCount, 2);
  assert.equal(state.percent, Math.round((2 / path.lessons.length) * 100));
  assert.equal(state.resumeLesson.id, path.lessons[2].id);
});

test("an incomplete last-visited lesson is preferred when it is later in the path", () => {
  const state = getPathProgress(
    path,
    progress([path.lessons[0].id], path.lessons[4].id)
  );
  assert.equal(state.resumeLesson.id, path.lessons[4].id);
});

test("unknown/stale completed IDs do not inflate progress", () => {
  const state = getPathProgress(
    path,
    progress(["removed-lesson", path.lessons[0].id])
  );
  assert.equal(state.completedCount, 1);
});

test("fully completed journey reports 100 percent and review target", () => {
  const ids = path.lessons.map((lesson) => lesson.id);
  const state = getPathProgress(path, progress(ids, ids.at(-1)));
  assert.equal(state.completedCount, path.lessons.length);
  assert.equal(state.percent, 100);
  assert.equal(state.isComplete, true);
  assert.equal(state.resumeLesson.id, path.lessons.at(-1)?.id);
});
