import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title:
    "Provider Profiles \u2014 Trading Platforms & Crypto Exchanges Australia",
  description:
    "Browse verified, source-linked profiles of Australian share trading platforms and crypto exchanges \u2014 fees, features and provenance for each one.",
  path: "/providers",
});

// Deliberately the same shape and layout as /compare/page.tsx's
// comparisonAreas -- that page already solved "one hub, two verticals,
// pick a market" for comparisons; this is the equivalent hub for browsing
// provider *profiles* rather than building a comparison. Homepage step 2
// ("Research the providers") links here instead of straight to
// /crypto/exchanges so the card can stay a single whole-card link while
// still covering both verticals (see homepage redesign notes).
const providerAreas = [
  {
    title: "Trading platforms",
    description:
      "Browse verified profiles of Australian share trading platforms \u2014 market access, account types, custody and fees.",
    href: "/share-trading",
    cta: "Browse trading platforms",
  },
  {
    title: "Crypto exchanges",
    description:
      "Browse verified profiles of Australian crypto exchanges \u2014 fees, features, supported assets and sources.",
    href: "/crypto/exchanges",
    cta: "Browse crypto exchanges",
  },
] as const;

export default function ProvidersPage() {
  const trail = breadcrumbTrail([{ name: "Providers", path: "/providers" }]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Independent research"
        title="Research every provider we cover."
        subheading="Choose a market, then browse verified, source-linked profiles — no rankings, just facts."
      />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {providerAreas.map((area) => (
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
      </main>
    </>
  );
}
