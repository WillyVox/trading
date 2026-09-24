import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { NavIcon, type NavIconName } from "@/components/layout/NavIcon";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Learn Share Trading & Crypto in Australia | Trading Guide",
  description:
    "Learn how share trading and cryptocurrency work in Australia with beginner guides, transparent calculators, worked examples and source-linked research.",
  path: "/",
});

type LearningStep = {
  label: string;
  description?: string;
  href: string;
};

type LearningPath = {
  eyebrow: string;
  title: string;
  description: string;
  steps: LearningStep[];
};

const learningPaths: LearningPath[] = [
  {
    eyebrow: "SHARE TRADING",
    title: "Learn share trading from the ground up",
    description:
      "Build the foundations first, then learn how costs, ownership and platform research fit together.",
    steps: [
      {
        label: "Start from zero",
        description:
          "Shares, trading, brokers and the basics of getting started.",
        href: "/guides/share-trading",
      },
      {
        label: "Understand trading costs",
        href: "/guides/trading-costs-explained",
      },
      {
        label: "Learn CHESS, HIN and custody",
        href: "/guides/chess-vs-custody",
      },
      {
        label: "Try the brokerage calculators",
        href: "/tools/brokerage-calculator",
      },
      {
        label: "Research share trading platforms",
        href: "/share-trading",
      },
    ],
  },
  {
    eyebrow: "CRYPTO",
    title: "Learn cryptocurrency without the hype",
    description:
      "Understand exchanges, funding, custody and fees before you start researching individual providers.",
    steps: [
      {
        label: "Start from zero",
        description:
          "Crypto basics, exchanges and a beginner-friendly starting point.",
        href: "/guides/crypto",
      },
      {
        label: "Understand crypto exchanges",
        href: "/guides/how-to-start-investing-in-crypto-for-beginners",
      },
      {
        label: "Learn funding and withdrawals",
        href: "/guides/crypto-exchange-funding-australia",
      },
      {
        label: "Understand crypto fees",
        href: "/guides/crypto-exchange-fees-australia",
      },
      {
        label: "Research crypto exchanges",
        href: "/crypto/exchanges",
      },
    ],
  },
];

const tools: {
  title: string;
  description: string;
  href: string;
  icon: NavIconName;
}[] = [
  {
    title: "Brokerage cost",
    description:
      "Estimate brokerage for a hypothetical Australian share-trading pattern.",
    href: "/tools/brokerage-calculator",
    icon: "calc",
  },
  {
    title: "FX fees",
    description:
      "Explore how currency conversion can affect an international trade.",
    href: "/tools/fx-fee-calculator",
    icon: "fx",
  },
  {
    title: "Regular investing",
    description:
      "Estimate repeated brokerage for a regular investing scenario.",
    href: "/tools/regular-investing-calculator",
    icon: "repeat",
  },
  {
    title: "Crypto costs",
    description:
      "Explore trading, funding and withdrawal costs for crypto scenarios.",
    href: "/tools/crypto-cost-calculator",
    icon: "coin",
  },
];

const popularLearning = [
  {
    tag: "SHARE TRADING",
    title: "Share trading for beginners",
    description:
      "Learn the basic concepts, terminology and steps before researching a trading platform.",
    href: "/guides/share-trading-for-beginners",
  },
  {
    tag: "COSTS",
    title: "Brokerage fees in Australia",
    description:
      "Understand common brokerage pricing models and why trading frequency and size matter.",
    href: "/guides/brokerage-fees-australia",
  },
  {
    tag: "OWNERSHIP",
    title: "CHESS vs custody",
    description:
      "Understand two common ways Australian investors may hold shares and what to research.",
    href: "/guides/chess-vs-custody",
  },
  {
    tag: "CRYPTO BASICS",
    title: "How crypto exchange fees work",
    description:
      "Learn about trading fees, spreads, funding and withdrawal costs before comparing exchanges.",
    href: "/guides/crypto-exchange-fees-australia",
  },
];

