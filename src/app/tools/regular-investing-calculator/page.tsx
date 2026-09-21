import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Notice } from "@/components/ui/Notice";
import { RegularInvestingCalculator } from "@/components/tools/regular-investing/RegularInvestingCalculator";
import { ToolDisclaimer } from "@/components/tools/shared/ToolDisclaimer";
import { RelatedTools } from "@/components/tools/shared/RelatedTools";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getBrokerageOfferings } from "@/lib/tools/brokerage/service";

export const metadata = buildMetadata({
  title: "Regular Investing Brokerage Calculator Australia",
  description:
    "Estimate the brokerage covered by verified pricing rules for a hypothetical regular investing pattern such as monthly, fortnightly or weekly contributions.",
  path: "/tools/regular-investing-calculator",
});

export const revalidate = 3600;

export default async function RegularInvestingCalculatorPage() {
  const trail = breadcrumbTrail([
    { name: "Tools", path: "/tools" },
    {
      name: "Regular investing calculator",
      path: "/tools/regular-investing-calculator",
    },
  ]);
  const offerings = await getBrokerageOfferings();
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Investing scenarios"
        title="Regular Investing Brokerage Calculator"
        subheading="See how repeated brokerage can add up when you invest the same amount on a regular schedule, using the verified rules already maintained by Trading Guide."
      />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {offerings.length > 0 ? (
          <RegularInvestingCalculator offerings={offerings} />
        ) : (
          <Notice>
            No verified calculator-ready brokerage rules are currently
            available. We would rather show no estimate than guess.
          </Notice>
        )}
        <section
          className="mt-10 max-w-3xl"
          aria-labelledby="regular-investing-methodology"
        >
          <h2
            id="regular-investing-methodology"
            className="font-display text-navy text-2xl font-bold"
          >
            What this scenario calculates
          </h2>
          <p className="text-muted mt-3 leading-7">
            This tool repeats one equal hypothetical buy using the same verified
            brokerage rule for every contribution. Monthly means 12
            contributions per year, fortnightly 26 and weekly 52. It calculates
            brokerage covered by that rule; it does not project investment
            returns or assume future provider pricing will stay the same.
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
