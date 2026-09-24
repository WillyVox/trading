import Link from "next/link";
import { getCryptoExchanges } from "@/lib/crypto-exchanges/service";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { TopicClusterLinks } from "@/components/seo/TopicClusterLinks";
import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";
import { getActiveAffiliateLinksForProviderSlugs } from "@/lib/affiliates/service";
import { VisitSite } from "@/components/affiliate/VisitSite";
import { SectionAffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

export const metadata = buildMetadata({
  title: "Crypto Exchanges in Australia \u2014 Compare Platforms",
  description:
    "Browse Australian crypto exchange profiles with verified facts, fees, and sources.",
  path: "/crypto/exchanges",
});

export default async function ExchangesPage() {
  const itemsResult = await publicDatabaseRead(
    "getCryptoExchanges.index",
    async () => {
      const items = await getCryptoExchanges();
      const affiliateLinks = await getActiveAffiliateLinksForProviderSlugs(
        items.map((item) => item.provider.slug)
      );
      return { items, affiliateLinks };
    }
  );
  const items = itemsResult.ok ? itemsResult.data.items : [];
  const affiliateLinks = itemsResult.ok
    ? itemsResult.data.affiliateLinks
    : new Map<string, { partnerSlug: string }>();
  const trail = breadcrumbTrail([
    { name: "Crypto", path: "/crypto" },
    { name: "Exchanges", path: "/crypto/exchanges" },
  ]);

  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="Exchange profiles"
        title="Cryptocurency exchanges in Australia"
        subheading="Verified fees, features, and regulatory status for every exchange we cover."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {!itemsResult.ok ? (
          <DataUnavailable title="Crypto exchange research is temporarily unavailable">
            We couldn&lsquo;t retrieve exchange data right now. No providers are
            being shown rather than presenting an incomplete list.
          </DataUnavailable>
        ) : items.length === 0 ? (
          <p className="text-muted mt-4">No providers seeded yet.</p>
        ) : null}
        {affiliateLinks.size > 0 && <SectionAffiliateDisclosure />}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((offering) => {
            const p = offering.provider;
            return (
              <Card
                key={p.id}
                className="hover:border-gold-soft flex h-full flex-col transition-colors"
              >
                <div className="flex items-start gap-4">
                  <ProviderLogo logo={p.logo} name={p.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/crypto/exchanges/${p.slug}`}
                        className="font-display text-navy truncate text-lg font-bold hover:underline"
                      >
                        {p.name}
                      </Link>
                      <VerificationBadge status={p.verificationStatus} />
                    </div>
                    <p className="text-muted mt-2 line-clamp-3 text-sm">
                      {p.description}
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center">
                  <Link
                    href={`/crypto/exchanges/${p.slug}`}
                    className="border-border text-navy hover:bg-panel-secondary inline-flex min-h-11 w-full items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold sm:flex-1"
                  >
                    View profile
                  </Link>
                  <VisitSite
                    providerSlug={p.slug}
                    officialWebsite={offering.website ?? p.website}
                    hasActiveAffiliate={affiliateLinks.has(p.slug)}
                    placement="crypto-exchange-browse"
                    className="w-full sm:flex-[1.25]"
                  />
                </div>
              </Card>
            );
          })}
        </div>
        <TopicClusterLinks clusterId="crypto" excludeHref="/crypto/exchanges" />
      </div>
    </>
  );
}
