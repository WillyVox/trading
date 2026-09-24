import { notFound } from "next/navigation";
import Link from "next/link";
import { getRelatedContentForProvider } from "@/lib/providers/service";
import { getCryptoExchangeByPublicSlug } from "@/lib/crypto-exchanges/service";
import { getActiveAffiliateLink } from "@/lib/affiliates/service";
import {
  groupFeatures,
  type CryptoFeatureRow,
} from "@/lib/crypto-exchanges/features";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
// import { CompareSelector } from "@/components/compare/CompareSelector";
import { Card } from "@/components/ui/Card";
import { CryptoExchangeFeatureSection } from "@/components/crypto-exchanges/FeatureSection";
import { CryptoExchangeProsCons } from "@/components/crypto-exchanges/ProsCons";
import { RelatedGuides } from "@/components/guide/RelatedGuides";
import { RelatedNews } from "@/components/providers/RelatedNews";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { VisitSite } from "@/components/affiliate/VisitSite";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import { RelatedComparisons } from "@/components/seo/RelatedComparisons";
import { TopicClusterLinks } from "@/components/seo/TopicClusterLinks";

import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

function formatOfferingType(type: string) {
  const label = type.replace(/_/g, " ").toLowerCase();
  return `${label.charAt(0).toUpperCase()}${label.slice(1)} profile`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await publicDatabaseRead("cryptoExchange.metadata", () =>
    getCryptoExchangeByPublicSlug(slug)
  );
  if (!result.ok)
    return buildMetadata({
      title: "Crypto exchange",
      description: "",
      path: `/crypto/exchanges/${slug}`,
      noIndex: true,
    });
  const offering = result.data;
  const provider = offering?.provider;
  if (!provider)
    return buildMetadata({
      title: "Exchange not found",
      description: "",
      path: `/crypto/exchanges/${slug}`,
      noIndex: true,
    });

  return buildMetadata({
    title: `${provider.name} Australia Review: Fees, Features & Verified Facts`,
    description:
      provider.description ??
      `${provider.name} crypto exchange profile for Australian users \u2014 fees, features, and source-verified facts.`,
    path: `/crypto/exchanges/${slug}`,
    seoTitle: provider.seoTitle,
    seoDescription: provider.seoDescription,
    noIndex: provider.noIndex,
  });
}

