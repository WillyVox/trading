import Link from 'next/link';
import { Fragment } from 'react';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { ProviderLogo } from '@/components/providers/ProviderLogo';
import { compareHrefWithout } from '@/lib/compare/resolve';
import type { ComparisonSection, ComparisonSubject } from '@/lib/compare/types';

/**
 * Desktop/tablet comparison table -- one column per subject, one row per
 * fact/fee/feature (crypto) or market/product/custody/account type (share
 * trading). Domain-agnostic: takes ComparisonSubject[] rather than a raw
 * Provider[], so it doesn't need to know which domain it's rendering --
 * see src/lib/compare/types.ts and the compare-engine-unification
 * analysis. Hidden below the `md` breakpoint; CompareMobileCards renders
 * the same data as stacked per-subject cards for small screens.
 * Horizontally scrollable so a 3+-way comparison never breaks the page
 * layout instead of capping how many subjects can be compared. Header row
 * and row-label column are both sticky so a long comparison stays
 * readable while scrolling in either direction.
 */
export function CompareTable({
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
  // Removing a subject down to one isn't a comparison this page renders
  // usefully (see CompareDetailPage's "only one selected" message), so the
  // remove control only appears while there's a third subject to fall
  // back to.
  const canRemove = subjects.length > 2;
  const colCount = subjects.length + (buildYourOwnHref ? 2 : 1); // row-label [+ add-another]

  return (
    <div className="border-border bg-panel hidden overflow-x-auto rounded-2xl border shadow-sm md:block">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">
          Comparison of {subjects.map((s) => s.name).join(', ')}: facts, fees,
          and features side by side.
        </caption>
        <thead>
          <tr className="border-border bg-panel-secondary sticky top-0 z-20 border-b text-left">
            <th
              scope="col"
              className="bg-panel-secondary sticky left-0 z-30 px-4 py-3 text-xs font-semibold tracking-wide uppercase"
            >
              &nbsp;
            </th>
            {subjects.map((s) => (
              <th
                key={s.id}
                scope="col"
                className="relative px-4 py-4 align-top"
              >
                {canRemove && (
                  <Link
                    href={compareHrefWithout(subjects, s.slug)}
                    aria-label={`Remove ${s.name} from this comparison`}
                    className="text-muted hover:text-navy absolute top-2 right-2"
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
                <div className="flex flex-col items-start gap-2">
                  <ProviderLogo
                    logo={s.logo}
                    name={s.name}
                    size="sm"
                    decorative
                  />
                  <Link
                    href={s.profileHref}
                    className="font-display text-navy text-base font-bold hover:underline"
                  >
                    {s.name}
                  </Link>
                  <VerificationBadge status={s.verificationStatus} />
                  {s.cta && (
                    <a
                      href={s.cta.href}
                      target="_blank"
                      rel={
                        s.cta.isAffiliate
                          ? 'sponsored noopener'
                          : 'nofollow noopener'
                      }
                      className="bg-navy text-background hover:bg-navy-dark inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold"
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
              </th>
            ))}
            {buildYourOwnHref && (
              <th scope="col" className="px-4 py-4 align-middle">
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
          {sections.map((section) => (
            <Fragment key={section.title}>
              <tr className="border-border bg-panel-secondary/60 border-b">
                <th
                  scope="colgroup"
                  colSpan={colCount}
                  className="text-muted px-4 py-2 text-left text-xs font-semibold tracking-wide uppercase"
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
                    className="bg-panel text-muted sticky left-0 px-4 py-3 text-left font-normal"
                  >
                    {row.label}
                  </th>
                  {row.values.map((value, i) => (
                    <td
                      key={subjects[i]?.id ?? i}
                      className="text-navy px-4 py-3"
                    >
                      {value ?? '\u2014'}
                    </td>
                  ))}
                  {buildYourOwnHref && <td />}
                </tr>
              ))}
            </Fragment>
          ))}
          {sections.length === 0 && (
            <tr>
              <td
                colSpan={colCount}
                className="text-muted px-4 py-6 text-center"
              >
                No comparable facts, fees, or features recorded yet for{' '}
                {subjects.map((s) => s.name).join(', ')}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
