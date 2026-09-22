import Link from "next/link";
import { safeDatabaseQuery } from "@/lib/data/safe-database-query";
import { DataUnavailableBanner } from "@/components/data/DataUnavailableBanner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/layout/PageHero";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { NavIcon, type NavIconName } from "@/components/layout/NavIcon";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatFeatureLabel } from "@/lib/crypto-exchanges/features";
import { getFeaturedCryptoExchanges } from "@/lib/crypto-exchanges/service";
import {
  getFeaturedShareTradingPlatforms,
  type FeaturedShareTradingPlatform,
} from "@/lib/share-trading/service";
import { formatProductType } from "@/lib/share-trading/labels";
import type { FeaturedCryptoExchange } from "@/lib/crypto-exchanges/service";

export const metadata = buildMetadata({
  title:
    "Trading Guide \u2014 Independent Research for Cryptocurrencies and Trading Platforms in Australia",
  description:
    "Independent, source-linked research and comparisons for share trading and cryptocurrency platforms in Australia \u2014 verified facts and transparent fees.",
  path: "/",
});

// Icon replaces the old plain numeral circle (see homepage redesign
// proposal, "Three/four steps" — Option A): the numeral becomes a small
// corner badge instead, and the icon is the primary visual cue. Reuses the
// exact NavIcon set already defined for the header mega-menu rather than
// introducing a second icon language.
const howItWorksSteps: {
  number: string;
  href: string;
  title: string;
  description: string;
  icon: NavIconName;
}[] = [
  {
    number: "1",
    href: "/guides",
    title: "Learn the basics",
    description:
      "Start with beginner guides on share trading and crypto — no jargon, no assumed experience.",
    icon: "book",
  },
  {
    number: "2",
    href: "/providers",
    title: "Research the providers",
    description:
      "Read structured, source-linked profiles — fees, features, and provenance for each one.",
    icon: "grid",
  },
  {
    number: "3",
    href: "/compare",
    title: "Compare side by side",
    description:
      "See providers against each other on the same facts before you choose one.",
    icon: "scale",
  },
  {
    number: "4",
    href: "/tools",
    title: "Check the real cost",
    description:
      "Run our calculators — brokerage, FX and ongoing fees — before you commit.",
    icon: "calc",
  },
];

// Card 1 and 2 now cover both verticals (see homepage redesign proposal,
// "Provider profiles" — Option A): copy is generalized and each card gets
// two sub-links instead of one card-wide href, mirroring the pattern the
// header's "Compares" mega-menu already uses for the same crypto/share
// trading split. Card 3 (guides) is vertical-agnostic already, so it's
// unchanged and keeps its single implicit link.
const researchStandardLinks = [
  {
    tagLabel: "PROVIDERS",
    tagClassName: "border-blue/30 bg-blue/10 text-blue",
    title: "Provider profiles",
    description:
      "Structured facts, fees, and sources for every crypto exchange and share trading platform we cover.",
    links: [
      { label: "Crypto exchanges", href: "/crypto/exchanges" },
      { label: "Share trading", href: "/share-trading" },
    ],
  },
  {
    tagLabel: "COMPARE",
    tagClassName: "border-green/30 bg-green/10 text-green",
    title: "Side-by-side comparisons",
    description:
      "Generated live from the same provider dataset — for exchanges and platforms alike.",
    links: [
      { label: "Compare exchanges", href: "/compare/crypto-exchanges" },
      { label: "Compare platforms", href: "/compare/trading-platforms" },
    ],
  },
  {
    tagLabel: "GUIDES",
    tagClassName: "border-blue/30 bg-blue/10 text-blue",
    title: "Guides & news",
    description:
      "Editorial content, kept structurally separate from affiliate data.",
    links: [],
  },
] as const;

/** Shared card shape for both featured-provider sections below (crypto
 *  exchanges and share trading platforms) — same layout, different data
 *  source per section. See homepage redesign proposal, "Featured
 *  providers" — Option A (two stacked static sections, not a client-side
 *  tab toggle, to keep the homepage fully server-rendered). */
