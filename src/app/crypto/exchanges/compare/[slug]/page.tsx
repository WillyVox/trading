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

const BASE_PATH = "/crypto/exchanges/compare";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = parseCompareSlugs(slug);
  const comparison = slugs.length
    ? await getCryptoExchangeComparison(slugs)
    : null;
  const names = comparison?.subjects.map((subject) => subject.name) ?? slugs;
  return buildMetadata({
    title:
      names.length > 1
        ? `${names.join(" vs ")}: Crypto Exchange Comparison`
        : "Compare crypto exchanges",
    description:
      names.length > 1
        ? `Compare ${names.join(", ")} crypto exchanges for Australian users — fees and features side by side.`
        : "Compare crypto exchanges for Australian users.",
    path: `${BASE_PATH}/${slug}`,
    noIndex: true,
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

  const comparison = await getCryptoExchangeComparison(slugs);
  if (!comparison) notFound();
  const { subjects, sections } = comparison;
  const pool = await getCryptoExchangeSelectorOptions();
  const trail = breadcrumbTrail([
    { name: "Crypto exchanges", path: "/crypto/exchanges" },
    { name: "Compare", path: "/crypto/exchanges/compare" },
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
      </div>
      {subjects.some((subject) => subject.cta?.isAffiliate) && (
        <SectionAffiliateDisclosure />
      )}
    </>
  );
}
