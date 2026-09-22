import Link from "next/link";

export function DataUnavailable({
  title = "Live data is temporarily unavailable",
  message = "We couldn't load this research data right now. No missing values have been treated as zero or as an empty result.",
  retryHref,
}: {
  title?: string;
  message?: string;
  retryHref?: string;
}) {
  return (
    <div
      className="border-border bg-panel-secondary rounded-xl border p-5"
      role="status"
    >
      <div className="text-navy font-semibold">{title}</div>
      <p className="text-muted mt-2 text-sm leading-6">{message}</p>
      {retryHref && (
        <Link
          href={retryHref}
          className="text-blue mt-3 inline-block text-sm font-semibold underline underline-offset-4"
        >
          Try again ↻
        </Link>
      )}
    </div>
  );
}
