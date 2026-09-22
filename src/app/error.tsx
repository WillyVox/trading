"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <div className="border-border bg-panel rounded-2xl border p-8">
        <p className="text-gold text-sm font-bold tracking-wider uppercase">
          Temporary problem
        </p>
        <h1 className="font-display text-navy mt-2 text-3xl font-bold">
          We couldn't load this page
        </h1>
        <p className="text-muted mt-3 leading-7">
          Please try again. If part of our live data service is unavailable,
          other areas of Trading Guide may still work normally.
        </p>
        <button
          onClick={() => reset()}
          className="bg-navy mt-6 rounded-lg px-5 py-3 font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