export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="Independent trading education · Australia"
        title="Understand trading before you start investing."
        subheading="Learn how share trading and cryptocurrency work, understand the costs and risks, then use source-linked research when you&lsquo;re ready to investigate platforms."
        ctas={[
          { label: "Start learning", href: "/guides", variant: "gold" },
          {
            label: "Explore research tools",
            href: "/tools",
            variant: "outline-soft",
          },
        ]}
        note={{
          label: "Compare platforms when you&lsquo;re ready →",
          href: "/compare",
        }}
        meta={[
          "Beginner-friendly guides",
          "Transparent calculators",
          "Source-linked research",
        ]}
        graphic="home"
      />

      <main>
        <section className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <Eyebrow>Choose your learning path</Eyebrow>
          <h2 className="font-display text-navy mt-4 max-w-3xl text-3xl font-bold md:text-4xl">
            Start with what you want to understand.
          </h2>
          <p className="text-muted mt-3 max-w-2xl text-base leading-7">
            No assumed experience. Follow a path in order or jump directly to
            the topic you need.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {learningPaths.map((path) => (
              <Card key={path.eyebrow} className="h-full p-5 sm:p-6">
                <span className="border-gold-soft bg-gold-soft/20 text-navy inline-flex rounded-full border px-3 py-1 font-mono text-xs font-semibold tracking-wide">
                  {path.eyebrow}
                </span>
                <h3 className="font-display text-navy mt-4 text-2xl font-bold">
                  {path.title}
                </h3>
                <p className="text-muted mt-2 max-w-xl text-sm leading-6">
                  {path.description}
                </p>
                <ol className="border-border mt-6 divide-y border-y">
                  {path.steps.map((step, index) => (
                    <li key={step.href}>
                      <Link
                        href={step.href}
                        className="group focus-visible:ring-gold-soft -mx-2 flex min-h-14 items-start gap-3 rounded-lg px-2 py-3 focus:outline-none focus-visible:ring-2"
                      >
                        <span className="text-gold mt-0.5 w-6 shrink-0 font-mono text-xs font-bold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="text-navy group-hover:text-blue block text-sm font-semibold">
                            {step.label} →
                          </span>
                          {step.description && (
                            <span className="text-muted mt-1 block text-xs leading-5">
                              {step.description}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-panel-secondary border-border border-y">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
            <Eyebrow>Learn by doing</Eyebrow>
            <h2 className="font-display text-navy mt-4 max-w-3xl text-3xl font-bold md:text-4xl">
              Put the concepts into a hypothetical scenario.
            </h2>
            <p className="text-muted mt-3 max-w-3xl text-base leading-7">
              Our calculators show their assumptions and help you explore how
              different costs can affect a scenario. They are educational tools,
              not predictions or personal advice.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="focus-visible:ring-gold-soft group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <Card className="hover:border-gold-soft h-full transition-colors">
                    <NavIcon name={tool.icon} />
                    <h3 className="font-display text-navy mt-4 text-xl font-bold">
                      {tool.title}
                    </h3>
                    <p className="text-muted mt-2 text-sm leading-6">
                      {tool.description}
                    </p>
                    <span className="text-blue mt-4 inline-block text-sm font-semibold">
                      Open tool →
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
            <Link
              href="/tools"
              className="text-blue mt-6 inline-block text-sm font-semibold"
            >
              Explore all research tools →
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <Eyebrow>Continue learning</Eyebrow>
          <h2 className="font-display text-navy mt-4 text-3xl font-bold md:text-4xl">
            Popular learning topics
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularLearning.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="focus-visible:ring-gold-soft group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <Card className="hover:border-gold-soft h-full transition-colors">
                  <span className="text-gold font-mono text-[11px] font-bold tracking-wider">
                    {guide.tag}
                  </span>
                  <h3 className="font-display text-navy group-hover:text-blue mt-3 text-xl font-bold">
                    {guide.title}
                  </h3>
                  <p className="text-muted mt-2 text-sm leading-6">
                    {guide.description}
                  </p>
                  <span className="text-blue mt-4 inline-block text-sm font-semibold">
                    Read guide →
                  </span>
                </Card>
              </Link>
            ))}
          </div>
          <Link
            href="/guides"
            className="text-blue mt-6 inline-block text-sm font-semibold"
          >
            Browse all guides →
          </Link>
        </section>

        <section className="border-border mx-auto max-w-6xl border-t px-4 py-14 md:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
            <div>
              <Eyebrow>How we research</Eyebrow>
              <h2 className="font-display text-navy mt-4 max-w-2xl text-3xl font-bold md:text-4xl">
                Facts should show where they came from.
              </h2>
              <p className="text-muted mt-3 max-w-2xl text-base leading-7">
                Provider research is kept distinct from educational content.
                Where practical, fees and features link back to source material
                and verification details so you can check important information
                yourself.
              </p>
              <div className="border-gold bg-gold-soft/10 mt-6 rounded-xl border-l-4 p-5">
                <p className="text-navy font-semibold">
                  No overall winner badges or hidden scores.
                </p>
                <p className="text-muted mt-1 text-sm leading-6">
                  Use the facts, calculators and source links to form your own
                  view. Commercial relationships are disclosed separately.
                </p>
              </div>
            </div>
            <Card className="bg-navy- h-full p-6">
              <div className="bg-navy rounded-2xl p-7 sm:p-8 lg:p-10">
                <p className="text-gold text-xs font-bold tracking-[0.18em] uppercase">
                  Research standard
                </p>

                <p className="mt-4 max-w-md text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
                  Important provider information should be easy to verify — not
                  hidden behind scores or unexplained rankings.
                </p>

                <ul className="mt-7 space-y-3 text-sm text-white/85 sm:text-base">
                  <li className="flex items-start gap-3">
                    <span
                      className="text-gold mt-0.5 font-bold"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span>Sources shown where practical</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span
                      className="text-gold mt-0.5 font-bold"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span>Review dates shown where available</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span
                      className="text-gold mt-0.5 font-bold"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span>Unknown information stays unknown</span>
                  </li>
                </ul>

                <Link
                  href="/methodology"
                  className="text-gold mt-8 inline-flex items-center font-semibold transition hover:underline"
                >
                  See how we research
                  <span className="ml-2" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        <section className="bg-panel-secondary border-border border-y">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
            <Eyebrow>When you&lsquo;re ready</Eyebrow>
            <h2 className="font-display text-navy mt-4 max-w-3xl text-3xl font-bold md:text-4xl">
              Research platforms after you understand the basics.
            </h2>
            <p className="text-muted mt-3 max-w-3xl text-base leading-7">
              Comparisons are research tools, not rankings. Explore factual
              provider information side by side after learning how fees,
              ownership and product features work.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Card className="h-full p-6">
                <h3 className="font-display text-navy text-2xl font-bold">
                  Share trading platforms
                </h3>
                <p className="text-muted mt-2 text-sm leading-6">
                  Research brokerage, market access, ownership structure and
                  other source-linked platform facts.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                  <Link
                    href="/share-trading"
                    className="text-blue text-sm font-semibold"
                  >
                    Research platforms →
                  </Link>
                  <Link
                    href="/compare/trading-platforms"
                    className="text-blue text-sm font-semibold"
                  >
                    Compare platform facts →
                  </Link>
                </div>
              </Card>
              <Card className="h-full p-6">
                <h3 className="font-display text-navy text-2xl font-bold">
                  Crypto exchanges
                </h3>
                <p className="text-muted mt-2 text-sm leading-6">
                  Research exchange fees, funding methods, features and other
                  factual provider information.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                  <Link
                    href="/crypto/exchanges"
                    className="text-blue text-sm font-semibold"
                  >
                    Research exchanges →
                  </Link>
                  <Link
                    href="/compare/crypto-exchanges"
                    className="text-blue text-sm font-semibold"
                  >
                    Compare exchange facts →
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
