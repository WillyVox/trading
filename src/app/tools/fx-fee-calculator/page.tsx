import Link from "next/link";
import { FxFeeCalculator } from "@/components/tools/fx/FxFeeCalculator";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Notice } from "@/components/ui/Notice";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "FX Fee Calculator Australia",
  description: "See how a percentage-based foreign exchange fee is calculated on a hypothetical Australian-dollar amount, with the formula, assumptions and exclusions explained.",
  path: "/tools/fx-fee-calculator",
});

export default function FxFeeCalculatorPage() {
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
        subheading="Learn how a percentage-based currency conversion fee works using a transparent hypothetical calculation."
      />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <FxFeeCalculator />

        <section className="mt-10 max-w-3xl" aria-labelledby="fx-how-it-works">
          <h2 id="fx-how-it-works" className="font-display text-navy text-2xl font-bold">How this calculator works</h2>
          <p className="text-muted mt-3 leading-7">
            This first version is deliberately educational. It applies the percentage you enter to an Australian-dollar amount so you can inspect the arithmetic. It does not look up a platform fee, an exchange rate or an FX spread, and it does not imply that the percentage entered is available from any provider.
          </p>
          <p className="text-muted mt-3 leading-7">
            Provider-specific FX pricing can be more complicated: a provider may publish a percentage conversion fee, use a variable spread, apply minimum charges, or use different rules depending on how currency is converted. Trading Guide will only add provider-data mode where the structured data can support the calculation without guessing.
          </p>
          <div className="mt-5">
            <Notice>
              General information only. This worked example explains percentage-fee arithmetic for a hypothetical scenario. It does not recommend a platform, predict an exchange rate or calculate every cost of an international trade.
            </Notice>
          </div>
        </section>

        <section className="border-border mt-10 border-t pt-8" aria-labelledby="fx-research-next">
          <h2 id="fx-research-next" className="font-display text-navy text-xl font-bold">Research next</h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <Link className="text-blue underline" href="/tools/brokerage-calculator">Brokerage calculator →</Link>
            <Link className="text-blue underline" href="/share-trading/compare">Compare share-trading platforms →</Link>
            <Link className="text-blue underline" href="/tools">All tools →</Link>
          </div>
        </section>
      </main>
    </>
  );
}
