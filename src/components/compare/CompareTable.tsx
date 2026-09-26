"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { comparisonHrefWithout } from "@/components/compare/paths";
import type {
  CompareSection,
  CompareSubject,
} from "@/components/compare/types";
import { renderCompareValue } from "@/components/compare/CompareValue";

function verificationCopy(status: CompareSubject["verificationStatus"]) {
  if (status === "VERIFIED")
    return { label: "Data verified", marker: "●", className: "text-green" };
  if (status === "STALE")
    return { label: "Data review due", marker: "●", className: "text-red" };
  return {
    label: "Data not yet verified",
    marker: "○",
    className: "text-muted",
  };
}

/**
 * Research-first desktop/tablet comparison table. Provider identity stays
 * visible while scrolling vertically; row labels stay visible horizontally.
 * Columns intentionally keep a useful minimum width instead of squeezing six
 * providers into the viewport, preserving readable names and evidence states.
 */
export function CompareTable({
  subjects,
  sections,
  buildYourOwnHref,
  comparisonBasePath,
}: {
  subjects: CompareSubject[];
  sections: CompareSection[];
  buildYourOwnHref?: string;
  comparisonBasePath?: string;
}) {
  const canRemove = subjects.length > 2 && Boolean(comparisonBasePath);
  const colCount = subjects.length + (buildYourOwnHref ? 2 : 1);
  const isWide = subjects.length > 4;
  const primarySections = sections.filter((section) => !section.secondary);
  const secondarySections = sections.filter((section) => section.secondary);
  const [showFullComparison, setShowFullComparison] = useState(false);
  const visibleSections = showFullComparison
    ? [...primarySections, ...secondarySections]
    : primarySections;

  return (
    <div className="hidden md:block">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-muted text-xs">
            <span className="mr-3">● Data verified</span>
            <span>○ Not verified</span>
          </p>
          <p
            className="text-muted flex items-center gap-3 text-xs"
            aria-label="Comparison value legend"
          >
            <span>
              <span className="text-green font-bold" aria-hidden>
                ✓
              </span>{" "}
              Supported
            </span>
            <span>
              <span aria-hidden>—</span> Not supported
            </span>
            <span>
              <span aria-hidden>?</span> Not verified
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isWide && (
            <p className="text-muted text-xs" aria-hidden="true">
              Scroll to see more platforms →
            </p>
          )}
          {secondarySections.length > 0 && (
            <button
              type="button"
              onClick={() => setShowFullComparison((current) => !current)}
              aria-expanded={showFullComparison}
              className="border-border text-navy hover:bg-panel-secondary inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold transition"
            >
              {showFullComparison
                ? "View main features ↑"
                : "View full comparison ↓"}
            </button>
          )}
        </div>
      </div>
      <div className="relative">
        <div
          className="border-border bg-panel overflow-x-auto rounded-2xl border shadow-sm"
          tabIndex={0}
          aria-label="Scrollable comparison table"
        >
          <table className="w-max min-w-full border-collapse text-sm">
            <caption className="sr-only">
              Comparison of {subjects.map((s) => s.name).join(", ")}: facts,
              fees, and features side by side.
            </caption>
            <thead>
              <tr className="border-border bg-panel-secondary sticky top-0 z-10 border-b text-left">
                <th
                  scope="col"
                  className="bg-panel-secondary sticky left-0 z-20 w-[210px] min-w-[210px] px-5 py-4 align-bottom"
                >
                  <span className="text-muted text-[11px] font-semibold tracking-[0.12em] uppercase">
                    Platform
                  </span>
                </th>
                {subjects.map((s) => {
                  const verification = verificationCopy(s.verificationStatus);
                  return (
                    <th
                      key={s.id}
                      scope="col"
                      className="relative w-[190px] min-w-[190px] px-4 py-4 align-top"
                    >
                      {canRemove && (
                        <Link
                          href={comparisonHrefWithout(
                            comparisonBasePath ?? "",
                            subjects,
                            s.slug
                          )}
                          aria-label={`Remove ${s.name} from this comparison`}
                          className="text-muted hover:text-navy absolute top-3 right-3"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M1 1l12 12M13 1L1 13"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </Link>
                      )}
                      <div className="flex min-h-[142px] flex-col items-start pr-5">
                        <div className="flex min-h-10 items-center gap-2.5">
                          <ProviderLogo
                            logo={s.logo}
                            name={s.name}
                            size="sm"
                            decorative
                          />
                          <Link
                            href={s.profileHref}
                            className="font-display text-navy line-clamp-2 text-base leading-tight font-bold hover:underline"
                          >
                            {s.name}
                          </Link>
                        </div>
                        <p
                          className={`mt-3 text-[11px] font-medium ${verification.className}`}
                          title="Trading Guide research status; this is not an endorsement of the provider."
                        >
                          <span aria-hidden>{verification.marker}</span>{" "}
                          {verification.label}
                        </p>
                        <div className="mt-auto flex flex-col">
                          {s.cta && (
                            <a
                              href={s.cta.href}
                              target="_blank"
                              rel={
                                s.cta.isAffiliate
                                  ? "sponsored noopener"
                                  : "noopener"
                              }
                              data-provider-outbound="true"
                              data-provider-slug={s.cta.providerSlug}
                              data-destination-type={s.cta.destinationType}
                              data-placement={s.cta.placement}
                              className="bg-navy text-background hover:bg-navy-dark inline-flex min-h-10 items-center justify-center gap-1 rounded-full px-4 py-2 text-xs font-bold shadow-sm transition hover:shadow-md"
                            >
                              Visit site <span aria-hidden>↗</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </th>
                  );
                })}
                {buildYourOwnHref && (
                  <th
                    scope="col"
                    className="w-[170px] min-w-[170px] px-4 py-4 align-middle"
                  >
                    <Link
                      href={buildYourOwnHref}
                      className="border-border text-muted hover:border-gold-soft hover:text-navy flex flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-5 text-center text-xs"
                    >
                      <span
                        aria-hidden
                        className="border-border flex h-8 w-8 items-center justify-center rounded-lg border border-dashed text-base leading-none"
                      >
                        +
                      </span>
                      Add another
                    </Link>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {visibleSections.map((section) => (
                <Fragment key={section.title}>
                  <tr className="border-border bg-panel-secondary/70 border-b">
                    <th
                      scope="colgroup"
                      colSpan={colCount}
                      className="text-muted px-5 py-2.5 text-left text-xs font-semibold tracking-wide uppercase"
                    >
                      {section.title}
                    </th>
                  </tr>
                  {section.rows.map((row) => (
                    <tr
                      key={row.key}
                      className="border-border border-b last:border-0"
                    >
                      <th
                        scope="row"
                        className="bg-panel text-muted sticky left-0 z-10 w-[210px] min-w-[210px] px-5 py-3.5 text-left font-medium shadow-[1px_0_0_0_var(--color-border)]"
                      >
                        {row.label}
                      </th>
                      {row.values.map((value, i) => (
                        <td
                          key={subjects[i]?.id ?? i}
                          className="text-navy w-[190px] min-w-[190px] px-4 py-3.5 align-top"
                        >
                          {renderCompareValue(value)}
                        </td>
                      ))}
                      {buildYourOwnHref && (
                        <td className="w-[170px] min-w-[170px]" />
                      )}
                    </tr>
                  ))}
                </Fragment>
              ))}
              {primarySections.length === 0 && (
                <tr>
                  <td
                    colSpan={colCount}
                    className="text-muted px-4 py-6 text-center"
                  >
                    No comparable facts, fees, or features recorded yet for{" "}
                    {subjects.map((s) => s.name).join(", ")}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isWide && (
          <div
            aria-hidden="true"
            className="from-panel pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l to-transparent opacity-70"
          />
        )}
      </div>
      <p className="text-muted mt-2 text-[11px]">
        Data verification describes Trading Guide's research status. It is not
        an endorsement or recommendation of a provider.
      </p>
    </div>
  );
}
