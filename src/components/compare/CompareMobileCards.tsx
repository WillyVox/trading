"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { comparisonHrefWithout } from "@/components/compare/paths";
import type {
  CompareSection,
  CompareSubject,
} from "@/components/compare/types";
import { renderCompareValue } from "@/components/compare/CompareValue";

/**
 * Small-screen counterpart to CompareTable -- a wide comparison table
 * degrades badly below `md`, so each subject gets its own scrollable card
 * with the same rows instead. Domain-agnostic for the same reason
 * CompareTable is -- see shared comparison UI types. Hidden at `md` and
 * above. Mirrors CompareTable's header content (logo, remove control,
 * visit CTA, review link) so removing a subject or adding one behaves
 * identically on mobile and desktop.
 */
export function CompareMobileCards({
  subjects,
  sections,
  buildYourOwnHref,
  comparisonBasePath,
}: {
  subjects: CompareSubject[];
  sections: CompareSection[];
  /** See CompareTable's prop of the same name -- omit on the
   * always-complete compare pages. */
  buildYourOwnHref?: string;
  comparisonBasePath?: string;
}) {
  const canRemove = subjects.length > 2 && Boolean(comparisonBasePath);
  const primarySections = sections.filter((section) => !section.secondary);
  const secondarySections = sections.filter((section) => section.secondary);
  const [showFullComparison, setShowFullComparison] = useState(false);
  const visibleSections = showFullComparison
    ? [...primarySections, ...secondarySections]
    : primarySections;

  return (
    <div className="space-y-4 md:hidden">
      <div className="flex flex-col gap-3">
        <p
          className="text-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
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
        {secondarySections.length > 0 && (
          <button
            type="button"
            onClick={() => setShowFullComparison((current) => !current)}
            aria-expanded={showFullComparison}
            className="border-border text-navy hover:bg-panel-secondary inline-flex min-h-11 w-full items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold transition"
          >
            {showFullComparison
              ? "View main features ↑"
              : "View full comparison ↓"}
          </button>
        )}
      </div>
      {subjects.map((s, i) => (
        <Card key={s.id} className="relative">
          {canRemove && (
            <Link
              href={comparisonHrefWithout(
                comparisonBasePath ?? "",
                subjects,
                s.slug
              )}
              aria-label={`Remove ${s.name} from this comparison`}
              className="text-muted hover:text-navy absolute top-4 right-4"
            >
              <svg
                width="16"
                height="16"
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

          <div className="flex items-center gap-3">
            <ProviderLogo logo={s.logo} name={s.name} size="sm" decorative />
            <div className="min-w-0">
              <Link
                href={s.profileHref}
                className="font-display text-navy block text-lg font-bold hover:underline"
              >
                {s.name}
              </Link>
              <p className="text-muted mt-1 text-xs font-medium">
                {s.verificationStatus === "VERIFIED"
                  ? "● Data verified"
                  : s.verificationStatus === "STALE"
                    ? "● Data review due"
                    : "○ Data not verified"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={s.profileHref}
              className="border-border text-navy hover:bg-panel-secondary inline-flex min-h-12 w-full items-center justify-center rounded-full border px-4 py-3 text-center text-sm font-semibold sm:flex-1"
            >
              View details
            </Link>
            {s.cta && (
              <a
                href={s.cta.href}
                target="_blank"
                rel={s.cta.isAffiliate ? "sponsored noopener" : "noopener"}
                data-provider-outbound="true"
                data-provider-slug={s.cta.providerSlug}
                data-destination-type={s.cta.destinationType}
                data-placement={s.cta.placement}
                className="bg-navy text-background hover:bg-navy-dark inline-flex min-h-12 w-full items-center justify-center rounded-full px-4 py-3 text-center text-sm font-bold shadow-sm sm:flex-[1.35]"
              >
                Visit site ↗
              </a>
            )}
          </div>

          {visibleSections.map((section) => (
            <div key={section.title} className="mt-4">
              <h3 className="text-muted text-xs font-semibold tracking-wide uppercase">
                {section.title}
              </h3>
              <ul className="mt-2 space-y-2 text-sm">
                {section.rows.map((row) => (
                  <li
                    key={row.key}
                    className="border-border flex justify-between border-b pb-2"
                  >
                    <span className="text-muted">{row.label}</span>
                    <span className="text-navy">
                      {renderCompareValue(row.values[i] ?? null)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {primarySections.length === 0 && (
            <p className="text-muted mt-4 text-sm">
              No comparable facts, fees, or features recorded yet.
            </p>
          )}
        </Card>
      ))}

      {buildYourOwnHref && (
        <Link
          href={buildYourOwnHref}
          className="border-border text-muted hover:border-gold-soft hover:text-navy flex items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-5 text-sm"
        >
          <span
            aria-hidden
            className="border-border flex h-7 w-7 items-center justify-center rounded-lg border border-dashed text-base leading-none"
          >
            +
          </span>
          Add another
        </Link>
      )}
    </div>
  );
}
