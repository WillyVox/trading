import type { ReactNode } from "react";

export function DataUnavailable({
  title = "Live data is temporarily unavailable",
  message,
  children,
  compact = false,
}: {
  title?: string;
  message?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section
      role="status"
      className={`border-border bg-panel rounded-2xl border ${compact ? "p-5" : "p-6 md:p-8"}`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="bg-gold/10 text-gold-dark flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold"
        >
          !
        </span>
        <div>
          <h2 className="font-display text-navy text-xl font-bold">{title}</h2>
          <p className="text-muted mt-2 max-w-2xl text-sm leading-6">
            {message ??
              children ??
              "We couldn't load this data right now. Please try again shortly."}
          </p>
        </div>
      </div>
    </section>
  );
}

export function CalculatorUnavailable() {
  return (
    <DataUnavailable title="Calculator data is temporarily unavailable">
      Verified pricing data could not be loaded, so no estimate has been
      calculated. We would rather show no result than treat missing data as
      zero.
    </DataUnavailable>
  );
}

export function DataUnavailableBanner() {
  return (
    <div
      role="status"
      className="border-gold-soft bg-gold/5 text-navy border-y px-4 py-3 text-sm"
    >
      <div className="mx-auto max-w-6xl">
        <strong>Some live research data is temporarily unavailable.</strong>{" "}
        <span className="text-muted">
          Guides and other non-database content remain available.
        </span>
      </div>
    </div>
  );
}
