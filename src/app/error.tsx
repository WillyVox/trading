"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 py-16 sm:px-6">
      <section className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-sm sm:p-10">
        <p className="font-mono text-xs font-semibold tracking-[0.18em] text-[var(--gold)] uppercase">
          Trading Guide
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-[var(--navy)]">
          We couldn't load this page
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
          A temporary problem prevented this page from loading. You can try
          again, or continue from the homepage.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--navy)]"
          >
            Go to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
