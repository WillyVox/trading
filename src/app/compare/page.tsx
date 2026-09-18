import Link from "next/link";
import { getProviders } from "@/lib/providers/service";
import { ProviderType } from "@prisma/client";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { CompareSelector } from "@/components/compare/CompareSelector";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Compare Trading Platforms & Crypto Exchanges Australia",
  description:
    "Side-by-side Australian comparisons for share trading platforms and crypto exchanges, generated from verified provider data.",
  path: "/compare",
  image: "/images/og/compare.png",
});

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  // Scoped to CRYPTO_EXCHANGE only -- this page's live table/selector links
  // every row to /crypto/exchanges/[slug], so an unfiltered getProviders()
  // call would mis-link any BROKER/TRADING_PLATFORM provider record (e.g.
  // Commonwealth Bank, CMC Markets) straight to a 404. Share trading
  // platforms have their own comparison engine at /compare/trading-platforms
  // (built on the Offering domain, not Provider), linked below instead of
  // duplicated into this table.
  const { items } = await getProviders({
    providerType: ProviderType.CRYPTO_EXCHANGE,
  });
  const trail = breadcrumbTrail([{ name: "Compare", path: "/compare" }]);

  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="Comparisons"
        title="Compare trading platforms & crypto exchanges"
        subheading="Live, data-driven comparisons across share trading and crypto."
        graphic="compare"
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <div className="font-display text-navy text-xl font-bold">
              Share trading platforms
            </div>
            <p className="text-muted mt-1.5 text-sm">
              Market access, products, and custody arrangements side by side for
              every share trading platform in our Offering domain.
            </p>
            <Link
              href="/compare/trading-platforms"
              className="bg-navy text-background hover:bg-navy-dark mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Compare trading platforms
            </Link>
          </Card>
          <Card>
            <div className="font-display text-navy text-xl font-bold">
              Crypto exchanges
            </div>
            <p className="text-muted mt-1.5 text-sm">
              Fees and features side by side for every crypto exchange we cover,
              or build your own comparison below.
            </p>
            <Link
              href="/compare/crypto-exchanges"
              className="bg-navy text-background hover:bg-navy-dark mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Compare every crypto exchange at once
            </Link>
          </Card>
        </div>

        <h2 className="font-display text-navy mt-14 text-2xl font-bold">
          Build your own crypto exchange comparison
        </h2>
        <p className="text-muted mt-1.5 text-sm">
          Tick two or more exchanges below to jump straight to a side-by-side
          view.
        </p>

        <div className="border-border bg-panel mt-6 overflow-hidden rounded-2xl border shadow-sm">
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
