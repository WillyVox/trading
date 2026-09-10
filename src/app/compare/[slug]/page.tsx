import { notFound, redirect } from "next/navigation";
import { getProvidersBySlugs } from "@/lib/providers/service";
import { buildComparisonSections } from "@/lib/providers/compare";
import { CompareTable } from "@/components/compare/CompareTable";
import { CompareMobileCards } from "@/components/compare/CompareMobileCards";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { canonicalCompareSlugMulti } from "@/lib/seo/canonical";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

/** Splits "a-vs-b-vs-c" into ["a","b","c"]. Supports any number of
 * providers (Phase 5: "3+-way comparison UI"), not just pairs. */
function parseSlugs(slug: string): string[] {
  return slug.split("-vs-").filter(Boolean);
}

function label(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugs = parseSlugs(slug);
  if (slugs.length === 0) {
    return buildMetadata({ title: "Compare not found", description: "", path: `/compare/${slug}`, noIndex: true });
  }
  const labels = slugs.map(label);
  const title =
    labels.length > 1 ? `${labels.join(" vs ")}: Fees & Features Compared` : `Compare ${labels[0] ?? slug}`;
  const description =
    labels.length > 1
      ? `Compare ${labels.join(", ")} crypto exchanges for Australian users \u2014 fees, features, and verified facts side by side.`
      : `Compare ${labels[0] ?? slug} against other Australian crypto exchanges.`;

  return buildMetadata({
    title,
    description,
    path: `/compare/${slug}`,
    type: "website",
    // Table now renders real facts/fees/features (Phase 5), not just
    // provider names -- but indexing every possible provider-pair/triple
    // combination is still an open SEO decision (Phase 8), so this stays
    // noindex until that review happens. /compare/crypto-exchanges (the
    // curated, always-complete comparison) is indexed instead.
    noIndex: true,
  });
}

export default async function CompareDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugs = parseSlugs(slug);
  if (slugs.length === 0) notFound();

  const canonicalSlug = canonicalCompareSlugMulti(slugs);
  if (slug !== canonicalSlug) {
    redirect(`/compare/${canonicalSlug}`);
  }

  const providers = await getProvidersBySlugs(slugs);

  // Previously this rendered "Provider not found" as a real 200 page for
  // any slug (Phase 0 audit, §B/§C). Nonexistent entities now genuinely
  // 404 -- including when only some of several requested slugs exist.
  if (providers.length !== slugs.length) notFound();

  const sections = buildComparisonSections(providers as any);

  const trail = breadcrumbTrail([
    { name: "Compare", path: "/compare" },
    { name: providers.map((p) => p.name).join(" vs "), path: `/compare/${slug}` },
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <Eyebrow>Compare</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-extrabold text-navy">{providers.map((p) => p.name).join(" vs ")}</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Generated live from the Provider domain {"\u2014"} facts, fees, and features shown here update automatically when the
        underlying provider data changes.
      </p>

      {providers.length < 2 && (
        <p className="mt-3 text-sm text-muted">
          Only one exchange selected. Visit <a className="underline hover:text-navy" href="/compare">Compare</a> to add another.
        </p>
      )}

      <div className="mt-8">
        <CompareTable providers={providers as any} sections={sections} />
        <CompareMobileCards providers={providers as any} sections={sections} />
      </div>
    </div>
  );
}
