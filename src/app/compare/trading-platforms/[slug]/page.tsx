import { notFound, redirect } from "next/navigation";
import { CompareTable } from "@/components/compare/CompareTable";
import { CompareMobileCards } from "@/components/compare/CompareMobileCards";
import { CompareSelector } from "@/components/compare/CompareSelector";
import { SectionAffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import { getShareTradingComparison } from "@/lib/share-trading/comparison";
import { getShareTradingSelectorOptions } from "@/lib/share-trading/service";
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
import { getCuratedComparison } from "@/lib/seo/curated-comparisons";

const BASE_PATH = "/compare/trading-platforms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = parseCompareSlugs(slug);
  const comparison = slugs.length
    ? await getShareTradingComparison(slugs)
    : null;
  const names = comparison?.subjects.map((subject) => subject.name) ?? slugs;
  const canonicalSlug = canonicalCompareSlugMulti(slugs);
  const curated = getCuratedComparison("trading-platforms", canonicalSlug);
  return buildMetadata({
    title:
      curated?.title ??
      (names.length > 1
        ? `${names.join(" vs ")}: Share Trading Platform Comparison`
        : "Compare share trading platforms"),
    description:
      curated?.description ??
      (names.length > 1
        ? `Compare ${names.join(", ")} share trading platforms — markets, products, custody and costs side by side.`
        : "Compare share trading platforms in Australia."),
    path: `${BASE_PATH}/${canonicalSlug}`,
    noIndex: !curated,
  });
}

export default async function ShareTradingComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = parseCompareSlugs(slug);
  if (!slugs.length) notFound();
  const canonicalSlug = canonicalCompareSlugMulti(slugs);
  if (slug !== canonicalSlug) redirect(`${BASE_PATH}/${canonicalSlug}`);

  const comparison = await getShareTradingComparison(slugs);
  if (!comparison) notFound();
  const { subjects, sections } = comparison;
  const curated = getCuratedComparison("trading-platforms", canonicalSlug);
  const pool = await getShareTradingSelectorOptions();
  const trail = breadcrumbTrail([
    { name: "Compare", path: "/compare" },
    { name: "Trading platforms", path: "/compare/trading-platforms" },
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
        eyebrow="Share trading comparison"
        title={subjects.map((subject) => subject.name).join(" vs ")}
        subheading="Compare markets, products, custody and costs side by side."
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
          noun="platforms"
          comparisonBasePath={BASE_PATH}
        />
        {curated && (
          <RelatedComparisons
            domain="trading-platforms"
            subjectSlug={curated.slugs[0]}
            excludeSlug={curated.slug}
          />
        )}
      </div>
      {subjects.some((subject) => subject.cta?.isAffiliate) && (
        <SectionAffiliateDisclosure />
      )}
    </>
  );
}
