// src/app/share-trading/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { FeeCategory } from "@prisma/client";
import { getShareTradingPlatformBySlug } from "@/lib/share-trading/service";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { Card } from "@/components/ui/Card";
import { AvailabilitySection } from "@/components/share-trading/AvailabilitySection";
import { OfferingFeatureSection } from "@/components/share-trading/OfferingFeatureSection";
import { OfferingProsCons } from "@/components/share-trading/OfferingProsCons";
import { CustodySection } from "@/components/share-trading/CustodySection";
import {
  OfferingFeeSection,
  type PromotionRow,
} from "@/components/share-trading/PlatformSection";
import type { FeeRowData } from "@/components/share-trading/FeeDisplay";
import {
  formatProductType,
  formatAccountType,
  formatFeeValue,
} from "@/lib/share-trading/labels";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { RelatedComparisons } from "@/components/seo/RelatedComparisons";
import { TopicClusterLinks } from "@/components/seo/TopicClusterLinks";

import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";
import { getActiveAffiliateLink } from "@/lib/affiliates/service";
import { VisitSite } from "@/components/affiliate/VisitSite";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

/** Matches the "1 Oct 2026" style used elsewhere for guide/article dates
 *  (see GuideHeader's local formatDate) -- short form suits a promo's
 *  validFrom/validTo range better than the long "17 September 2026" form. */
function formatPromoDate(date: Date) {
  return date.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await publicDatabaseRead("shareTrading.metadata", () =>
    getShareTradingPlatformBySlug(slug)
  );
  if (!result.ok)
    return buildMetadata({
      title: "Share trading platform",
      description: "",
      path: `/share-trading/${slug}`,
      noIndex: true,
    });
  const offering = result.data;
  if (!offering)
    return buildMetadata({
      title: "Platform not found",
      description: "",
      path: `/share-trading/${slug}`,
      noIndex: true,
    });

  return buildMetadata({
    title: `${offering.name} Australia Review: Markets, Custody & Verified Facts`,
    description:
      offering.description ??
      `${offering.name} share trading platform profile for Australian users \u2014 market access, ownership structures, and source-verified facts.`,
    path: `/share-trading/${slug}`,
    seoTitle: offering.seoTitle,
    seoDescription: offering.seoDescription,
    noIndex: offering.noIndex,
  });
}