function FeaturedProviderCard({
  logo,
  name,
  description,
  chips,
  profileHref,
}: {
  logo: string | null;
  name: string;
  description: string | null;
  chips: string[];
  profileHref: string;
}) {
  return (
    <Card className="h-full">
      <div className="flex items-center gap-3">
        <ProviderLogo logo={logo} name={name} size="sm" />
        <div className="font-display text-navy text-lg font-bold">{name}</div>
      </div>
      <div className="mt-3">
        <Badge tone="green">Verified</Badge>
      </div>
      {description && <p className="text-muted mt-3 text-sm">{description}</p>}
      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span
              key={chip}
              className="bg-panel-secondary text-navy rounded-full px-2 py-0.5 text-xs"
            >
              {chip}
            </span>
          ))}
        </div>
      )}
      <Link
        href={profileHref}
        className="border-border text-blue focus-visible:ring-gold-soft mt-3 inline-block rounded border-t pt-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        View profile →
      </Link>
    </Card>
  );
}

function FeaturedCryptoCard({
  offering,
}: {
  offering: FeaturedCryptoExchange;
}) {
  const provider = offering.provider;
  return (
    <FeaturedProviderCard
      logo={provider.logo}
      name={provider.name}
      description={offering.description ?? provider.description}
      chips={offering.features.map((feature) =>
        formatFeatureLabel(feature.featureType, feature.label)
      )}
      profileHref={`/crypto/exchanges/${provider.slug}`}
    />
  );
}

function FeaturedShareTradingCard({
  offering,
}: {
  offering: FeaturedShareTradingPlatform;
}) {
  const provider = offering.provider;
  return (
    <FeaturedProviderCard
      logo={provider.logo}
      name={provider.name}
      description={offering.description ?? provider.description}
      chips={offering.products.map((product) =>
        formatProductType(product.productType)
      )}
      profileHref={`/share-trading/${offering.slug}`}
    />
  );
}

export default async function HomePage() {
  const featuredResult = await safeDatabaseQuery(
    "homepage.featuredProviders",
    async () => {
      const [featuredCrypto, featuredShareTrading] = await Promise.all([
        getFeaturedCryptoExchanges(3),
        getFeaturedShareTradingPlatforms(3),
      ]);
      return { featuredCrypto, featuredShareTrading };
    }
  );
  const featuredCrypto = featuredResult.ok
    ? featuredResult.data.featuredCrypto
    : [];
  const featuredShareTrading = featuredResult.ok
    ? featuredResult.data.featuredShareTrading
    : [];

  return (
    <>
      {!featuredResult.ok && <DataUnavailableBanner />}
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
            label: "Explore share trading platforms",
            href: "/share-trading",
            variant: "outline-soft",
          },
        ]}
        note={{ label: "or read our methodology →", href: "/methodology" }}
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
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <Eyebrow>How this site works</Eyebrow>
        <h2 className="font-display text-navy mt-4 text-3xl font-bold">
          Four steps to a platform you trust.
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="focus-visible:ring-gold-soft block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Card className="hover:border-gold-soft h-full transition-colors">
                <div className="relative mb-3 inline-flex">
                  <NavIcon name={step.icon} />
                  <span
                    aria-hidden="true"
                    className="border-panel bg-navy text-background absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border font-mono text-[10px] font-semibold"
                  >
                    {step.number}
                  </span>
                </div>
                <div className="font-display text-navy text-xl font-bold">
                  {step.title}
                </div>
                <p className="text-muted mt-1 text-sm">{step.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {featuredCrypto.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <Eyebrow>Featured providers</Eyebrow>
          <h2 className="font-display text-navy mt-4 text-3xl font-bold">
            A few crypto exchanges we&apos;ve verified.
          </h2>
          <p className="text-muted mt-1 text-sm">
            Shown alphabetically — not a ranking.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {featuredCrypto.map((offering) => (
              <FeaturedCryptoCard key={offering.id} offering={offering} />
            ))}
          </div>
          <Link
            href="/crypto/exchanges"
            className="text-blue mt-4 inline-block text-sm font-semibold"
          >
            See all exchanges →
          </Link>
        </section>
      )}

      {featuredShareTrading.length > 0 && (
        <section className="border-border mx-auto max-w-6xl border-t px-4 pt-10 pb-14">
          <h2 className="font-display text-navy text-3xl font-bold">
            A few share trading platforms we&apos;ve verified.
          </h2>
          <p className="text-muted mt-1 text-sm">
            Shown alphabetically — not a ranking.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {featuredShareTrading.map((offering) => (
              <FeaturedShareTradingCard key={offering.id} offering={offering} />
            ))}
          </div>
          <Link
            href="/share-trading"
            className="text-blue mt-4 inline-block text-sm font-semibold"
          >
            See all platforms →
          </Link>
        </section>
      )}
    </>
  );
}
