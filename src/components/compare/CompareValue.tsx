import type { ReactNode } from "react";

/**
 * Shared comparison-cell semantics.
 *
 * null / unknown means the research is incomplete, never that a capability is
 * absent. Explicit negative values are rendered separately as "Not supported"
 * so an evidence gap cannot be mistaken for a provider limitation.
 */
export function renderCompareValue(value: string | null): ReactNode {
  if (
    value === null ||
    value === "?" ||
    value === "Not yet confirmed" ||
    value === "Not verified"
  ) {
    return (
      <span className="text-muted inline-flex items-center gap-1.5">
        <span aria-hidden>?</span>
        <span>Not verified</span>
      </span>
    );
  }

  if (value === "✓" || value === "Available") {
    return (
      <span
        className="text-green inline-flex min-h-6 min-w-6 items-center justify-center text-base font-bold"
        aria-label="Supported"
        title="Supported"
      >
        <span aria-hidden>✓</span>
        <span className="sr-only">Supported</span>
      </span>
    );
  }

  if (value === "—" || value === "Not available" || value === "Not supported") {
    return (
      <span
        className="text-muted inline-flex min-h-6 min-w-6 items-center justify-center"
        aria-label="Not supported"
        title="Not supported"
      >
        <span aria-hidden>—</span>
        <span className="sr-only">Not supported</span>
      </span>
    );
  }

  return value;
}
