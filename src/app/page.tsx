import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Trading Guide \u2014 Independent Research for Australian Trading Platforms",
  description:
    "Independent, source-linked research and comparisons for share trading and cryptocurrency platforms in Australia \u2014 verified facts and transparent fees, never a ranking influenced by commission.",
  path: "/",
});

const howItWorksSteps = [
  {
    number: "1",
    href: "/guides",
    title: "Learn the basics",
    description:
      "Start with beginner guides on share trading and crypto — no jargon, no assumed experience.",
  },
  {
    number: "2",
    href: "/crypto/exchanges",
    title: "Research the providers",
    description: "Read structured, source-linked profiles — fees, features, and provenance for each one.",
  },
  {
    number: "3",
    href: "/compare/crypto-exchanges",
    title: "Compare side by side",
    description: "See providers against each other on the same facts before you choose one.",
  },
] as const;

const researchStandardLinks = [
  {
    href: "/crypto/exchanges",
    tagLabel: "EXCHANGES",
    tagClassName: "border-blue/30 bg-blue/10 text-blue",
    title: "Provider profiles",
    description: "Structured facts, fees, and sources per exchange.",
  },
  {
    href: "/compare/crypto-exchanges",
    tagLabel: "COMPARE",
    tagClassName: "border-green/30 bg-green/10 text-green",
    title: "Side-by-side comparisons",
    description: "Generated live from the same provider dataset.",
  },
  {
    href: "/guides",
    tagLabel: "GUIDES",
    tagClassName: "border-blue/30 bg-blue/10 text-blue",
    title: "Guides & news",
    description: "Editorial content, kept structurally separate from affiliate data.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="Independent trading research · Australia"
        title="Understand trading before you choose a platform."
        subheading="Beginner-friendly guides and source-linked research for share trading and cryptocurrency in Australia — verified facts and transparent fees, never a ranking influenced by commission."
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
            // <Link key={item.href} href={item.href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-soft focus-visible:ring-offset-2 rounded-2xl">
              <Card className="h-full transition-colors">
                <span className={`mb-3 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${item.tagClassName}`}>
                  {item.tagLabel}
                </span>
                <div className="font-display text-xl font-bold text-navy">{item.title}</div>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </Card>
            // </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <Eyebrow>How this site works</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-bold text-navy">Three steps before you start investing</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {howItWorksSteps.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-soft focus-visible:ring-offset-2 rounded-2xl"
            >
              <Card className="h-full transition-colors hover:border-gold-soft">
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-gold-soft bg-panel-secondary font-mono text-sm font-semibold text-navy">
                  {step.number}
                </span>
                <div className="font-display text-xl font-bold text-navy">{step.title}</div>
                <p className="mt-1 text-sm text-muted">{step.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      
    </>
  );
}