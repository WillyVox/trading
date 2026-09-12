import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Editorial Policy — Sourcing, Review & Fact-Checking Standards",
  description:
    "AusMarket's editorial standards: sourcing requirements, author and reviewer sign-off, fact-check review cycles, and how affiliate relationships are kept separate from coverage.",
  path: "/methodology/editorial-policy",
});

/**
 * Content status: DRAFT, not legal-reviewed -- see docs/CONTENT-GAPS.md
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
    title: "Every article has a named author and reviewer",
    body: "Guides and news content go through the same admin workflow, which tracks who wrote the piece and who reviewed it before it was marked ready to publish.",
  },
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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <h1 className="font-display text-4xl font-extrabold text-navy">Editorial policy</h1>
      <p className="mt-3 text-muted">
        The standards every guide and news article on AusMarket is checked against before it's
        published, and how we keep coverage independent of commercial relationships.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {STANDARDS.map((s) => (
          <Card key={s.title}>
            <h2 className="mb-1.5 font-display text-lg font-bold text-navy">{s.title}</h2>
            <p className="text-sm leading-relaxed text-muted">{s.body}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-navy">How this relates to our other policies</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        This page covers how content is written and reviewed. For how comparison tables are built
        from provider data, see our{" "}
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

      <div className="mt-6">
        <Notice>
          General information only. This describes our internal editorial process and isn't a
          guarantee that every fact on the site is current at the moment you read it — always verify
          important details directly with the provider.
        </Notice>
      </div>
    </div>
  );
}