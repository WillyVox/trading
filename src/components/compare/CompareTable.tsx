import Link from "next/link";
import { Fragment } from "react";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import type { ComparisonSection, ComparisonSubject } from "@/lib/compare/types";

/**
 * Desktop/tablet comparison table -- one column per subject, one row per
 * fact/fee/feature (crypto) or market/product/custody/account type (share
 * trading). Domain-agnostic: takes ComparisonSubject[] rather than a raw
 * Provider[], so it doesn't need to know which domain it's rendering --
 * see src/lib/compare/types.ts and the compare-engine-unification
 * analysis. Hidden below the `md` breakpoint; CompareMobileCards renders
 * the same data as stacked per-subject cards for small screens.
 * Horizontally scrollable so a 3+-way comparison never breaks the page
 * layout instead of capping how many subjects can be compared.
 */
export function CompareTable({
  subjects,
  sections,
}: {
  subjects: ComparisonSubject[];
  sections: ComparisonSection[];
}) {
  return (
    <div className="border-border bg-panel hidden overflow-x-auto rounded-2xl border shadow-sm md:block">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-border bg-panel-secondary text-muted border-b text-left">
            <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
              &nbsp;
            </th>
            {subjects.map((s) => (
              <th key={s.id} className="px-4 py-3 align-bottom">
                <Link
                  href={s.profileHref}
                  className="font-display text-navy text-base font-bold hover:underline"
                >
                  {s.name}
                </Link>
                <div className="mt-1">
                  <VerificationBadge status={s.verificationStatus} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <Fragment key={section.title}>
              <tr className="border-border bg-panel-secondary/60 border-b">
                <th
                  colSpan={subjects.length + 1}
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
                  <td className="text-muted px-4 py-3">{row.label}</td>
                  {row.values.map((value, i) => (
                    <td
                      key={subjects[i]?.id ?? i}
                      className="text-navy px-4 py-3"
                    >
                      {value ?? "\u2014"}
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
          {sections.length === 0 && (
            <tr>
              <td
                colSpan={subjects.length + 1}
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
  );
}