export default async function ExchangeProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offeringResult = await publicDatabaseRead("cryptoExchange.detail", () =>
    getCryptoExchangeByPublicSlug(slug)
  );
  if (!offeringResult.ok) {
    return (
      <>
        <PageHero
          eyebrow="Exchange profile"
          title="Crypto exchange research temporarily unavailable"
          subheading="We couldn't load this exchange's verified research right now."
        />
        <main className="mx-auto max-w-6xl px-4 py-10">
          <DataUnavailable title="Exchange data is temporarily unavailable">
            Please try again shortly. We are not showing an empty or not-found
            state because the database could not be queried.
          </DataUnavailable>
        </main>
      </>
    );
  }
  const offering = offeringResult.data;
  if (!offering) notFound();
  const provider = offering.provider;
  // The comparable-providers pool for the (currently disabled) CompareSelector
  // was fetched here but never read. If that selector is re-enabled, use the
  // lightweight getCryptoExchangeSelectorOptions() rather than loading every
  // exchange with all its facts/fees/features just to build a picker.
  const relatedResult = await publicDatabaseRead(
    "cryptoExchange.related",
    async () => {
      const [link, relatedContent] = await Promise.all([
        getActiveAffiliateLink(slug),
        getRelatedContentForProvider(provider.id),
      ]);
      return { link, relatedContent };
    }
  );
  const link = relatedResult.ok ? relatedResult.data.link : null;
  const relatedContent = relatedResult.ok
    ? relatedResult.data.relatedContent
    : { guides: [], news: [] };

  const featureGroups = groupFeatures(
    offering.features as unknown as CryptoFeatureRow[]
  );

  const trail = breadcrumbTrail([
    { name: "Exchanges", path: "/crypto/exchanges" },
    { name: provider.name, path: `/crypto/exchanges/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow={formatOfferingType(offering.offeringType)}
        title={`${provider.name} Australia review`}
        subheading={provider.description ?? undefined}
        maxWidth="max-w-4xl"
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <ProviderLogo logo={provider.logo} name={provider.name} size="lg" />
            <div className="min-w-0">
              <h2 className="font-display text-navy truncate text-lg font-bold">
                {provider.name}
              </h2>
              <VerificationBadge status={provider.verificationStatus} />
            </div>
          </div>
          <VisitSite
            providerSlug={provider.slug}
            officialWebsite={offering.website ?? provider.website}
            officialWebsiteVerified={(offering.website ? offering.verificationStatus === "VERIFIED" && Boolean(offering.lastVerifiedAt) : provider.verificationStatus === "VERIFIED" && Boolean(provider.lastVerifiedAt))}
            hasActiveAffiliate={Boolean(link)}
            placement="crypto-exchange-profile"
            className="w-full shrink-0 sm:w-auto"
          />
        </div>
        {link && <AffiliateDisclosure />}

        <Card className="mt-8">
          <h2 className="font-display text-navy mb-4 text-lg font-bold">
            Facts
          </h2>
          <ul className="space-y-2 text-sm">
            {provider.facts.map((f) => (
              <li
                key={f.id}
                className="border-border flex justify-between border-b pb-2"
              >
                <span className="text-muted">{f.label}</span>
                <span>{f.value}</span>
              </li>
            ))}
            {provider.facts.length === 0 && (
              <li className="text-muted">No verified facts yet.</li>
            )}
          </ul>
        </Card>

        <Card className="mt-4">
          <h2 className="font-display text-navy mb-4 text-lg font-bold">
            Fees
          </h2>
          <ul className="space-y-2 text-sm">
            {offering.fees.map((f) => (
              <li
                key={f.id}
                className="border-border flex justify-between border-b pb-2"
              >
                <span className="text-muted">{f.label}</span>
                <span>{f.displayValue ?? "Not verified"}</span>
              </li>
            ))}
            {offering.fees.length === 0 && (
              <li className="text-muted">No fee data yet.</li>
            )}
          </ul>
        </Card>

        <CryptoExchangeFeatureSection
          title="Products & trading"
          emptyLabel="No product/trading feature data yet."
          features={featureGroups.products}
        />

        <CryptoExchangeFeatureSection
          title="Deposits & withdrawals"
          emptyLabel="No deposit/withdrawal method data yet."
          features={featureGroups.deposits}
        />

        <CryptoExchangeFeatureSection
          title="Security"
          emptyLabel="No security data yet."
          features={featureGroups.security}
        />

        <CryptoExchangeProsCons items={offering.prosCons} />

        <Card className="mt-4">
          <h2 className="font-display text-navy text-lg font-bold">
            How this review is built
          </h2>
          <p className="text-muted mt-2 text-sm leading-6">
            Trading Guide does not assign this exchange an overall score or
            winner label. The page is assembled from structured provider facts,
            fee records and feature evidence, and unresolved or variable
            information is not converted into a zero-cost claim.
          </p>
          <Link
            href="/methodology"
            className="text-blue mt-3 inline-block text-sm font-semibold underline"
          >
            Read our research methodology →
          </Link>
        </Card>

        <RelatedComparisons
          domain="crypto-exchanges"
          subjectSlug={provider.slug}
        />
        <TopicClusterLinks
          clusterId="crypto"
          excludeHref={`/crypto/exchanges/${provider.slug}`}
        />

        {offering.cryptoAssets.length > 0 && (
          <Card className="mt-4">
            <h2 className="font-display text-navy mb-4 text-lg font-bold">
              Supported assets
            </h2>
            <div className="flex flex-wrap gap-2 text-sm">
              {offering.cryptoAssets.map((pa) => (
                <Link
                  key={pa.asset.id}
                  href={`/crypto/${pa.asset.slug}`}
                  className="border-border hover:border-gold-soft rounded-full border px-3 py-1"
                >
                  {pa.asset.symbol}
                </Link>
              ))}
            </div>
          </Card>
        )}

        {/* The hero's compact AffiliateCTA above renders showDisclosure={false} --
          this is the one AffiliateCTA on the page that actually shows the
          disclosure, so it must stay true rather than false. */}
        {/* {link && <AffiliateCTA partnerSlug={slug} providerName={provider.name} showDisclosure={true} />} */}

        <RelatedGuides guides={relatedContent.guides} />
        <RelatedNews items={relatedContent.news} />
      </div>
    </>
  );
}
