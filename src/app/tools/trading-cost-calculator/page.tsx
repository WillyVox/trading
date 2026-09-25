import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { TradingCostCalculator } from "@/components/tools/trading-cost/TradingCostCalculator";
import { RelatedTools } from "@/components/tools/shared/RelatedTools";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getBrokerageOfferings } from "@/lib/tools/brokerage/service";
import { getFxOfferings } from "@/lib/tools/fx/service";
import { CalculatorUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

export const metadata = buildMetadata({
  title: "Trading Cost Calculator Australia",
  description:
    "Estimate the brokerage and supported FX conversion costs covered by Trading Guide's verified platform pricing, with sources and limitations shown.",
  path: "/tools/trading-cost-calculator",
});
export const revalidate = 3600;

export default async function TradingCostCalculatorPage() {
  const dataResult = await publicDatabaseRead(
    "tradingCostCalculator.offerings",
    async () => {
      const [brokerageOfferings, fxOfferings] = await Promise.all([
        getBrokerageOfferings(),
        getFxOfferings(),
      ]);
      return { brokerageOfferings, fxOfferings };
    }
  );
  const brokerageOfferings = dataResult.ok
    ? dataResult.data.brokerageOfferings
    : [];
  const fxOfferings = dataResult.ok ? dataResult.data.fxOfferings : [];
  const trail = breadcrumbTrail([
    { name: "Tools", path: "/tools" },
    { name: "Trading cost calculator", path: "/tools/trading-cost-calculator" },
  ]);
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Trading costs"
        title="Trading Cost Calculator"
        subheading="Put supported brokerage and FX conversion costs into one transparent hypothetical trade scenario — without treating unknown costs as zero."
      />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {dataResult.ok ? (
          <TradingCostCalculator
            brokerageOfferings={brokerageOfferings}
            fxOfferings={fxOfferings}
          />
        ) : (
          <CalculatorUnavailable />
        )}
        <section
          className="mt-10 max-w-3xl"
          aria-labelledby="combined-methodology"
        >
          <h2
            id="combined-methodology"
            className="font-display text-navy text-2xl font-bold"
          >
            What the combined estimate means
          </h2>
          <p className="text-muted mt-3 leading-7">
            The tool reuses the same verified brokerage and FX rules used by
            Trading Guide's dedicated calculators. It only shows a numeric
            combined total when calculated components use the same currency. If
            brokerage is published in USD while the FX estimate is AUD, the
            components stay separate because adding them would require an
            exchange rate that this tool does not have.
          </p>
          <p className="text-muted mt-3 leading-7">
            The result is therefore an estimate of the costs covered by our
            structured data, not a claim that every cost of placing or settling
            a trade has been captured.
          </p>
          <div className="mt-5"></div>
        </section>
        <RelatedTools />
      </main>
    </>
  );
}
