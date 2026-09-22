import { BrokerageCalculator } from "@/components/tools/brokerage/BrokerageCalculator";
import { safeDatabaseQuery } from "@/lib/data/safe-database-query";
import { CalculatorUnavailable } from "@/components/data/CalculatorUnavailable";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Notice } from "@/components/ui/Notice";
import { ToolDisclaimer } from "@/components/tools/shared/ToolDisclaimer";
import { RelatedTools } from "@/components/tools/shared/RelatedTools";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getBrokerageOfferings } from "@/lib/tools/brokerage/service";

export const metadata = buildMetadata({
  title: "Brokerage Cost Calculator Australia",
  description:
    "Calculate supported published share-trading brokerage fees for a hypothetical trade and see the pricing rule, calculation, assumptions and source.",
  path: "/tools/brokerage-calculator",
});

export const revalidate = 3600;

export default async function BrokerageCalculatorPage() {
  const trail = breadcrumbTrail([
    { name: "Tools", path: "/tools" },
    { name: "Brokerage calculator", path: "/tools/brokerage-calculator" },
  ]);
  const offeringsResult = await safeDatabaseQuery("getBrokerageOfferings", () =>
    getBrokerageOfferings()
  );
  const offerings = offeringsResult.ok ? offeringsResult.data : [];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Trading costs"
        title="Brokerage Cost Calculator"
        subheading="Apply supported published brokerage rules to a hypothetical trade, then inspect exactly how the estimate was produced."
      />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {!offeringsResult.ok ? (
          <CalculatorUnavailable />
        ) : offerings.length > 0 ? (
          <BrokerageCalculator offerings={offerings} />
        ) : (
          <Notice>
            No verified calculator-ready brokerage rules are currently
            available. We would rather show no estimate than guess.
          </Notice>
        )}
        <section className="mt-10 max-w-3xl" aria-labelledby="how-it-works">
          <h2
            id="how-it-works"
            className="font-display text-navy text-2xl font-bold"
          >
            How this calculator works
          </h2>
          <p className="text-muted mt-3 leading-7">
            The calculator uses verified brokerage rules stored against Trading
            Guide&apos;s share-trading offerings. It supports deterministic
            value-based rules such as flat fees, percentages, greater-of rules
            and trade-value tiers. Pricing that depends on information we do not
            model is not forced into an estimate.
          </p>
          <div className="mt-5">
            <ToolDisclaimer />
          </div>
        </section>
        <RelatedTools />
      </main>
    </>
  );
}
