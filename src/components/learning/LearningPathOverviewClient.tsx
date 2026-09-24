"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { LearningPath } from "@/lib/learning/paths";
import {
  getLearningProgressServerSnapshot,
  getPathProgress,
  readLearningProgress,
  subscribeToLearningProgress,
} from "@/lib/learning/progress";
import { trackEvent } from "@/lib/analytics/events";

export function LearningPathOverviewClient({ path }: { path: LearningPath }) {
  const progress = useSyncExternalStore(
    subscribeToLearningProgress,
    readLearningProgress,
    getLearningProgressServerSnapshot
  );
  const state = getPathProgress(path, progress);
  const started = Boolean(progress.paths[path.id]);
  const target = started ? state.resumeLesson : path.lessons[0];

  return (
    <>
      <div className="border-gold-soft bg-panel-secondary mt-8 rounded-2xl border p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-gold text-xs font-bold tracking-[0.16em] uppercase">
              Your progress
            </p>
            <p className="text-navy mt-2 font-semibold">
              {state.completedCount} of {path.lessons.length} lessons completed
            </p>
          </div>
          <p className="text-muted text-sm font-semibold">{state.percent}%</p>
        </div>
        <div className="bg-border mt-3 h-2 overflow-hidden rounded-full">
          <div
            className="bg-gold h-full rounded-full transition-[width]"
            style={{ width: `${state.percent}%` }}
          />
        </div>
        <Link
          href={target.href}
          onClick={() =>
            trackEvent(
              started ? "learning_path_resumed" : "learning_path_started",
              { path_id: path.id, lesson_id: target.id }
            )
          }
          className="bg-navy hover:bg-navy/90 mt-5 inline-flex min-h-11 items-center rounded-lg px-5 text-sm font-semibold text-white"
        >
          {state.isComplete
            ? "Review the journey →"
            : started
              ? `Continue: ${target.title} →`
              : "Start lesson 1 →"}
        </Link>
        <p className="text-muted mt-3 text-xs">
          Progress is stored only in this browser.
        </p>
      </div>
      <ol className="mt-8 space-y-3">
        {path.lessons.map((lesson, index) => {
          const done = state.completed.has(lesson.id);
          const current =
            started && state.resumeLesson.id === lesson.id && !state.isComplete;
          return (
            <li key={lesson.id}>
              <Link
                href={lesson.href}
                onClick={() =>
                  trackEvent("learning_lesson_selected", {
                    path_id: path.id,
                    lesson_id: lesson.id,
                    lesson_number: index + 1,
                  })
                }
                className="border-border hover:border-gold-soft grid gap-3 rounded-2xl border p-5 transition-colors sm:grid-cols-[3rem_1fr_auto] sm:items-center"
              >
                <span className="font-display text-gold text-lg font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="text-navy block font-semibold">
                    {lesson.title}
                  </span>
                  <span className="text-muted mt-1 block text-sm leading-6">
                    {lesson.description}
                  </span>
                </span>
                <span className="text-sm font-semibold">
                  {done ? (
                    <span className="text-navy">✓ Completed</span>
                  ) : current ? (
                    <span className="text-gold">
                      Current · ~{lesson.minutes} min
                    </span>
                  ) : (
                    <span className="text-muted">~{lesson.minutes} min</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
