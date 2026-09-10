import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import type { ComparisonProvider, ComparisonSection } from "@/lib/providers/compare";

/**
 * Small-screen counterpart to CompareTable -- a wide comparison table
 * degrades badly below `md`, so each provider gets its own scrollable card
 * with the same fact/fee/feature rows instead (see docs/IMPLEMENTATION-PLAN.md
 * §6, "mobile-card fallback pattern"). Hidden at `md` and above.
 */
export function CompareMobileCards({
  providers,
  sections,
}: {
  providers: ComparisonProvider[];
  sections: ComparisonSection[];
}) {
  return (
    <div className="space-y-4 md:hidden">
      {providers.map((p, i) => (
        <Card key={p.id}>
          <div className="flex items-center justify-between">
            <Link href={`/crypto/exchanges/${p.slug}`} className="font-display text-lg font-bold text-navy hover:underline">
              {p.name}
            </Link>
            <VerificationBadge status={p.verificationStatus} />
          </div>

          {sections.map((section) => (
            <div key={section.title} className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{section.title}</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {section.rows.map((row) => (
                  <li key={row.key} className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted">{row.label}</span>
                    <span className="text-navy">{row.values[i] ?? "\u2014"}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {sections.length === 0 && <p className="mt-4 text-sm text-muted">No comparable facts, fees, or features recorded yet.</p>}
        </Card>
      ))}
    </div>
  );
}
