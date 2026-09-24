"use client";

import Link from "next/link";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { LEARNING_PATHS, getLearningContext } from "@/lib/learning/paths";
import { trackEvent } from "@/lib/analytics/events";
import {
  getLearningProgressServerSnapshot,
  getPathProgress,
  markLessonVisited,
  readLearningProgress,
  setLessonCompleted,
  subscribeToLearningProgress,
} from "@/lib/learning/progress";

function useLearningProgress() {
  return useSyncExternalStore(
    subscribeToLearningProgress,
    readLearningProgress,
    getLearningProgressServerSnapshot
  );
}

export function LessonProgressHeader({ href }: { href: string }) {
  const context = useMemo(() => getLearningContext(href), [href]);
  const progress = useLearningProgress();

  useEffect(() => {
    if (context) markLessonVisited(context.path.id, context.lesson.id);
  }, [context]);

  if (!context) return null;
  const state = getPathProgress(context.path, progress);

  return (
    <div
      className="mt-4"
      aria-label={`${state.completedCount} of ${context.path.lessons.length} lessons completed`}
    >
      <p className="text-muted text-xs font-semibold">
        {state.completedCount} of {context.path.lessons.length} completed
      </p>
      <div
        className="bg-border mt-2 h-1.5 overflow-hidden rounded-full"
        aria-hidden="true"
      >
        <div
          className="bg-gold h-full rounded-full transition-[width]"
          style={{ width: `${state.percent}%` }}
        />
      </div>
    </div>
  );
}

export function LessonCompletionControl({ href }: { href: string }) {
  const context = useMemo(() => getLearningContext(href), [href]);
  const progress = useLearningProgress();
  if (!context) return null;
  const state = getPathProgress(context.path, progress);
  const completed = state.completed.has(context.lesson.id);

  return (
    <div className="border-gold-soft bg-panel-secondary mt-5 rounded-xl border p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
      <div>
        <p className="text-navy text-sm font-semibold">
          {completed ? "Lesson completed" : "Finished this lesson?"}
        </p>
        <p className="text-muted mt-1 text-xs leading-5">
          Progress is saved only in this browser. No account is required.
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          const nextCompleted = !completed;
          setLessonCompleted(context.path.id, context.lesson.id, nextCompleted);
          if (nextCompleted) {
            trackEvent("lesson_completed", {
              path_id: context.path.id,
              lesson_id: context.lesson.id,
              lesson_number: context.index + 1,
              total_lessons: context.path.lessons.length,
            });
            if (state.completedCount + 1 === context.path.lessons.length)
              trackEvent("learning_path_completed", {
                path_id: context.path.id,
                total_lessons: context.path.lessons.length,
              });
          } else {
            trackEvent("lesson_completion_undone", {
              path_id: context.path.id,
              lesson_id: context.lesson.id,
            });
          }
        }}
        aria-pressed={completed}
        className="border-gold-soft text-navy hover:bg-gold-soft/20 focus-visible:ring-gold-soft mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 sm:mt-0"
      >
        {completed ? "✓ Completed · undo" : "Mark lesson complete"}
      </button>
    </div>
  );
}

export function HomepageLearningProgress() {
  const progress = useLearningProgress();
  const active = LEARNING_PATHS.map((path) => ({
    path,
    state: getPathProgress(path, progress),
  }))
    .filter(
      ({ path, state }) =>
        state.completedCount > 0 ||
        Boolean(progress.paths[path.id]?.lastVisitedLessonId)
    )
    .sort((a, b) =>
      (progress.paths[b.path.id]?.updatedAt ?? "").localeCompare(
        progress.paths[a.path.id]?.updatedAt ?? ""
      )
    )[0];

  if (!active) return null;
  const { path, state } = active;

  return (
    <section
      className="mx-auto max-w-6xl px-4 pt-10 md:pt-12"
      aria-label="Continue learning"
    >
      <div className="border-gold-soft bg-panel-secondary rounded-2xl border p-5 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-gold text-xs font-bold tracking-[0.16em] uppercase">
            Continue learning
          </p>
          <h2 className="font-display text-navy mt-2 text-2xl font-bold">
            {path.title}
          </h2>
          <p className="text-muted mt-1 text-sm">
            {state.completedCount} of {path.lessons.length} lessons completed ·{" "}
            {state.percent}%
          </p>
          <div
            className="bg-border mt-3 h-1.5 max-w-md overflow-hidden rounded-full"
            aria-hidden="true"
          >
            <div
              className="bg-gold h-full rounded-full"
              style={{ width: `${state.percent}%` }}
            />
          </div>
        </div>
        <Link
          href={state.resumeLesson.href}
          className="bg-navy hover:bg-navy/90 focus-visible:ring-gold-soft mt-5 inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-5 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 sm:mt-0"
        >
          {state.isComplete
            ? "Review the journey →"
            : `Continue: ${state.resumeLesson.title} →`}
        </Link>
      </div>
    </section>
  );
}
