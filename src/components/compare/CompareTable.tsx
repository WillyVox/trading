import Link from "next/link";
import { Fragment } from "react";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import type { ComparisonProvider, ComparisonSection } from "@/lib/providers/compare";

/**
 * Desktop/tablet comparison table -- one column per provider, one row per
 * fact/fee/feature. Hidden below the `md` breakpoint; CompareMobileCards
 * renders the same data as stacked per-provider cards for small screens
 * (see docs/IMPLEMENTATION-PLAN.md §6/Phase 5: "mobile-card fallback
 * pattern"). Horizontally scrollable so a 3+-way comparison never breaks
 * the page layout instead of capping how many providers can be compared.
 */
export function CompareTable({
  providers,
  sections,
}: {
  providers: ComparisonProvider[];
  sections: ComparisonSection[];
}) {
  return (
    <div className="hidden overflow-x-auto rounded-2xl border border-border bg-panel shadow-sm md:block">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-panel-secondary text-left text-muted">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">&nbsp;</th>
            {providers.map((p) => (
              <th key={p.id} className="px-4 py-3 align-bottom">
                <Link href={`/crypto/exchanges/${p.slug}`} className="font-display text-base font-bold text-navy hover:underline">
                  {p.name}
                </Link>
                <div className="mt-1">
                  <VerificationBadge status={p.verificationStatus} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <Fragment key={section.title}>
              <tr className="border-b border-border bg-panel-secondary/60">
                <th
                  colSpan={providers.length + 1}
                  className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted"
                >
                  {section.title}
                </th>
              </tr>
              {section.rows.map((row) => (
                <tr key={row.key} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted">{row.label}</td>
                  {row.values.map((value, i) => (
                    <td key={providers[i]?.id ?? i} className="px-4 py-3 text-navy">
                      {value ?? "\u2014"}
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
          {sections.length === 0 && (
            <tr>
              <td colSpan={providers.length + 1} className="px-4 py-6 text-center text-muted">
                No comparable facts, fees, or features recorded yet for {providers.map((p) => p.name).join(", ")}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
