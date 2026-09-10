import { notFound, redirect } from "next/navigation";
import { getProviderBySlug } from "@/lib/providers/service";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { canonicalCompareSlug } from "@/lib/seo/canonical";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

function parseSlug(slug: string): [string, string | null] {
  const parts = slug.split("-vs-");
  return parts.length === 2 ? [parts[0], parts[1]] : [slug, null];
}

function label(slug: string | null) {
  return (slug ?? "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [a, b] = parseSlug(slug);
  const title = b ? `${label(a)} vs ${label(b)}: Fees & Features Compared` : `Compare ${label(a)}`;
  const description = b
    ? `Compare ${label(a)} and ${label(b)} crypto exchanges for Australian users \u2014 fees, features, and verified facts side by side.`
    : `Compare ${label(a)} against other Australian crypto exchanges.`;

  return buildMetadata({
    title,
    description,
    path: `/compare/${slug}`,
    type: "website",
    // Thin content today \u2014 the page currently only shows provider names,
    // not a genuine comparison verdict. noindex until real unique
    // comparison content exists (Phase 0 audit, \u00a7N). Flip this once a
    // Comparison content model backs this page.
    noIndex: true,
  });
}

export default async function CompareDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [a, b] = parseSlug(slug);

  if (!a) notFound();

  if (b) {
    const canonicalSlug = canonicalCompareSlug(a, b);
    if (slug !== canonicalSlug) {
      redirect(`/compare/${canonicalSlug}`);
    }
  }

  const providerA = await getProviderBySlug(a);
  const providerB = b ? await getProviderBySlug(b) : null;

  // Previously this rendered "Provider not found" as a real 200 page for
  // any slug (Phase 0 audit, §B/§C). Nonexistent entities now genuinely 404.
  if (!providerA || (b && !providerB)) notFound();

  const trail = breadcrumbTrail([
    { name: "Compare", path: "/compare" },
    { name: b ? `${label(a)} vs ${label(b)}` : label(a), path: `/compare/${slug}` },
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <Eyebrow>Compare</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-extrabold capitalize text-navy">
        {slug.replace(/-/g, " ")}
      </h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>{providerA.name}</Card>
        {providerB && <Card>{providerB.name}</Card>}
      </div>
    </div>
  );
}
