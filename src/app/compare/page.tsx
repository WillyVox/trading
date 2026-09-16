import Link from "next/link";
import { getProviders } from "@/lib/providers/service";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { CompareSelector } from "@/components/compare/CompareSelector";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Compare Crypto Exchanges Australia \u2014 Fees & Features",
  description:
    "Side-by-side Australian crypto exchange comparisons, generated from verified provider data.",
  path: "/compare",
  image: "/images/og/compare.png",
});

export const dynamic = "force-dynamic";

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
        graphic="compare"
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        <Link
          href="/compare/crypto-exchanges"
          className="bg-navy text-background hover:bg-navy-dark mt-6 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          Compare every crypto exchange at once
        </Link>

        <div className="border-border bg-panel mt-8 overflow-hidden rounded-2xl border shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-border bg-panel-secondary text-muted border-b text-left">
                <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                  Provider
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((p: any) => (
                <tr key={p.id} className="border-border border-b last:border-0">
                  <td className="text-navy px-4 py-3">
                    <Link
                      href={`/crypto/exchanges/${p.slug}`}
                      className="hover:underline"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <VerificationBadge status={p.verificationStatus} />
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-muted px-4 py-6 text-center">
                    No providers seeded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <CompareSelector
          providers={items.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
          }))}
        />
      </div>
    </>
  );
}
