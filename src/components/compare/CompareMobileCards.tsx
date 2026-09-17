import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import type { ComparisonSection, ComparisonSubject } from "@/lib/compare/types";

/**
 * Small-screen counterpart to CompareTable -- a wide comparison table
 * degrades badly below `md`, so each subject gets its own scrollable card
 * with the same rows instead. Domain-agnostic for the same reason
 * CompareTable is -- see src/lib/compare/types.ts. Hidden at `md` and
 * above.
 */
export function CompareMobileCards({
  subjects,
  sections,
}: {
  subjects: ComparisonSubject[];
  sections: ComparisonSection[];
}) {
  return (
    <div className="space-y-4 md:hidden">
      {subjects.map((s, i) => (
        <Card key={s.id}>
          <div className="flex items-center justify-between">
            <Link
              href={s.profileHref}
              className="font-display text-navy text-lg font-bold hover:underline"
            >
              {s.name}
            </Link>
            <VerificationBadge status={s.verificationStatus} />
          </div>

          {sections.map((section) => (
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
                      {row.values[i] ?? "\u2014"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {sections.length === 0 && (
            <p className="text-muted mt-4 text-sm">
              No comparable facts, fees, or features recorded yet.
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
