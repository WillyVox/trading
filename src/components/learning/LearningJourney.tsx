import Link from "next/link";
import { getLearningContext } from "@/lib/learning/paths";
import {
  LessonCompletionControl,
  LessonProgressHeader,
} from "@/components/learning/LearningProgressClient";
import { LearningNextLink } from "@/components/learning/LearningNextLink";

export function LearningJourneyHeader({ href }: { href: string }) {
  const context = getLearningContext(href);
  if (!context) return null;
  const { path, index } = context;
  const current = index + 1;
  const percent = Math.round((current / path.lessons.length) * 100);

  return (
    <section
      aria-label={`${path.title} learning path`}
      className="border-border bg-panel-secondary mb-7 rounded-2xl border p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-gold text-xs font-bold tracking-[0.16em] uppercase">
          {path.label}
        </p>
        <p className="text-muted text-xs font-semibold">
          Lesson {current} of {path.lessons.length}
        </p>
      </div>
      <div
        className="bg-border mt-4 h-1.5 overflow-hidden rounded-full"
        aria-hidden="true"
      >
        <div
          className="bg-gold h-full rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-muted mt-3 text-sm leading-6">{path.description}</p>
      <LessonProgressHeader href={href} />
    </section>
  );
}

export function ContinueLearning({ href }: { href: string }) {
  const context = getLearningContext(href);
  if (!context) return null;
  const { path, lesson, index, previous, next, practice } = context;

  return (
    <section
      className="border-border mt-10 border-t pt-8"
      aria-labelledby="continue-learning-heading"
    >
      <p className="text-gold text-xs font-bold tracking-[0.16em] uppercase">
        Continue learning
      </p>
      <h2
        id="continue-learning-heading"
        className="font-display text-navy mt-2 text-2xl font-bold"
      >
        {next
          ? `Next in ${path.title}`
          : `You've reached the end of ${path.title}`}
      </h2>
      <p className="text-muted mt-2 text-sm leading-6">
        Lesson {index + 1} of {path.lessons.length}: {lesson.title}
      </p>

      <LessonCompletionControl href={href} />

      {next ? (
        <LearningNextLink
          href={next.href}
          pathId={path.id}
          lessonId={next.id}
          lessonNumber={index + 2}
          className="border-border hover:border-gold-soft mt-5 block rounded-2xl border p-5 transition-colors sm:p-6"
        >
          <div className="flex items-start gap-4">
            <span className="font-display text-gold text-lg font-bold">
              {String(index + 2).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="font-display text-navy text-xl font-bold">
                {next.title}
              </p>
              <p className="text-muted mt-1 text-sm leading-6">
                {next.description}
              </p>
              <p className="text-blue mt-3 text-sm font-semibold">
                Continue to lesson {index + 2} · ~{next.minutes} min →
              </p>
            </div>
          </div>
        </LearningNextLink>
      ) : (
        <div className="border-gold-soft bg-panel-secondary mt-5 rounded-2xl border p-5 sm:p-6">
          <p className="text-navy font-semibold">
            You now have the foundation to continue researching this topic.
          </p>
          <Link
            href={
              path.id === "share-trading-foundations"
                ? "/learn/share-trading"
                : "/learn/crypto"
            }
            className="text-blue mt-3 inline-block text-sm font-semibold underline"
          >
            Review the full learning path →
          </Link>
        </div>
      )}

      <div
        className={`mt-4 grid gap-3 ${practice && previous ? "sm:grid-cols-2" : ""}`}
      >
        {practice ? (
          <Link
            href={practice.href}
            className="bg-panel-secondary border-border hover:border-gold-soft rounded-xl border p-4"
          >
            <p className="text-gold text-xs font-bold tracking-[0.12em] uppercase">
              Put it into practice
            </p>
            <p className="text-navy mt-2 font-semibold">{practice.title}</p>
            <p className="text-muted mt-1 text-sm leading-5">
              {practice.description}
              {practice.minutes ? ` · ~${practice.minutes} min` : ""}
            </p>
          </Link>
        ) : null}
        {previous ? (
          <Link
            href={previous.href}
            className="bg-panel-secondary border-border hover:border-gold-soft rounded-xl border p-4"
          >
            <p className="text-muted text-xs font-bold tracking-[0.12em] uppercase">
              Previous lesson
            </p>
            <p className="text-navy mt-2 font-semibold">← {previous.title}</p>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
