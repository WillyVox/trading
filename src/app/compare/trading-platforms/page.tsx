import { getAllShareTradingPlatformsForCompare } from "@/lib/share-trading/service";
import {
  buildShareTradingCompareSections,
  toCompareSubjects,
} from "@/lib/share-trading/comparison";
import { CompareTable } from "@/components/compare/CompareTable";
import { CompareMobileCards } from "@/components/compare/CompareMobileCards";
import { CompareHubMode } from "@/components/compare/CompareHubMode";
import { SectionAffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CuratedComparisonList } from "@/components/seo/CuratedComparisonList";

import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";
import { getActiveAffiliateEngagementsForOfferingSlugs } from "@/lib/affiliates/service";
import { getBrokerageOfferings } from "@/lib/tools/brokerage/service";
import { RepresentativeAsxCostComparison } from "@/components/compare/RepresentativeAsxCostComparison";
import { RepresentativeUsCostComparison } from "@/components/compare/RepresentativeUsCostComparison";
import { getFxOfferings } from "@/lib/tools/fx/service";

export const metadata = buildMetadata({
  title:
    "Compare Share Trading Platforms Australia \u2014 Markets, Products & Custody",
  description:
    "A single, always-current comparison of every share trading platform in our share trading catalog \u2014 market access, products, custody arrangements, and account types side by side.",
  path: "/compare/trading-platforms",
});

/**
 * The share trading counterpart to /compare/crypto-exchanges, unlocked by
 * the unified compare engine (see shared comparison UI types). Same rationale
 * for being indexable: it always includes every active offering, so the set
 * is deterministic and the content is real, rather than an arbitrary
 * user-typed combination the way domain-specific comparison routes is.
 *
 * No OG image yet -- unlike the crypto page there's no
 * /images/og/compare-trading-platforms.png generated, and pointing at a
 * missing asset is worse than falling back to the site default. Add it via
 * scripts/generate-page-og-images.ts and set `image` here.
 */
export default async function CompareTradingPlatformsPage() {
  const offeringsResult = await publicDatabaseRead(
    "compare.shareTrading.index",
    async () => {
      const offerings = await getAllShareTradingPlatformsForCompare();
      const affiliateEngagements =
        await getActiveAffiliateEngagementsForOfferingSlugs(
          offerings.map((offering) => offering.slug)
        );
      const [brokerageOfferings, fxOfferings] = await Promise.all([
        getBrokerageOfferings(),
        getFxOfferings(),
      ]);
      return { offerings, affiliateEngagements, brokerageOfferings, fxOfferings };
    }
  );
  const offerings = offeringsResult.ok ? offeringsResult.data.offerings : [];
  const affiliateEngagements = offeringsResult.ok
    ? offeringsResult.data.affiliateEngagements
    : new Map<string, { offeringSlug: string; providerSlug: string }>();
  const brokerageOfferings = offeringsResult.ok
    ? offeringsResult.data.brokerageOfferings
    : [];
  const fxOfferings = offeringsResult.ok ? offeringsResult.data.fxOfferings : [];
  const subjects = toCompareSubjects(offerings, affiliateEngagements);
  const sections = buildShareTradingCompareSections(offerings);
  // Always false today -- the offering domain has no affiliate tier (see
  // toCompareSubjects's comment in src/lib/share-trading/comparison.ts). Kept
  // as a real check, not hardcoded false, so this page picks up a
  // disclosure automatically if that tier is ever added.
  const hasAffiliateCta = subjects.some((s) => s.cta?.isAffiliate);

  // Built from the offerings already loaded above -- no second query.
  const selectorPool = offerings.map((offering) => ({
    id: offering.id,
    slug: offering.slug,
    name: offering.name,
  }));

  const trail = breadcrumbTrail([
    { name: "Compare", path: "/compare" },
    { name: "Share trading platforms", path: "/compare/trading-platforms" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Platform comparison"
        title="Share trading platforms, compared"
        subheading="What's tradable. Who holds it."
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        {!offeringsResult.ok ? (
          <DataUnavailable title="Platform comparison is temporarily unavailable">
            We couldn't load the provider dataset required for this comparison.
            No incomplete comparison is being shown.
          </DataUnavailable>
        ) : offerings.length === 0 ? (
          <p className="text-muted mt-8">
            No share trading platforms seeded yet.
          </p>
        ) : (
          <div>
            <CompareHubMode
              providers={selectorPool}
              noun="platforms"
              comparisonBasePath="/compare/trading-platforms"
            >
              <div>
                <div className="mb-5">
                  <h3 className="font-display text-navy text-xl font-bold">
                    All {offerings.length} platforms, side by side
                  </h3>
                  <p className="text-muted mt-1 text-sm">
                    Compare markets, products, ownership structures, features
                    and costs using source-linked research.
                  </p>
                </div>
                <CompareTable subjects={subjects} sections={sections} />
                <CompareMobileCards subjects={subjects} sections={sections} />
                <RepresentativeAsxCostComparison offerings={brokerageOfferings} />
                <RepresentativeUsCostComparison offerings={brokerageOfferings} fxOfferings={fxOfferings} />
              </div>
            </CompareHubMode>
            {hasAffiliateCta && <SectionAffiliateDisclosure />}
            <CuratedComparisonList domain="trading-platforms" />
          </div>
        )}
      </div>
    </>
  );
}
