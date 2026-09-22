import Link from "next/link";
import { safeDatabaseQuery } from "@/lib/data/safe-database-query";
import { CalculatorUnavailable } from "@/components/data/CalculatorUnavailable";
import { CryptoFundingWithdrawalCalculator } from "@/components/tools/crypto-funding/CryptoFundingWithdrawalCalculator";
import { ToolDisclaimer } from "@/components/tools/shared/ToolDisclaimer";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCryptoFeeOfferings } from "@/lib/tools/crypto-fees/service";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Crypto Deposit & Withdrawal Fees Australia",
  description:
    "Explore source-linked crypto exchange deposit and withdrawal fees, including free, percentage, fixed and network-dependent fee records.",
  path: "/tools/crypto-funding-withdrawal-fees",
});
export const revalidate = 3600;

export default async function CryptoFundingWithdrawalFeesPage() {
  const offeringsResult = await safeDatabaseQuery("getCryptoFeeOfferings", () =>
    getCryptoFeeOfferings()
  );
  const offerings = offeringsResult.ok ? offeringsResult.data : [];
  const trail = breadcrumbTrail([
    { name: "Tools", path: "/tools" },
    {
      name: "Crypto deposit & withdrawal fees",
      path: "/tools/crypto-funding-withdrawal-fees",
    },
  ]);
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Crypto funding"
        title="Crypto Deposit & Withdrawal Fees"
        subheading="Explore the published costs of moving money or crypto into and out of supported exchanges without guessing network-dependent fees."
      />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {!offeringsResult.ok ? (
          <CalculatorUnavailable />
        ) : (
          <CryptoFundingWithdrawalCalculator offerings={offerings} />
        )}
        <section className="mt-10 max-w-3xl">
          <h2 className="font-display text-navy text-2xl font-bold">
            Why withdrawal costs can stay variable
          </h2>
          <p className="text-muted mt-3 leading-7">
            Some exchanges publish a fixed withdrawal fee, while others
            calculate a cryptocurrency or network-dependent amount at the time
            of transfer. Trading Guide keeps those records variable unless the
            verified rule contains a deterministic amount.
          </p>
          <div className="mt-5">
            <ToolDisclaimer />
          </div>
        </section>
        <section className="border-border mt-10 border-t pt-8">
          <div className="flex flex-wrap gap-5 text-sm font-semibold">
            <Link
              className="text-blue underline"
              href="/tools/crypto-cost-calculator"
            >
              Crypto cost scenario →
            </Link>
            <Link
              className="text-blue underline"
              href="/tools/crypto-fee-calculator"
            >
              Crypto trading fees →
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
