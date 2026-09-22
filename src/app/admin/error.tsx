"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <section className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-6">
        <h1 className="font-serif text-2xl font-semibold text-[var(--navy)]">
          Admin data is temporarily unavailable
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          The admin area could not complete its data request. No changes have
          been assumed to succeed. Try again after the service is available.
        </p>
        <button type="button" onClick={reset} className="mt-5 rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white">
          Try again
        </button>
      </section>
    </main>
  );
}
