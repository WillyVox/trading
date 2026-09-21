import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Compare Trading Platforms & Crypto Exchanges Australia",
  description:
    "Compare Australian share trading platforms and crypto exchanges using source-linked fees, features, market access and ownership information.",
  path: "/compare",
});

const comparisonAreas = [
  {
    title: "Trading platforms",
    description:
      "Compare market access, products, custody arrangements and calculator-ready costs across share trading platforms.",
    href: "/compare/trading-platforms",
    cta: "Compare trading platforms",
  },
  {
    title: "Crypto exchanges",
    description:
      "Compare exchange fees, features and verified facts, then build a side-by-side comparison of the exchanges you choose.",
    href: "/compare/crypto-exchanges",
    cta: "Compare crypto exchanges",
  },
] as const;

export default function ComparePage() {
  const trail = breadcrumbTrail([{ name: "Compare", path: "/compare" }]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Independent comparisons"
        title="Compare platforms side by side"
        subheading="Choose a market, inspect the evidence and compare verified facts without rankings or personalised recommendations."
      />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {comparisonAreas.map((area) => (
            <section
              key={area.href}
              className="border-border bg-panel rounded-2xl border p-6 shadow-sm"
            >
              <h2 className="font-display text-navy text-2xl font-bold">
                {area.title}
              </h2>
              <p className="text-muted mt-3 text-sm leading-6">
                {area.description}
              </p>
              <Link
                href={area.href}
                className="text-blue mt-6 inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
              >
                {area.cta} →
              </Link>
            </section>
          ))}
        </div>
        <section className="border-border mt-10 border-t pt-8">
          <h2 className="font-display text-navy text-xl font-bold">
            How comparison URLs work
          </h2>
          <p className="text-muted mt-3 max-w-3xl text-sm leading-6">
            Pick two or more providers on a comparison hub and Trading Guide
            creates a shareable comparison URL. Provider order is canonicalised
            alphabetically so the same selection does not create duplicate
            pages.
          </p>
        </section>
      </main>
    </>
  );
}
