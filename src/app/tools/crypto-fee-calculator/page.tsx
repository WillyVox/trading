import Link from "next/link";
import { CryptoFeeCalculator } from "@/components/tools/crypto-fees/CryptoFeeCalculator";
import { ToolDisclaimer } from "@/components/tools/shared/ToolDisclaimer";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCryptoFeeOfferings } from "@/lib/tools/crypto-fees/service";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Crypto Fee Calculator Australia",
  description:
    "Explore verified published crypto exchange fees and calculate supported percentage or flat fees without treating tiered, spread or network-dependent costs as zero.",
  path: "/tools/crypto-fee-calculator",
});
export const revalidate = 3600;

export default async function CryptoFeeCalculatorPage() {
  const offerings = await getCryptoFeeOfferings();
  const trail = breadcrumbTrail([
    { name: "Tools", path: "/tools" },
    { name: "Crypto fee calculator", path: "/tools/crypto-fee-calculator" },
  ]);
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Crypto costs"
        title="Crypto Fee Calculator"
        subheading="Explore source-linked exchange fees and calculate only the parts the published data supports."
      />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <CryptoFeeCalculator offerings={offerings} />
        <section className="mt-10 max-w-3xl">
          <h2 className="font-display text-navy text-2xl font-bold">
            Why some crypto costs are not reduced to one number
          </h2>
          <p className="text-muted mt-3 leading-7">
            Crypto pricing can depend on maker/taker status, rolling trading
            volume, the asset or network, payment method, liquidity and live
            spreads. Trading Guide calculates a fee only when the verified
            structured rule supports it. Tiered or variable records stay visibly
            tiered or variable rather than becoming a misleading $0 estimate.
          </p>
          <div className="mt-5">
            <ToolDisclaimer />
          </div>
        </section>
        <section className="border-border mt-10 border-t pt-8">
          <h2 className="font-display text-navy text-xl font-bold">
            Research next
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <Link className="text-blue underline" href="/crypto/exchanges">
              Crypto exchanges →
            </Link>
            <Link
              className="text-blue underline"
              href="/compare/crypto-exchanges"
            >
              Compare crypto exchanges →
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
