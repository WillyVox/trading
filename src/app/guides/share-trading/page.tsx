import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";
import { getTopicCluster } from "@/lib/seo/topic-clusters";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Share Trading Guides Australia — Fees, CHESS & Platform Research",
  description:
    "A structured learning path for Australians researching share trading: beginner guides, CHESS and custody, brokerage, FX costs, platform profiles and comparisons.",
  path: "/guides/share-trading",
});

export default function ShareTradingGuidesHub() {
  const cluster = getTopicCluster("share-trading");
  const trail = breadcrumbTrail([
    { name: "Guides", path: "/guides" },
    { name: "Share trading", path: cluster.hubHref },
  ]);
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Share trading learning path"
        title="Learn share trading, then research the costs and ownership structure"
        subheading="Move from beginner concepts to source-linked tools, platform profiles and comparisons without skipping the details that can materially change a trading-cost or ownership claim."
      />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <section className="max-w-3xl">
          <h2 className="font-display text-navy text-2xl font-bold">
            A research path, not a provider ranking
          </h2>
          <p className="text-muted mt-3 leading-7">
            Start with how share trading works, then learn how CHESS sponsorship
            and custody differ. Use the calculators to inspect supported
            published costs, and only then compare platform records side by
            side. Unknown, variable and conditional information remains visible
            rather than being treated as zero.
          </p>
        </section>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cluster.links.map((item, index) => (
            <Link key={item.href} href={item.href}>
              <Card className="hover:border-gold-soft h-full transition-colors">
                <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
                  Step {index + 1} · {item.kind}
                </p>
                <h2 className="font-display text-navy mt-2 text-lg font-bold">
                  {item.title}
                </h2>
                <p className="text-muted mt-2 text-sm leading-6">
                  {item.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
        <Card className="mt-8">
          <h2 className="font-display text-navy text-lg font-bold">
            How Trading Guide connects the evidence
          </h2>
          <p className="text-muted mt-2 text-sm leading-6">
            Platform profiles and calculators reuse structured provider records.
            Curated comparison pages add search-intent context but continue to
            read the underlying facts from the same data layer, reducing the
            risk that an editorial page and a calculator describe different
            standing fees.
          </p>
          <Link
            href="/methodology"
            className="text-blue mt-3 inline-block text-sm font-semibold underline"
          >
            Read the methodology →
          </Link>
        </Card>
      </main>
    </>
  );
}
