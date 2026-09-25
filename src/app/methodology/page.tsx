import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Methodology \u2014 How We Verify Trading Platform & Crypto Research",
  description:
    "How Trading Guide sources, verifies, and labels facts about share trading platforms and crypto exchanges \u2014 evidence standards and editorial policy.",
  path: "/methodology",
  image: "/images/og/methodology.png",
});

const PRINCIPLES = [
  {
    title: "1 · Prefer primary evidence",
    body: "Regulators, government records, and official provider documentation are preferred for decision-relevant claims.",
  },
  {
    title: "2 · Attach provenance",
    body: "Facts carry source, source type, jurisdiction, verified date, and status.",
  },
  {
    title: "3 · Do not fill gaps",
    body: "Unknown, variable, or unverified values stay clearly labelled instead of being guessed.",
  },
  {
    title: "4 · One source of truth",
    body: "Profiles, comparisons, and evidence views all derive from the same structured provider records.",
  },
];

export default function MethodologyPage() {
  const trail = breadcrumbTrail([
    { name: "Methodology", path: "/methodology" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Our standards"
        title="How we research and verify facts"
        subheading="Our sourcing, verification, and affiliate-disclosure standards."
        graphic="methodology"
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <Card key={p.title}>
              <h3 className="font-display text-navy mb-1.5 font-bold">
                {p.title}
              </h3>
              <p className="text-muted text-sm">{p.body}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/methodology/comparisons" className="text-blue underline">
            Comparison methodology
          </Link>
          <Link
            href="/methodology/editorial-policy"
            className="text-blue underline"
          >
            Editorial policy
          </Link>
        </div>
      </div>
    </>
  );
}
