import Link from "next/link";
import { cryptoExchangePath } from "@/lib/crypto-exchanges/routes";
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
import { getActiveAffiliateEngagementsForOfferingSlugs } from "@/lib/affiliates/service";
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
      const affiliateEngagements =
        await getActiveAffiliateEngagementsForOfferingSlugs(
          items.map((item) => item.slug)
        );
      return { items, affiliateEngagements };
    }
  );
  const items = itemsResult.ok ? itemsResult.data.items : [];
  const affiliateEngagements = itemsResult.ok
    ? itemsResult.data.affiliateEngagements
    : new Map<string, { offeringSlug: string; providerSlug: string }>();
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
            We couldn't retrieve exchange data right now. No providers are being
            shown rather than presenting an incomplete list.
          </DataUnavailable>
        ) : items.length === 0 ? (
          <p className="text-muted mt-4">No providers seeded yet.</p>
        ) : null}
        {affiliateEngagements.size > 0 && <SectionAffiliateDisclosure />}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((offering) => {
            const p = offering.provider;
            return (
              <Card
                key={offering.id}
                className="hover:border-gold-soft flex h-full flex-col transition-colors"
              >
                <div className="flex items-start gap-4">
                  <ProviderLogo logo={p.logo} name={p.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={cryptoExchangePath(offering.slug)}
                        className="font-display text-navy truncate text-lg font-bold hover:underline"
                      >
                        {offering.name}
                      </Link>
                      <VerificationBadge status={p.verificationStatus} />
                    </div>
                    <p className="text-muted mt-2 line-clamp-3 text-sm">
                      {offering.description ?? p.description}
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                  <Link
                    href={cryptoExchangePath(offering.slug)}
                    className="text-navy focus-visible:outline-navy inline-flex min-h-11 shrink-0 items-center text-sm font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    View profile
                    <span className="ml-1" aria-hidden="true">
                      →
                    </span>
                  </Link>
                  <VisitSite
                    providerSlug={p.slug}
                    offeringSlug={offering.slug}
                    officialWebsite={offering.website ?? p.website}
                    hasActiveAffiliate={affiliateEngagements.has(offering.slug)}
                    placement="crypto-exchange-browse"
                    className="min-w-[9.5rem] sm:min-w-[11rem]"
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
