import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Editorial Policy — Sourcing, Review & Fact-Checking Standards",
  description:
    "Trading Guide's editorial standards: sourcing requirements, author and reviewer sign-off, fact-check review cycles, and how affiliate relationships are kept separate from coverage.",
  path: "/methodology/editorial-policy",
  image: "/images/og/editorial-policy.png",
});

/**
 * Content status: EDITORIALLY REVIEWED for implementation accuracy (2026-09-24).
 * This records internal product/editorial review, not external legal advice.
 * "Editorial Policy page". Every standard below is checked directly against
 * src/lib/articles/editorial-checklist.ts, the admin checklist every
 * article is actually scored against before publishing:
 *  - Every article is checked for an author and a reviewer field.
 *  - Articles carry a lastReviewedAt (fact-check) date; the checklist flags
 *    anything not reviewed in the last 180 days for a fresh pass
 *    (STALE_REVIEW_DAYS).
 *  - Zero sources on financial/crypto content triggers a checklist warning.
 *  - An article that features or compares a provider (ArticleProvider
 *    relationship FEATURED/COMPARED) is flagged if affiliate disclosure
 *    isn't enabled for it.
 *  - Articles can be marked noIndex, excluding them from search and from
 *    the sitemap (see src/lib/seo/sitemap-entries.ts).
 * The checklist is advisory for editors, not a public score -- we don't
 * publish per-article scores, only the standards themselves here.
 */
const STANDARDS = [
  {
    title: "Fact-checks don't go stale",
    body: "Each article carries a last-reviewed date. Once a review is more than 180 days old, it's flagged internally for a fresh fact-check pass rather than being left to quietly age.",
  },
  {
    title: "Financial and crypto claims need a source",
    body: "An article with zero listed sources is flagged before publishing. Sources are attached at the article level so readers can see where a claim comes from.",
  },
  {
    title: "Featuring a provider requires disclosure",
    body: "If an article features or directly compares a specific provider, it's flagged unless affiliate disclosure is switched on for that piece \u2014 coverage and commercial relationships are tracked separately, not bundled together by default.",
  },
  {
    title: "Pages we're not ready to stand behind are kept out of search",
    body: "Any article can be marked noIndex, which excludes it from both search engines and the sitemap until it meets our standards.",
  },
];

export default function EditorialPolicyPage() {
  const trail = breadcrumbTrail([
    { name: "Methodology", path: "/methodology" },
    { name: "Editorial Policy", path: "/methodology/editorial-policy" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Methodology"
        title="Editorial policy"
        subheading="How Trading Guide researches, verifies, writes and updates its content — and how we keep editorial decisions independent from commercial relationships."
        maxWidth="max-w-3xl"
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mt-8 flex flex-col gap-4">
          {STANDARDS.map((s) => (
            <Card key={s.title}>
              <h2 className="font-display text-navy mb-1.5 text-lg font-bold">
                {s.title}
              </h2>
              <p className="text-muted text-sm leading-relaxed">{s.body}</p>
            </Card>
          ))}
        </div>

        <h2 className="font-display text-navy mt-8 text-lg font-bold">
          How this relates to our other policies
        </h2>
        <p className="text-muted mt-2 text-sm leading-relaxed">
          This page covers how content is written and reviewed. For how
          comparison tables are built from provider data, see our{" "}
          <Link href="/methodology/comparisons" className="text-blue underline">
            comparison methodology
          </Link>
          . For how we're paid and how that's kept separate from coverage, see{" "}
          <Link href="/how-we-get-paid" className="text-blue underline">
            how we get paid
          </Link>{" "}
          and our{" "}
          <Link href="/affiliate-disclosure" className="text-blue underline">
            affiliate disclosure
          </Link>
          .
        </p>
      </div>
    </>
  );
}
