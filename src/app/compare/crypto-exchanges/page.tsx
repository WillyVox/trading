import { getCryptoExchanges } from "@/lib/crypto-exchanges/service";
import {
  buildCompareSections,
  toCompareSubjects,
  type CryptoComparisonEntry,
} from "@/lib/crypto-exchanges/comparison";
import { getActiveAffiliateLinksForProviderSlugs } from "@/lib/affiliates/service";
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

export const metadata = buildMetadata({
  title: "Compare All Crypto Exchanges Australia \u2014 Fees & Features",
  description:
    "A single, always-current comparison of every crypto exchange in our crypto exchange catalog \u2014 fees, features, and verified facts side by side.",
  path: "/compare/crypto-exchanges",
  image: "/images/og/compare-crypto-exchanges.png",
});

/**
 * The dedicated, curated comparison route from docs/IMPLEMENTATION-PLAN.md
 * §2/§7 (Phase 5) -- unlike domain-specific comparison routes, this always includes every
 * CRYPTO_EXCHANGE provider (no combinatorial URL to mistype), so it&lsquo;s safe
 * to index: the content is real and the set of providers is deterministic
 * rather than an arbitrary user-typed combination.
 */
export default async function CompareCryptoExchangesPage() {
  const comparisonResult = await publicDatabaseRead(
    "compare.crypto.index",
    async () => {
      const cryptoOfferings = await getCryptoExchanges();
      const rows: CryptoComparisonEntry[] = cryptoOfferings.map((offering) => ({
        id: offering.id,
        slug: offering.provider.slug,
        name: offering.provider.name,
        verificationStatus: offering.verificationStatus,
        logo: offering.logo ?? offering.provider.logo,
        website: offering.website ?? offering.provider.website,
        facts: offering.provider.facts,
        fees: offering.fees.map((fee) => ({
          label: fee.label,
          displayValue: fee.displayValue,
        })),
        features:
          offering.features as unknown as CryptoComparisonEntry["features"],
      }));
      const affiliateLinks = await getActiveAffiliateLinksForProviderSlugs(
        rows.map((p) => p.slug)
      );
      return { cryptoOfferings, rows, affiliateLinks };
    }
  );
  const cryptoOfferings = comparisonResult.ok
    ? comparisonResult.data.cryptoOfferings
    : [];
  const rows = comparisonResult.ok ? comparisonResult.data.rows : [];
  const affiliateLinks = comparisonResult.ok
    ? comparisonResult.data.affiliateLinks
    : new Map();
  const subjects = toCompareSubjects(rows, affiliateLinks);
  const sections = buildCompareSections(rows);
  const hasAffiliateCta = subjects.some((s) => s.cta?.isAffiliate);

  // Built from the offerings already loaded above -- no second query. Same
  // identity (public provider slug/name) the compare URLs use.
  const selectorPool = cryptoOfferings.map((offering) => ({
    id: offering.id,
    slug: offering.provider.slug,
    name: offering.provider.name,
  }));

  const trail = breadcrumbTrail([
    { name: "Compare", path: "/compare" },
    { name: "Crypto exchanges", path: "/compare/crypto-exchanges" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Exchange comparison"
        title="Crypto exchange fees and features, compared"
        subheading="See fees, spreads, and verification requirements side-by-side."
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        {!comparisonResult.ok ? (
          <DataUnavailable title="Crypto comparison is temporarily unavailable">
            We couldn&lsquo;t load the exchange dataset required for this comparison.
            No incomplete comparison is being shown.
          </DataUnavailable>
        ) : rows.length === 0 ? (
          <p className="text-muted mt-8">
            No crypto exchange providers seeded yet.
          </p>
        ) : (
          <div>
            <CompareHubMode
              providers={selectorPool}
              noun="exchanges"
              comparisonBasePath="/compare/crypto-exchanges"
            >
              <div>
                <div className="mb-5">
                  <h3 className="font-display text-navy text-xl font-bold">
                    All {rows.length} exchanges, side by side
                  </h3>
                  <p className="text-muted mt-1 text-sm">
                    Compare fees, features and recorded facts using
                    source-linked research.
                  </p>
                </div>
                <CompareTable subjects={subjects} sections={sections} />
                <CompareMobileCards subjects={subjects} sections={sections} />
              </div>
            </CompareHubMode>
            {hasAffiliateCta && <SectionAffiliateDisclosure />}
            <CuratedComparisonList domain="crypto-exchanges" />
          </div>
        )}
      </div>
    </>
  );
}
