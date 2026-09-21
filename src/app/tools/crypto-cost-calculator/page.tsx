import Link from "next/link";
import { CryptoCostCalculator } from "@/components/tools/crypto-cost/CryptoCostCalculator";
import { ToolDisclaimer } from "@/components/tools/shared/ToolDisclaimer";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCryptoFeeOfferings } from "@/lib/tools/crypto-fees/service";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Crypto Cost Calculator Australia",
  description:
    "Combine supported crypto deposit, trading and withdrawal fee components in one transparent hypothetical scenario using source-linked fee records.",
  path: "/tools/crypto-cost-calculator",
});
export const revalidate = 3600;

export default async function CryptoCostCalculatorPage() {
  const offerings = await getCryptoFeeOfferings();
  const trail = breadcrumbTrail([
    { name: "Tools", path: "/tools" },
    { name: "Crypto cost calculator", path: "/tools/crypto-cost-calculator" },
  ]);
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Crypto costs"
        title="Crypto Cost Calculator"
        subheading="Combine the fee components Trading Guide can support for a hypothetical deposit, trade and optional withdrawal — without turning unknown costs into zero."
      />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <CryptoCostCalculator offerings={offerings} />
        <section className="mt-10 max-w-3xl">
          <h2 className="font-display text-navy text-2xl font-bold">
            What the combined number means
          </h2>
          <p className="text-muted mt-3 leading-7">
            The combined total is shown only when every selected component is
            calculatable in the same currency. A BTC-denominated withdrawal fee
            cannot be added to an AUD trading fee without an exchange rate, and
            variable network fees prevent a complete combined total.
          </p>
          <div className="mt-5">
            <ToolDisclaimer />
          </div>
        </section>
        <section className="border-border mt-10 border-t pt-8">
          <div className="flex flex-wrap gap-5 text-sm font-semibold">
            <Link
              className="text-blue underline"
              href="/tools/crypto-funding-withdrawal-fees"
            >
              Deposit & withdrawal fees →
            </Link>
            <Link
              className="text-blue underline"
              href="/tools/crypto-fee-calculator"
            >
              Crypto fee calculator →
            </Link>
            <Link
              className="text-blue underline"
              href="/crypto/exchanges/compare"
            >
              Compare crypto exchanges →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
