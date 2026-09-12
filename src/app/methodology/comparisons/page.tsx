import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Comparison Methodology — How We Build Comparison Tables",
  description:
    "How AusMarket's comparison tables are generated from live provider records, what \u201cNot verified\u201d means, and how providers are ordered.",
  path: "/methodology/comparisons",
});

/**
 * Content status: DRAFT, not legal-reviewed -- see docs/CONTENT-GAPS.md
 * "Comparison Methodology page". Every claim below is checked directly
 * against src/lib/providers/compare.ts and service.ts:
 *  - Comparison tables are generated live from Provider facts/fees/features
 *    (getProvidersBySlugs), never a separately-maintained copy.
 *  - Rows are a union of labels across the compared providers (buildFactRows/
 *    buildFeeRows), so a fact only one provider has still gets its own row
 *    rather than being dropped.
 *  - A missing fee shows literally as "Not verified", not blank or "$0".
 *  - Sections are Facts, Fees, Products & trading, Deposits & withdrawals,
 *    Security (buildComparisonSections) -- an empty section is omitted.
 *  - Provider listings/tables sort alphabetically (orderBy: name asc), not
 *    by commercial relationship -- matches the Affiliate Disclosure page.
 *  - Multi-provider comparison URLs canonicalize to alphabetical slug order
 *    (canonicalCompareSlugMulti) so "a-vs-b" and "b-vs-a" aren't treated as
 *    duplicate pages.
 */
const PRINCIPLES = [
  {
    title: "Built live, not copied",
    body: "Every comparison table is generated at request time from each provider's current facts, fees, and features. There's no separate \u201ccomparison table\u201d database \u2014 when a provider's information changes, every comparison that includes it updates automatically.",
  },
  {
    title: "No fact is hidden to make a row line up",
    body: "If even one compared provider has a fact, that fact gets its own row for every provider in the table. Providers without that fact show a dash rather than the row being left out.",
  },
  {
    title: "Unverified fees are labelled, never guessed",
    body: "If we haven't verified a provider's fee for something the table is comparing, that cell reads \u201cNot verified.\u201d We don't estimate a number or leave the cell blank in a way that could be misread as zero.",
  },
  {
    title: "Alphabetical order, always",
    body: "Comparison tables and provider listings are sorted alphabetically by name. Order is never influenced by affiliate revenue, click-through rate, or how recently a provider paid us \u2014 see our how we get paid page.",
  },
];

export default function ComparisonMethodologyPage() {
  const trail = breadcrumbTrail([
    { name: "Methodology", path: "/methodology" },
    { name: "Comparison Methodology", path: "/methodology/comparisons" },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <h1 className="font-display text-4xl font-extrabold text-navy">Comparison methodology</h1>
      <p className="mt-3 text-muted">
        How AusMarket turns verified provider facts into the comparison tables you see on the site
        — and what a missing or unverified value actually means when you see one.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {PRINCIPLES.map((p) => (
          <Card key={p.title}>
            <h2 className="mb-1.5 font-display text-lg font-bold text-navy">{p.title}</h2>
            <p className="text-sm leading-relaxed text-muted">{p.body}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-navy">What a comparison table covers</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Where the data exists, a comparison is grouped into five sections: Facts, Fees, Products &amp;
        trading, Deposits &amp; withdrawals, and Security. A section is only shown if at least one
        compared provider has data for it — we don't render an empty section just to keep the
        layout consistent.
      </p>

      <div className="mt-6">
        <Notice>
          This describes how the comparison engine works today. It's general information about our
          methodology, not financial advice — always confirm current fees and features directly
          with the provider before making a decision.
        </Notice>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/methodology/editorial-policy" className="text-blue underline">
          Editorial policy
        </Link>
        <Link href="/how-we-get-paid" className="text-blue underline">
          How we get paid
        </Link>
        <Link href="/affiliate-disclosure" className="text-blue underline">
          Affiliate disclosure
        </Link>
        <Link href="/compare/crypto-exchanges" className="text-blue underline">
          See a live comparison
        </Link>
      </div>
    </div>
  );
}