import { notFound, redirect } from "next/navigation";
import { CompareTable } from "@/components/compare/CompareTable";
import { CompareMobileCards } from "@/components/compare/CompareMobileCards";
import { CompareSelector } from "@/components/compare/CompareSelector";
import { SectionAffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import { getCryptoExchangeComparison } from "@/lib/crypto-exchanges/comparison";
import { getCryptoExchangeSelectorOptions } from "@/lib/crypto-exchanges/service";
import {
  canonicalCompareSlugMulti,
  parseCompareSlugs,
} from "@/lib/seo/canonical";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { ComparisonEditorial } from "@/components/seo/ComparisonEditorial";
import { RelatedComparisons } from "@/components/seo/RelatedComparisons";
import { TopicClusterLinks } from "@/components/seo/TopicClusterLinks";
import { getCuratedComparison } from "@/lib/seo/curated-comparisons";

import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

const BASE_PATH = "/compare/crypto-exchanges";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = parseCompareSlugs(slug);
  const metadataResult = slugs.length
    ? await publicDatabaseRead("compare.crypto-exchanges.metadata", () =>
        getCryptoExchangeComparison(slugs)
      )
    : { ok: true as const, data: null };
  if (!metadataResult.ok)
    return buildMetadata({
      title: "Comparison temporarily unavailable",
      description: "",
      path: `${BASE_PATH}/${slug}`,
      noIndex: true,
    });
  const comparison = metadataResult.data;
  const names = comparison?.subjects.map((subject) => subject.name) ?? slugs;
  const canonicalSlug = canonicalCompareSlugMulti(slugs);
  const curated = getCuratedComparison("crypto-exchanges", canonicalSlug);
  return buildMetadata({
    title:
      curated?.title ??
      (names.length > 1
        ? `${names.join(" vs ")}: Crypto Exchange Comparison`
        : "Compare crypto exchanges"),
    description:
      curated?.description ??
      (names.length > 1
        ? `Compare ${names.join(", ")} crypto exchanges for Australian users — fees and features side by side.`
        : "Compare crypto exchanges for Australian users."),
    path: `${BASE_PATH}/${canonicalSlug}`,
    noIndex: !curated,
  });
}

export default async function CryptoExchangeComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = parseCompareSlugs(slug);
  if (!slugs.length) notFound();
  const canonicalSlug = canonicalCompareSlugMulti(slugs);
  if (slug !== canonicalSlug) redirect(`${BASE_PATH}/${canonicalSlug}`);

  const comparisonResult = await publicDatabaseRead(
    "compare.crypto-exchanges.detail",
    () => getCryptoExchangeComparison(slugs)
  );
  if (!comparisonResult.ok) {
    return (
      <>
        <PageHero
          eyebrow="Crypto exchange comparison"
          title="Exchange comparison temporarily unavailable"
          subheading="We couldn't load the verified provider dataset required for this comparison."
        />
        <main className="mx-auto max-w-6xl px-4 py-10">
          <DataUnavailable title="Comparison data is temporarily unavailable">
            No incomplete comparison is being shown. Please try again shortly.
          </DataUnavailable>
        </main>
      </>
    );
  }
  const comparison = comparisonResult.data;
  if (!comparison) notFound();
  const { subjects, sections } = comparison;
  const curated = getCuratedComparison("crypto-exchanges", canonicalSlug);
  const poolResult = await publicDatabaseRead(
    "compare.crypto-exchanges.selector",
    getCryptoExchangeSelectorOptions
  );
  const pool = poolResult.ok ? poolResult.data : [];
  const trail = breadcrumbTrail([
    { name: "Compare", path: "/compare" },
    { name: "Crypto exchanges", path: "/compare/crypto-exchanges" },
    {
      name: subjects.map((subject) => subject.name).join(" vs "),
      path: `${BASE_PATH}/${slug}`,
    },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Crypto exchange comparison"
        title={subjects.map((subject) => subject.name).join(" vs ")}
        subheading="Compare verified exchange fees and features side by side."
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        {curated && <ComparisonEditorial comparison={curated} />}
        <CompareTable
          subjects={subjects}
          sections={sections}
          buildYourOwnHref="#build-your-own"
          comparisonBasePath={BASE_PATH}
        />
        <CompareMobileCards
          subjects={subjects}
          sections={sections}
          buildYourOwnHref="#build-your-own"
          comparisonBasePath={BASE_PATH}
        />
        <CompareSelector
          providers={pool}
          initialSelected={slugs}
          noun="exchanges"
          comparisonBasePath={BASE_PATH}
        />
        {curated && (
          <RelatedComparisons
            domain="crypto-exchanges"
            subjectSlug={curated.slugs[0]}
            excludeSlug={curated.slug}
          />
        )}
        {curated && <TopicClusterLinks clusterId="crypto" limit={4} />}
      </div>
      {subjects.some((subject) => subject.cta?.isAffiliate) && (
        <SectionAffiliateDisclosure />
      )}
    </>
  );
}
