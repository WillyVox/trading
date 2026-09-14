import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Trading Guide \u2014 Independent Crypto Exchange & Trading Platform Research for Australia",
  description:
    "Independent, source-linked crypto exchange comparisons and guides for Australia \u2014 verified facts and transparent fees, never a ranking influenced by commission.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="Independent crypto research · Australia"
        title="Crypto exchanges, compared with evidence."
        subheading="One research platform for Australian crypto exchanges — verified facts and transparent fees, never a ranking influenced by commission."
        ctas={[
          { label: "Explore exchanges", href: "/crypto/exchanges", variant: "gold" },
          { label: "Read methodology", href: "/methodology", variant: "outline" },
        ]}
        meta={["Source-linked facts", "Independent editorial", "Direct provider comparisons"]}
      />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <Eyebrow>Research standard</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-bold text-navy">Facts carry provenance.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <span className="mb-3 inline-block rounded-full border border-blue/30 bg-blue/10 px-2.5 py-0.5 text-xs font-medium text-blue">
              EXCHANGES
            </span>
            <div className="font-display text-xl font-bold text-navy">Provider profiles</div>
            <p className="mt-1 text-sm text-muted">Structured facts, fees, and sources per exchange.</p>
          </Card>
          <Card>
            <span className="mb-3 inline-block rounded-full border border-green/30 bg-green/10 px-2.5 py-0.5 text-xs font-medium text-green">
              COMPARE
            </span>
            <div className="font-display text-xl font-bold text-navy">Side-by-side comparisons</div>
            <p className="mt-1 text-sm text-muted">Generated live from the same provider dataset.</p>
          </Card>
          <Card>
            <span className="mb-3 inline-block rounded-full border border-blue/30 bg-blue/10 px-2.5 py-0.5 text-xs font-medium text-blue">
              GUIDES
            </span>
            <div className="font-display text-xl font-bold text-navy">Guides &amp; news</div>
            <p className="mt-1 text-sm text-muted">Editorial content, kept structurally separate from affiliate data.</p>
          </Card>
        </div>
      </section>
    </>
  );
}