import { getCryptoExchanges } from "@/lib/crypto-exchanges/service";
import {
  buildCompareSections,
  toCompareSubjects,
  type CryptoComparisonEntry,
} from "@/lib/crypto-exchanges/comparison";
import { getActiveAffiliateLinksForProviderSlugs } from "@/lib/affiliates/service";
import { CompareTable } from "@/components/compare/CompareTable";
import { CompareMobileCards } from "@/components/compare/CompareMobileCards";
import { CompareSelector } from "@/components/compare/CompareSelector";
import { SectionAffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Compare All Crypto Exchanges Australia \u2014 Fees & Features",
  description:
    "A single, always-current comparison of every crypto exchange in our crypto exchange catalog \u2014 fees, features, and verified facts side by side.",
  path: "/crypto/exchanges/compare",
  image: "/images/og/compare-crypto-exchanges.png",
});

/**
 * The dedicated, curated comparison route from docs/IMPLEMENTATION-PLAN.md
 * §2/§7 (Phase 5) -- unlike domain-specific comparison routes, this always includes every
 * CRYPTO_EXCHANGE provider (no combinatorial URL to mistype), so it's safe
 * to index: the content is real and the set of providers is deterministic
 * rather than an arbitrary user-typed combination.
 */
export default async function CompareCryptoExchangesPage() {
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
    features: offering.features as unknown as CryptoComparisonEntry["features"],
  }));
  const affiliateLinks = await getActiveAffiliateLinksForProviderSlugs(
    rows.map((p) => p.slug)
  );
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
    { name: "Crypto exchanges", path: "/crypto/exchanges/compare" },
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
        {rows.length === 0 ? (
          <p className="text-muted mt-8">
            No crypto exchange providers seeded yet.
          </p>
        ) : (
          <div>
            {selectorPool.length >= 2 && (
              <div className="-mt-8">
                <CompareSelector
                  providers={selectorPool}
                  noun="exchanges"
                  comparisonBasePath="/crypto/exchanges/compare"
                />
              </div>
            )}
            <h2 className="font-display text-navy mt-10 mb-4 text-xl font-bold">
              All {rows.length} exchanges, side by side
            </h2>
            <CompareTable subjects={subjects} sections={sections} />
            <CompareMobileCards subjects={subjects} sections={sections} />
            {hasAffiliateCta && <SectionAffiliateDisclosure />}
          </div>
        )}
      </div>
    </>
  );
}
