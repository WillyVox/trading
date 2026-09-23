import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "How We Get Paid",
  description:
    "How Trading Guide is funded, how commercial relationships may work, and how we keep them separate from our research and comparison methodology.",
  path: "/how-we-get-paid",
  image: "/images/og/how-we-get-paid.png",
});

const EFFECTIVE_DATE = "September 2026";

const FUTURE_MODEL = [
  {
    step: "01",
    title: "You follow a provider link",
    body: "Some provider links may become affiliate or referral links once a commercial partnership is active.",
  },
  {
    step: "02",
    title: "The provider may pay us",
    body: "If you sign up or complete an eligible action, the provider may pay Trading Guide a referral commission.",
  },
  {
    step: "03",
    title: "Trading Guide stays free to use",
    body: "Trading Guide does not add a fee for using an affiliate link. Provider pricing, eligibility, offers, and terms are set by the provider and should be checked directly.",
  },
];

const INDEPENDENCE_PRINCIPLES = [
  {
    title: "Provider coverage",
    body: "A commercial relationship does not determine whether a provider is eligible to be researched or included.",
  },
  {
    title: "Research findings",
    body: "Providers do not determine the facts, sources, verification status, or research findings we publish.",
  },
  {
    title: "Comparison order",
    body: "Commercial relationships do not determine the default alphabetical order used in our comparison experiences.",
  },
  {
    title: "Editorial content",
    body: "Commercial partners do not write, approve, or control our independent editorial content.",
  },
];

export default function HowWeGetPaidPage() {
  const trail = breadcrumbTrail([
    { name: "Methodology", path: "/methodology" },
    { name: "How We Get Paid", path: "/how-we-get-paid" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Transparency"
        title="How we get paid"
        subheading="How Trading Guide is funded, how commercial relationships may work, and how we keep them separate from our research."
        graphic="methodology"
      />

      <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <section aria-labelledby="current-funding">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-gold font-mono text-xs font-semibold tracking-[0.16em] uppercase">
                Our position today
              </p>
              <h2
                id="current-funding"
                className="font-display text-navy mt-2 text-2xl font-bold md:text-3xl"
              >
                Currently self-funded
              </h2>
            </div>
            <p className="text-muted font-mono text-xs tracking-wide uppercase">
              As of {EFFECTIVE_DATE}
            </p>
          </div>

          <Card className="border-gold/40 bg-gold/5">
            <div className="flex gap-4">
              <div
                aria-hidden="true"
                className="bg-navy text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold"
              >
                ✓
              </div>
              <div>
                <h3 className="font-display text-navy text-lg font-bold">
                  Trading Guide currently receives no affiliate commissions from
                  featured providers.
                </h3>
                <p className="text-muted mt-2 max-w-3xl text-sm leading-relaxed">
                  As of {EFFECTIVE_DATE}, Trading Guide is self-funded and does
                  not receive compensation, referral fees, or affiliate
                  commissions from financial providers featured on the site. Our
                  research and comparisons are produced using our published
                  methodology.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-14" aria-labelledby="future-model">
          <p className="text-gold font-mono text-xs font-semibold tracking-[0.16em] uppercase">
            Our business model
          </p>
          <h2
            id="future-model"
            className="font-display text-navy mt-2 text-2xl font-bold md:text-3xl"
          >
            How the model may work
          </h2>
          <p className="text-muted mt-3 max-w-3xl text-sm leading-relaxed">
            To help fund the research, tools, and comparisons while keeping
            Trading Guide free to use, we may enter selected commercial
            partnerships in the future.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {FUTURE_MODEL.map((item) => (
              <Card key={item.step}>
                <span className="text-gold font-mono text-sm font-semibold">
                  {item.step}
                </span>
                <h3 className="font-display text-navy mt-4 text-lg font-bold">
                  {item.title}
                </h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  {item.body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="independence">
          <p className="text-gold font-mono text-xs font-semibold tracking-[0.16em] uppercase">
            Editorial separation
          </p>
          <h2
            id="independence"
            className="font-display text-navy mt-2 text-2xl font-bold md:text-3xl"
          >
            What commercial relationships will not control
          </h2>
          <p className="text-muted mt-3 max-w-3xl text-sm leading-relaxed">
            If commercial relationships are introduced, we intend to keep them
            separate from the research and editorial decisions that shape
            Trading Guide.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {INDEPENDENCE_PRINCIPLES.map((principle) => (
              <Card key={principle.title}>
                <h3 className="font-display text-navy font-bold">
                  {principle.title}
                </h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  {principle.body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="sponsored-content">
          <Card className="bg-panel-secondary">
            <p className="text-gold font-mono text-xs font-semibold tracking-[0.16em] uppercase">
              Clear labelling
            </p>
            <h2
              id="sponsored-content"
              className="font-display text-navy mt-2 text-xl font-bold"
            >
              Sponsored content and advertising
            </h2>
            <p className="text-muted mt-3 max-w-4xl text-sm leading-relaxed">
              If Trading Guide introduces sponsored content or paid advertising
              placements, we will identify them clearly near the relevant
              placement. For more detail about commercial links and disclosures,
              read our affiliate disclosure.
            </p>
          </Card>
        </section>

        <section className="border-border mt-12 border-t pt-8">
          <h2 className="font-display text-navy text-xl font-bold">
            For more detail!
          </h2>
          <p className="text-muted mt-2 text-sm">
            Read the policies behind our commercial disclosures, comparison
            research, and editorial process.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link
              href="/affiliate-disclosure"
              className="text-blue underline underline-offset-2"
            >
              Affiliate disclosure
            </Link>
            <Link
              href="/methodology/comparisons"
              className="text-blue underline underline-offset-2"
            >
              Comparison methodology
            </Link>
            <Link
              href="/methodology/editorial-policy"
              className="text-blue underline underline-offset-2"
            >
              Editorial policy
            </Link>
            <Link
              href="/contact"
              className="text-blue underline underline-offset-2"
            >
              Contact us
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
