import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import type { ComparisonSection, ComparisonSubject } from "@/lib/compare/types";

/**
 * Replaces CompareTable + CompareMobileCards with a single responsive
 * grid: 1 column on mobile, 2 on tablet, 3 on desktop -- no wide table to
 * scroll horizontally, and no separate desktop/mobile component pair to
 * keep in sync. Domain-agnostic for the same reason the two components it
 * replaces were -- see src/lib/compare/types.ts.
 *
 * Design direction: "Concept 2 -- card grid" from the compare-table
 * redesign exploration (2026-09-19). Each subject is a self-contained
 * card (logo, name, verification, CTA, then every section's rows as a
 * compact label/value list) rather than a column in a table, so the same
 * markup works at every breakpoint instead of degrading past ~3 columns.
 */
export function CompareCardGrid({
  subjects,
  sections,
  buildYourOwnHref,
}: {
  subjects: ComparisonSubject[];
  sections: ComparisonSection[];
  /** Anchor/URL for the "Add another" tile, e.g. "#build-your-own" on
   * /compare/[slug]. Omit on the always-complete pages
   * (/compare/crypto-exchanges, /compare/trading-platforms) where every
   * subject is already shown and there's nothing to add. */
  buildYourOwnHref?: string;
}) {
  if (subjects.length === 0) return null;

  // Removing a subject down to one isn't a comparison this page renders
  // usefully (see CompareDetailPage's "only one selected" message), so the
  // remove control only appears while there's a third subject to fall
  // back to -- same rule CompareTable/CompareMobileCards used.
  const canRemove = subjects.length > 2;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((s, i) => (
        <Card key={s.id} className="relative flex flex-col">
          <div className="flex items-center gap-3 pr-8">
            <ProviderLogo logo={s.logo} name={s.name} size="sm" decorative />
            <div className="min-w-0">
              <Link
                href={s.profileHref}
                className="font-display text-navy block truncate text-base font-bold hover:underline"
              >
                {s.name}
              </Link>
              <div className="mt-1">
                <VerificationBadge status={s.verificationStatus} />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {s.cta && (
              <a
                href={s.cta.href}
                target="_blank"
                rel={
                  s.cta.isAffiliate ? "sponsored noopener" : "nofollow noopener"
                }
                className="bg-navy text-background hover:bg-navy-dark inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold"
              >
                Visit site
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 2h6v6M10 2 2 10"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
            <Link
              href={s.profileHref}
              className="text-navy text-xs font-medium underline"
            >
              Read review
            </Link>
          </div>

          <div className="border-border mt-4 flex-1 border-t pt-3">
            {sections.map((section) => (
              <div key={section.title} className="mb-3.5 last:mb-0">
                <h3 className="text-muted text-xs font-semibold tracking-wide uppercase">
                  {section.title}
                </h3>
                <dl className="mt-1.5">
                  {section.rows.map((row) => (
                    <div
                      key={row.key}
                      className="border-border flex items-start justify-between gap-3 border-b py-1.5 text-sm last:border-0"
                    >
                      <dt className="text-muted">{row.label}</dt>
                      <dd className="text-navy text-right">
                        {row.values[i] ?? "\u2014"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            {sections.length === 0 && (
              <p className="text-muted text-sm">
                No comparable facts, fees, or features recorded yet.
              </p>
            )}
          </div>
        </Card>
      ))}

      {buildYourOwnHref && (
        <Link
          href={buildYourOwnHref}
          className="border-border text-muted hover:border-gold-soft hover:text-navy flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-5 text-center text-sm"
        >
          <span
            aria-hidden
            className="border-border flex h-8 w-8 items-center justify-center rounded-lg border border-dashed text-base leading-none"
          >
            +
          </span>
          Add another
        </Link>
      )}
    </div>
  );
}
