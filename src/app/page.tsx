import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/layout/PageHero";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatFeatureLabel } from "@/lib/crypto-exchanges/features";
import { getFeaturedCryptoExchanges } from "@/lib/crypto-exchanges/service";

export const metadata = buildMetadata({
  title:
    "Trading Guide \u2014 Independent Research for Cryptocurrencies and Trading Platforms in Australia",
  description:
    "Independent, source-linked research and comparisons for share trading and cryptocurrency platforms in Australia \u2014 verified facts and transparent fees.",
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
    description:
      "Read structured, source-linked profiles — fees, features, and provenance for each one.",
  },
  {
    number: "3",
    href: "/crypto/exchanges/compare",
    title: "Compare side by side",
    description:
      "See providers against each other on the same facts before you choose one.",
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
    href: "/crypto/exchanges/compare",
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
    description:
      "Editorial content, kept structurally separate from affiliate data.",
  },
] as const;

export default async function HomePage() {
  const featuredProviders = await getFeaturedCryptoExchanges(3);

  return (
    <>
      <PageHero
        eyebrow="Independent trading research · Australia"
        title="Understand trading before you start investing."
        subheading="Beginner-friendly guides and source-linked research for share trading and cryptocurrency in Australia — verified facts and transparent fees."
        ctas={[
          {
            label: "Explore crypto exchanges",
            href: "/crypto/exchanges",
            variant: "gold",
          },
          {
            label: "Read methodology",
            href: "/methodology",
            variant: "outline",
          },
        ]}
        meta={[
          "Source-linked facts",
          "Independent editorial",
          "Direct provider comparisons",
        ]}
        graphic="home"
      />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <Eyebrow>Research standard</Eyebrow>
        <h2 className="font-display text-navy mt-4 text-3xl font-bold">
          Facts carry provenance.
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {researchStandardLinks.map((item) => (
            // <Link key={item.href} href={item.href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-soft focus-visible:ring-offset-2 rounded-2xl">
            <Card className="h-full transition-colors" key={item.title}>
              <span
                className={`mb-3 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${item.tagClassName}`}
              >
                {item.tagLabel}
              </span>
              <div className="font-display text-navy text-xl font-bold">
                {item.title}
              </div>
              <p className="text-muted mt-1 text-sm">{item.description}</p>
            </Card>
            // </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <Eyebrow>How this site works</Eyebrow>
        <h2 className="font-display text-navy mt-4 text-3xl font-bold">
          Three steps to a platform you trust.
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {howItWorksSteps.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="focus-visible:ring-gold-soft block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Card className="hover:border-gold-soft h-full transition-colors">
                <span className="border-gold-soft bg-panel-secondary text-navy mb-3 flex h-8 w-8 items-center justify-center rounded-full border font-mono text-sm font-semibold">
                  {step.number}
                </span>
                <div className="font-display text-navy text-xl font-bold">
                  {step.title}
                </div>
                <p className="text-muted mt-1 text-sm">{step.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {featuredProviders.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <Eyebrow>Featured providers</Eyebrow>
          <h2 className="font-display text-navy mt-4 text-3xl font-bold">
            A few providers we&apos;ve verified.
          </h2>
          <p className="text-muted mt-1 text-sm">
            Shown alphabetically — not a ranking.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {featuredProviders.map((offering) => {
              const provider = offering.provider;
              return (
                <Card key={offering.id} className="h-full">
                  <div className="flex items-center gap-3">
                    <ProviderLogo
                      logo={provider.logo}
                      name={provider.name}
                      size="sm"
                    />
                    <div className="font-display text-navy text-lg font-bold">
                      {provider.name}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge tone="green">Verified</Badge>
                  </div>
                  {(offering.description ?? provider.description) && (
                    <p className="text-muted mt-3 text-sm">
                      {offering.description ?? provider.description}
                    </p>
                  )}
                  {offering.features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {offering.features.map((feature) => (
                        <span
                          key={feature.id}
                          className="bg-panel-secondary text-navy rounded-full px-2 py-0.5 text-xs"
                        >
                          {formatFeatureLabel(
                            feature.featureType,
                            feature.label
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/crypto/exchanges/${provider.slug}`}
                    className="border-border text-blue focus-visible:ring-gold-soft mt-3 inline-block rounded border-t pt-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    View profile →
                  </Link>
                </Card>
              );
            })}
          </div>
          <Link
            href="/crypto/exchanges"
            className="text-blue mt-4 inline-block text-sm font-semibold"
          >
            See all exchanges →
          </Link>
        </section>
      )}
    </>
  );
}
