import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Comparison Methodology — How We Build Comparison Tables",
  description:
    "How Trading Guide's comparison tables are generated from live provider records, what \u201cNot verified\u201d means, and how providers are ordered.",
  path: "/methodology/comparisons",
  image: "/images/og/methodology-comparisons.png",
});

/**
 * Content status: DRAFT, not legal-reviewed -- see docs/CONTENT-GAPS.md
 * "Comparison Methodology page". Every claim below is checked directly
 * against src/lib/crypto-exchanges/comparison.ts and service.ts:
 *  - Comparison tables are generated live from Provider facts/fees/features
 *    (getProvidersBySlugs), never a separately-maintained copy.
 *  - Rows are a union of labels across the compared providers (buildFactRows/
 *    buildFeeRows), so a fact only one provider has still gets its own row
 *    rather than being dropped.
 *  - A missing fee shows literally as "Not verified", not blank or "$0".
 *  - Sections are Facts, Fees, Products & trading, Deposits & withdrawals,
 *    Security (buildCompareSections) -- an empty section is omitted.
 *  - Provider listings/tables sort alphabetically (orderBy: name asc), not
 *    by commercial relationship -- matches the Affiliate Disclosure page.
 *  - Multi-provider comparison URLs canonicalize to alphabetical slug order
 *    (canonicalCompareSlugMulti) so "a-vs-b" and "b-vs-a" aren't treated as
 *    duplicate pages.
 */
const PRINCIPLES = [
  {
    title: "No fact is hidden to make a row line up",
    body: "If even one compared provider has a fact, that fact gets its own row for every provider in the table. Providers without that fact show a dash rather than the row being left out.",
  },
  {
    title: "Unverified fees are labelled, never guessed",
    body: "If we haven't verified a provider's fee for something the table is comparing, that cell reads \u201cNot verified.\u201d We don't estimate a number or leave the cell blank in a way that could be misread as zero.",
  },
  {
    title: "Alphabetical order",
    body: "Comparison tables and provider listings are sorted alphabetically by name. Order is never influenced by affiliate revenue, click-through rate, or how recently a provider paid us \u2014 see our how we get paid page.",
  },
];

export default function ComparisonMethodologyPage() {
  const trail = breadcrumbTrail([
    { name: "Methodology", path: "/methodology" },
    { name: "Comparison Methodology", path: "/methodology/comparisons" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Methodology"
        title="How we build our comparisons"
        subheading="How Trading Guide turns verified provider facts into the comparison tables you see on the site — and what a missing or unverified value actually means when you see one."
        maxWidth="max-w-3xl"
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mt-8 flex flex-col gap-4">
          {PRINCIPLES.map((p) => (
            <Card key={p.title}>
              <h2 className="font-display text-navy mb-1.5 text-lg font-bold">
                {p.title}
              </h2>
              <p className="text-muted text-sm leading-relaxed">{p.body}</p>
            </Card>
          ))}
        </div>

        <h2 className="font-display text-navy mt-8 text-lg font-bold">
          What a comparison table covers
        </h2>
        <p className="text-muted mt-2 text-sm leading-relaxed">
          Where the data exists, a comparison is grouped into five sections:
          Facts, Fees, Products &amp; trading, Deposits &amp; withdrawals, and
          Security. A section is only shown if at least one compared provider
          has data for it — we don&apos;t render an empty section just to keep
          the layout consistent.
        </p>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href="/methodology/editorial-policy"
            className="text-blue underline"
          >
            Editorial policy
          </Link>
          <Link href="/how-we-get-paid" className="text-blue underline">
            How we get paid
          </Link>
          <Link href="/affiliate-disclosure" className="text-blue underline">
            Affiliate disclosure
          </Link>
          <Link
            href="/compare/crypto-exchanges"
            className="text-blue underline"
          >
            See a live comparison
          </Link>
        </div>
      </div>
    </>
  );
}
