"use client";

export function NotFoundBackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="text-muted hover:text-navy focus-visible:outline-navy inline-flex min-h-11 items-center gap-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <span aria-hidden="true">←</span>
      Go back
    </button>
  );
}
