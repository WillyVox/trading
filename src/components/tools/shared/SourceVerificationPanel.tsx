import type { ToolVerificationStatus } from "@/lib/tools/types";

export function SourceVerificationPanel({
  sourceUrl,
  verifiedAt,
  status,
}: {
  sourceUrl: string | null;
  verifiedAt: string | null;
  status: ToolVerificationStatus;
}) {
  const date = verifiedAt ? new Date(verifiedAt) : null;
  const formatted =
    date && Number.isFinite(date.getTime())
      ? new Intl.DateTimeFormat("en-AU", { dateStyle: "medium" }).format(date)
      : null;
  return (
    <div className="border-border border-t pt-5">
      <h3 className="text-navy font-bold">Source &amp; verification</h3>
      <p className="text-muted mt-1">
        Status: {status}
        {formatted ? ` · Verified ${formatted}` : ""}
      </p>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue mt-2 inline-flex min-h-11 items-center font-semibold underline"
        >
          View official source ↗
        </a>
      )}
    </div>
  );
}