export default async function ShareTradingOfferingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offeringResult = await publicDatabaseRead("shareTrading.detail", () =>
    getShareTradingPlatformBySlug(slug)
  );
  if (!offeringResult.ok) {
    return (
      <>
        <PageHero
          eyebrow="Platform profile"
          title="Share trading research temporarily unavailable"
          subheading="We couldn't load this platform's verified research right now."
        />
        <main className="mx-auto max-w-6xl px-4 py-10">
          <DataUnavailable title="Platform data is temporarily unavailable">
            Please try again shortly. We are not showing an empty or not-found
            state because the database could not be queried.
          </DataUnavailable>
        </main>
      </>
    );
  }
  const offering = offeringResult.data;
  if (!offering) notFound();
  const affiliateResult = await publicDatabaseRead(
    "shareTrading.detail.affiliateLink",
    () => getActiveAffiliateLink(offering.provider.slug)
  );
  const hasActiveAffiliate =
    affiliateResult.ok && Boolean(affiliateResult.data);

  const trail = breadcrumbTrail([
    { name: "Share trading", path: "/share-trading" },
    { name: offering.name, path: `/share-trading/${slug}` },
  ]);

  const marketRows = offering.markets.map((m) => ({
    id: m.id,
    label: m.market.name,
    availability: m.availability,
    notes: m.notes,
  }));

  const productRows = offering.products.map((p) => ({
    id: p.id,
    label: formatProductType(p.productType),
    availability: p.availability,
    notes: p.notes,
  }));

  const accountTypeRows = offering.accountTypes.map((a) => ({
    id: a.id,
    label: formatAccountType(a.accountType),
    availability: a.availability,
    notes: a.notes,
  }));

  const custodyRows = offering.custody.map((c) => ({
    id: c.id,
    marketName: c.market?.name ?? null,
    custodyType: c.custodyType,
    custodianName: c.custodianName,
    hinSupported: c.hinSupported,
    verificationStatus: c.verificationStatus,
  }));

  // Standing (non-promotional) fees, grouped/rendered by OfferingFeeSection;
  // promotional rows are split out below instead, per the "never fold a
  // promo into the standing schedule" rule (see OfferingFeeSection's
  // comment and buildFeeRows() in offerings/compare.ts, which excludes
  // promotional rows from the compare table for the same reason).
  const feeRows: (FeeRowData & { category: FeeCategory })[] = offering.fees
    .filter((f) => !f.isPromotional)
    .map((f) => ({
      id: f.id,
      category: f.feeCategory,
      label: f.label,
      calculationBasis: f.calculationBasis,
      flatAmount: f.flatAmount != null ? Number(f.flatAmount) : null,
      percentage: f.percentage != null ? Number(f.percentage) : null,
      currency: f.currency,
      displayValue: f.displayValue,
      notes: f.notes,
      sourceUrl: f.sourceUrl,
      tiers: f.tiers.map((t) => ({
        id: t.id,
        minAmount: Number(t.minAmount),
        maxAmount: t.maxAmount != null ? Number(t.maxAmount) : null,
        flatAmount: t.flatAmount != null ? Number(t.flatAmount) : null,
        percentage: t.percentage != null ? Number(t.percentage) : null,
      })),
    }));

  const promotionRows: PromotionRow[] = offering.fees
    .filter((f) => f.isPromotional)
    .map((f) => ({
      id: f.id,
      label: f.label,
      value: formatFeeValue({
        calculationBasis: f.calculationBasis,
        flatAmount: f.flatAmount,
        percentage: f.percentage,
        currency: f.currency,
        displayValue: f.displayValue,
        notes: f.notes,
        tiers: f.tiers,
      }),
      validFrom: f.validFrom ? formatPromoDate(f.validFrom) : "\u2014",
      validTo: f.validTo ? formatPromoDate(f.validTo) : "\u2014",
      terms: f.promotionalTerms,
    }));

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Share trading platform profile"
        title={`${offering.name} Australia review`}
        subheading={offering.description ?? undefined}
        maxWidth="max-w-4xl"
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <ProviderLogo logo={offering.logo} name={offering.name} size="lg" />
            <div className="min-w-0">
              <h2 className="font-display text-navy truncate text-lg font-bold">
                {offering.name}
              </h2>
              <VerificationBadge status={offering.verificationStatus} />
            </div>
          </div>
          <VisitSite
            providerSlug={offering.provider.slug}
            officialWebsite={offering.website}
            officialWebsiteVerified={
              offering.verificationStatus === "VERIFIED" &&
              Boolean(offering.lastVerifiedAt)
            }
            hasActiveAffiliate={hasActiveAffiliate}
            placement="share-trading-profile"
            className="w-full shrink-0 sm:w-auto"
          />
        </div>
        {hasActiveAffiliate && <AffiliateDisclosure />}

        <Card className="mt-8">
          <h2 className="font-display text-navy mb-1 text-lg font-bold">
            {offering.provider.name}
          </h2>
          <p className="text-muted text-sm">
            {offering.name} is a share trading product offered by{" "}
            {offering.provider.name}.
          </p>
        </Card>

        <AvailabilitySection
          title="Markets"
          emptyLabel="No market access data yet."
          rows={marketRows}
        />

        <AvailabilitySection
          title="Products"
          emptyLabel="No product data yet."
          rows={productRows}
        />

        <CustodySection rows={custodyRows} />

        <AvailabilitySection
          title="Account types"
          emptyLabel="No account type data yet."
          rows={accountTypeRows}
        />

        <OfferingFeeSection fees={feeRows} promotions={promotionRows} />

        {offering.fees.some(
          (fee) => !fee.isPromotional && fee.feeCategory === "FX_CONVERSION"
        ) && (
          <Card className="mt-4">
            <h2 className="font-display text-navy text-lg font-bold">
              Explore currency-conversion costs
            </h2>
            <p className="text-muted mt-2 text-sm leading-6">
              Use the FX Fee Calculator to apply supported verified published FX
              pricing to a hypothetical AUD conversion amount and inspect the
              calculation, assumptions and source.
            </p>
            <Link
              href={`/tools/fx-fee-calculator?platform=${offering.slug}`}
              className="text-blue mt-3 inline-block text-sm font-semibold underline"
            >
              Estimate {offering.name} FX costs →
            </Link>
          </Card>
        )}

        <OfferingFeatureSection features={offering.features} />
        <OfferingProsCons items={offering.prosCons} />

        <Card className="mt-4">
          <h2 className="font-display text-navy text-lg font-bold">
            How this review is built
          </h2>
          <p className="text-muted mt-2 text-sm leading-6">
            Trading Guide does not assign this platform an overall score or
            winner label. The review is assembled from structured market,
            product, custody, feature and fee records, with unknown or variable
            information kept visible rather than treated as zero.
          </p>
          <Link
            href="/methodology"
            className="text-blue mt-3 inline-block text-sm font-semibold underline"
          >
            Read our research methodology →
          </Link>
        </Card>

        <RelatedComparisons
          domain="trading-platforms"
          subjectSlug={offering.slug}
        />
        <TopicClusterLinks
          clusterId="share-trading"
          excludeHref={`/share-trading/${offering.slug}`}
        />

        <Card className="mt-4">
          <p className="text-muted text-xs">
            Trading Guide publishes structured provider facts only after source
            review. See{" "}
            <Link href="/methodology" className="underline">
              our methodology
            </Link>{" "}
            for how availability, fees, custody and platform features are
            verified.
          </p>
        </Card>
      </div>
    </>
  );
}
