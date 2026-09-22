import type { ReactNode } from "react";
import Link from "next/link";
import type { ToolVerificationStatus } from "@/lib/tools/types";

/*
 * Shared result-panel visual language for every calculator tool, matching the
 * reference mockup: eyebrow + title, a navy hero band for the headline value,
 * labelled rows for the breakdown, a two-box assumptions/not-included grid,
 * and one footer band per source. Tool-specific business logic (calculate.ts
 * files) is untouched — each calculator just builds the props below from its
 * own data.
 */

const SUPPORT_EMAIL = "tradingguide@outlook.com.au";

const PRICING_STATUS_LABEL: Record<ToolVerificationStatus, string> = {
  VERIFIED: "Verified",
  STALE: "Stale — needs review",
  UNVERIFIED: "Unverified",
};

export type ResultRow = { label: string; value: string };
export type SourceInfo = {
  label?: string;
  sourceUrl: string | null;
  verifiedAt: string | null;
  reviewDueAt?: string | null;
  status: ToolVerificationStatus;
};
export type ResultLink = { label: string; href: string };

function sourceLabel(sourceUrl: string | null) {
  if (!sourceUrl) return "Not published";
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./, "");
  } catch {
    return "Official provider pricing";
  }
}

function formatDate(value: string | null | undefined) {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("en-AU", { dateStyle: "medium" }).format(date)
    : null;
}

function Row({ label, value }: ResultRow) {
  return (
    <div className="border-border flex items-start justify-between gap-4 border-b py-3 text-sm last:border-b-0">
      <span className="text-muted">{label}</span>
      <span className="text-navy text-right font-bold">{value}</span>
    </div>
  );
}

function Box({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="bg-panel-secondary rounded-xl p-4">
      <h3 className="text-navy font-bold">{title}</h3>
      <ul className="text-muted mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function SourceBand({ source }: { source: SourceInfo }) {
  const reportSubject = encodeURIComponent(
    "Report a pricing issue on a Trading Guide calculator"
  );
  return (
    <div className="border-gold bg-panel-secondary rounded-lg border-l-4 p-4">
      <h3 className="text-navy font-bold">
        {source.label ? `About ${source.label}` : "About this calculation"}
      </h3>
      <p className="text-muted mt-1 text-sm">
        Source: {sourceLabel(source.sourceUrl)}
        {source.status === "STALE" ? " · Marked stale, pending review" : ""}
      </p>
      <p className="text-muted mt-1 text-sm">
        {formatDate(source.verifiedAt)
          ? `Last verified: ${formatDate(source.verifiedAt)}`
          : "Not yet verified"}
        {formatDate(source.reviewDueAt)
          ? ` · Review due ${formatDate(source.reviewDueAt)}`
          : ""}
        {source.sourceUrl && (
          <>
            {" · "}
            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue font-semibold underline"
            >
              View source
            </a>
          </>
        )}
        {" · "}
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${reportSubject}`}
          className="text-blue font-semibold underline"
        >
          Report an issue
        </a>
      </p>
    </div>
  );
}

export { PRICING_STATUS_LABEL };

export function ToolResultPanel({
  panelId,
  eyebrow,
  title,
  value,
  heroCaption = "Estimated result for this scenario",
  context,
  fallbackTitle = "Unable to calculate this scenario",
  fallbackMessage,
  hideBody = false,
  extra,
  rows,
  explanation,
  assumptions = [],
  exclusions,
  sources,
  links,
}: {
  panelId: string;
  eyebrow: string;
  title: string;
  value?: string;
  heroCaption?: string;
  context?: string;
  fallbackTitle?: string;
  fallbackMessage?: string;
  hideBody?: boolean;
  extra?: ReactNode;
  rows?: ResultRow[];
  explanation?: string;
  assumptions?: string[];
  exclusions: string[];
  sources: SourceInfo[];
  links?: ResultLink[];
}) {
  const hasBody = !hideBody;
  return (
    <>
      <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
        {eyebrow}
      </p>
      <h2
        id={panelId}
        className="font-display text-navy mt-2 text-xl font-bold"
      >
        {title}
      </h2>

      <div className="bg-navy mt-4 rounded-xl px-5 py-6 md:px-6">
        {value ? (
          <>
            <p className="text-xs font-semibold tracking-wide text-white/70">
              {heroCaption}
            </p>
            <p className="font-display text-gold-soft mt-2 text-4xl font-bold break-words">
              {value}
            </p>
            {context && <p className="mt-2 text-sm text-white/80">{context}</p>}
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-white">{fallbackTitle}</p>
            {fallbackMessage && (
              <p className="mt-2 text-sm text-white/80">{fallbackMessage}</p>
            )}
          </>
        )}
      </div>

      {hasBody && (
        <div className="mt-6 space-y-5 text-sm">
          {extra}
          {rows && rows.length > 0 && (
            <div>
              {rows.map((row) => (
                <Row key={row.label} {...row} />
              ))}
            </div>
          )}
          {explanation && <p className="text-muted leading-6">{explanation}</p>}

          <div
            className={`grid gap-4 ${assumptions.length > 0 ? "sm:grid-cols-2" : "grid-cols-1"}`}
          >
            <Box title="Assumptions" items={assumptions} />
            <Box title="Not included" items={exclusions} />
          </div>

          {sources.map((source, i) => (
            <SourceBand key={source.label ?? i} source={source} />
          ))}

          {links && links.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-blue font-semibold underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
