import Link from "next/link";
import { FxFeeCalculator } from "@/components/tools/fx/FxFeeCalculator";
import { getFxOfferings } from "@/lib/tools/fx/service";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Notice } from "@/components/ui/Notice";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "FX Fee Calculator Australia",
  description:
    "Estimate FX conversion costs using verified published pricing from supported Australian trading platforms, with calculations, sources and limitations explained.",
  path: "/tools/fx-fee-calculator",
});

export default async function FxFeeCalculatorPage() {
  const offerings = await getFxOfferings();
  const trail = breadcrumbTrail([
    { name: "Tools", path: "/tools" },
    { name: "FX fee calculator", path: "/tools/fx-fee-calculator" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Trading costs"
        title="FX Fee Calculator"
        subheading="Estimate currency-conversion costs from verified published platform pricing, with the calculation and source shown clearly."
      />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <FxFeeCalculator offerings={offerings} />

        <section className="mt-10 max-w-3xl" aria-labelledby="fx-how-it-works">
          <h2
            id="fx-how-it-works"
            className="font-display text-navy text-2xl font-bold"
          >
            How this calculator works
          </h2>
          <p className="text-muted mt-3 leading-7">
            This calculator uses verified, structured provider FX pricing where
            a published percentage can be represented without guessing. Enter a
            hypothetical Australian-dollar conversion amount to see the
            estimated FX cost and the arithmetic behind it.
          </p>
          <p className="text-muted mt-3 leading-7">
            Provider FX pricing can still be more complicated than a single
            percentage. Where a provider publishes variable pricing or a method
            that needs additional inputs, the tool explains the limitation
            rather than converting unknown pricing into a false $0 estimate.
          </p>
          <div className="mt-5">
            <Notice>
              General information only. Estimates use published provider pricing
              for a hypothetical conversion amount. They do not recommend a
              platform, predict the exchange rate or calculate every cost of an
              international trade.
            </Notice>
          </div>
        </section>

        <section
          className="border-border mt-10 border-t pt-8"
          aria-labelledby="fx-research-next"
        >
          <h2
            id="fx-research-next"
            className="font-display text-navy text-xl font-bold"
          >
            Research next
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <Link
              className="text-blue underline"
              href="/tools/brokerage-calculator"
            >
              Brokerage calculator →
            </Link>
            <Link className="text-blue underline" href="/share-trading/compare">
              Compare share-trading platforms →
            </Link>
            <Link className="text-blue underline" href="/tools">
              All tools →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
