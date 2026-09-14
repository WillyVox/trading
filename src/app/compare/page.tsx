import Link from "next/link";
import { getProviders } from "@/lib/providers/service";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { CompareSelector } from "@/components/compare/CompareSelector";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Compare Crypto Exchanges Australia \u2014 Fees & Features",
  description: "Side-by-side Australian crypto exchange comparisons, generated from verified provider data.",
  path: "/compare",
});

export default async function ComparePage() {
  const { items } = await getProviders();
  const trail = breadcrumbTrail([{ name: "Compare", path: "/compare" }]);

  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="Comparisons"
        title="Compare crypto exchanges side-by-side"
        subheading="Live, data-driven comparisons."
      />
      <div className="mx-auto max-w-6xl px-4 py-16">

      <Link
        href="/compare/crypto-exchanges"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-background hover:bg-navy-dark"
      >
        Compare every crypto exchange at once
      </Link>

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
                <td className="px-4 py-3 text-navy">
                  <Link href={`/crypto/exchanges/${p.slug}`} className="hover:underline">
                    {p.name}
                  </Link>
                </td>
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

      <CompareSelector providers={items.map((p: any) => ({ id: p.id, slug: p.slug, name: p.name }))} />
      </div>
    </>
  );
}