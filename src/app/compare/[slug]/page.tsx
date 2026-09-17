import { notFound, redirect } from "next/navigation";
import { CompareTable } from "@/components/compare/CompareTable";
import { CompareMobileCards } from "@/components/compare/CompareMobileCards";
import { CompareSelector } from "@/components/compare/CompareSelector";
import {
  DOMAIN_COPY,
  getComparisonPool,
  resolveComparison,
} from "@/lib/compare/resolve";
import {
  canonicalCompareSlugMulti,
  parseCompareSlugs,
} from "@/lib/seo/canonical";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";

function label(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = parseCompareSlugs(slug);
  if (slugs.length === 0) {
    return buildMetadata({
      title: "Compare not found",
      description: "",
      path: `/compare/${slug}`,
      noIndex: true,
    });
  }

  // Cached alongside the page body's call -- one resolution per request, so
  // reading the real domain here costs nothing extra. Without it this page
  // described a share trading comparison as "crypto exchanges".
  const resolved = await resolveComparison(slug);
  const names = resolved?.subjects.map((s) => s.name) ?? slugs.map(label);
  const descriptor = resolved
    ? DOMAIN_COPY[resolved.domain].metaDescriptor
    : "providers";

  const title =
    names.length > 1
      ? `${names.join(" vs ")}: Fees & Features Compared`
      : `Compare ${names[0] ?? slug}`;
  const description =
    names.length > 1
      ? `Compare ${names.join(", ")} ${descriptor} for Australian users \u2014 fees, features, and verified facts side by side.`
      : `Compare ${names[0] ?? slug} against other Australian ${descriptor}.`;

  return buildMetadata({
    title,
    description,
    path: `/compare/${slug}`,
    type: "website",
    // Table now renders real facts/fees/features (Phase 5), not just
    // provider names -- but indexing every possible subject-pair/triple
    // combination is still an open SEO decision (Phase 8), so this stays
    // noindex until that review happens. /compare/crypto-exchanges and
    // /compare/trading-platforms (the curated, always-complete
    // comparisons) are indexed instead.
    noIndex: true,
  });
}

export default async function CompareDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = parseCompareSlugs(slug);
  if (slugs.length === 0) notFound();

  const canonicalSlug = canonicalCompareSlugMulti(slugs);
  if (slug !== canonicalSlug) {
    redirect(`/compare/${canonicalSlug}`);
  }

  // Previously this assumed every slug was a crypto provider. It now tries
  // both domains -- see src/lib/compare/resolve.ts. Nonexistent entities
  // still genuinely 404 (Phase 0 audit, §B/§C), including when only some
  // of several requested slugs exist, and now also when the slugs are
  // split across domains.
  const resolved = await resolveComparison(slug);
  if (!resolved) notFound();

  const { domain, subjects, sections } = resolved;
  const copy = DOMAIN_COPY[domain];

  // Pool for "Build your own comparison" below -- scoped to the resolved
  // domain so the chips can't suggest a cross-domain pairing that 404s.
  const pool = await getComparisonPool(domain);

  const trail = breadcrumbTrail([
    { name: "Compare", path: "/compare" },
    {
      name: subjects.map((s) => s.name).join(" vs "),
      path: `/compare/${slug}`,
    },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Compare"
        title={subjects.map((s) => s.name).join(" vs ")}
        subheading={`Generated live from ${copy.sourceLabel} \u2014 everything shown here updates automatically when the underlying data changes.`}
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        {subjects.length < 2 && (
          <p className="text-muted mt-3 text-sm">
            Only one selected. Visit{" "}
            <a className="hover:text-navy underline" href={copy.indexPath}>
              the full comparison
            </a>{" "}
            to add another.
          </p>
        )}

        <div className="mt-8">
          <CompareTable subjects={subjects} sections={sections} />
          <CompareMobileCards subjects={subjects} sections={sections} />
        </div>

        <CompareSelector
          providers={pool}
          initialSelected={slugs}
          noun={copy.noun}
        />
      </div>
    </>
  );
}
