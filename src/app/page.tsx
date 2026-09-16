import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Trading Guide \u2014 Independent Research for Australian Trading Platforms",
  description:
    "Independent, source-linked research and comparisons for share trading and cryptocurrency platforms in Australia \u2014 verified facts and transparent fees.",
  path: "/",
});

const researchStandardLinks = [
  {
    href: "/guides",
    tagLabel: "GUIDES",
    tagClassName: "border-blue/30 bg-blue/10 text-blue",
    title: "Trading guides",
    description: "Editorial content, kept structurally separate from affiliate data.",
  },
  {
    href: "/compare/crypto-exchanges",
    tagLabel: "COMPARE",
    tagClassName: "border-green/30 bg-green/10 text-green",
    title: "Side-by-side comparisons",
    description: "Generated live from the same provider dataset.",
  },
  {
    href: "/crypto/exchanges",
    tagLabel: "EXCHANGES",
    tagClassName: "border-blue/30 bg-blue/10 text-blue",
    title: "Exchanges profiles",
    description: "Structured facts, fees, and sources per exchange.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="Independent trading research · Australia"
        title="Understand trading before you choose a platform."
        subheading="Beginner-friendly guides and source-linked research for share trading and cryptocurrency in Australia — verified facts and transparent fees."
        ctas={[
          { label: "Explore crypto exchanges", href: "/crypto/exchanges", variant: "gold" },
          { label: "Read methodology", href: "/methodology", variant: "outline" },
        ]}
        meta={["Source-linked facts", "Independent editorial", "Direct provider comparisons"]}
        graphic="home"
      />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <Eyebrow>Research standard</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-bold text-navy">Facts carry provenance.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {researchStandardLinks.map((item) => (
            <Link key={item.href} href={item.href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-soft focus-visible:ring-offset-2 rounded-2xl">
              <Card className="h-full transition-colors hover:border-gold-soft">
                <span className={`mb-3 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${item.tagClassName}`}>
                  {item.tagLabel}
                </span>
                <div className="font-display text-xl font-bold text-navy">{item.title}</div>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}