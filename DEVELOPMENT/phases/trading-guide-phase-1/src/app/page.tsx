import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "AusMarket Crypto \u2014 Independent Crypto Exchange Research for Australia",
  description:
    "Independent, source-linked crypto exchange comparisons and guides for Australia \u2014 verified facts and transparent fees, never a ranking influenced by commission.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Eyebrow>Independent crypto research · Australia</Eyebrow>

          <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[1.02] text-navy sm:text-6xl md:text-7xl">
            Crypto exchanges, compared with evidence.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            One research platform for Australian crypto exchanges — verified facts and
            transparent fees, never a ranking influenced by commission.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/crypto/exchanges" variant="primary">Explore exchanges</Button>
            <Button href="/methodology" variant="secondary">Read methodology</Button>
          </div>

          <p className="mt-4 text-sm text-muted">
            Source-linked facts &middot; Independent editorial &middot; Direct provider comparisons
          </p>
        </div>
      </section>

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
