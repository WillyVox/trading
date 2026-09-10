import { getProviders } from "@/lib/providers/service";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Compare Crypto Exchanges Australia \u2014 Fees & Features",
  description: "Side-by-side Australian crypto exchange comparisons, generated from verified provider data.",
  path: "/compare",
});

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const { items } = await getProviders();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Eyebrow>Compare</Eyebrow>
      <h1 className="mt-4 font-display text-5xl font-extrabold text-navy">Compare Exchanges</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Comparisons are generated live from the Provider domain — no data duplicated into
        compare-specific tables.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-panel shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-panel-secondary text-left text-muted">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Provider</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p: any) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-navy">{p.name}</td>
                <td className="px-4 py-3"><VerificationBadge status={p.verificationStatus} /></td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-center text-muted">No providers seeded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
