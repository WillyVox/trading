import Link from "next/link";
import { CustodyExplorer } from "@/components/tools/custody/CustodyExplorer";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Notice } from "@/components/ui/Notice";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getCustodyExplorerRows } from "@/lib/tools/custody/service";
import { CalculatorUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "CHESS vs Custody Explorer Australia",
  description:
    "Explore CHESS sponsorship, HINs and custodial ownership in plain English, then inspect source-linked custody records for share-trading platforms and markets.",
  path: "/tools/chess-vs-custody",
});

export default async function ChessVsCustodyPage() {
  const trail = breadcrumbTrail([
    { name: "Tools", path: "/tools" },
    { name: "CHESS vs custody", path: "/tools/chess-vs-custody" },
  ]);
  const rowsResult = await publicDatabaseRead(
    "getCustodyExplorerRows",
    getCustodyExplorerRows
  );
  const rows = rowsResult.ok ? rowsResult.data : [];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Ownership & custody"
        title="CHESS vs Custody Explorer"
        subheading="Understand how share ownership structures differ, what a HIN means, and how the structure can change by platform and market."
      />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {rowsResult.ok ? (
          <CustodyExplorer rows={rows} />
        ) : (
          <CalculatorUnavailable />
        )}

        <section
          className="mt-10 grid gap-4 md:grid-cols-2"
          aria-labelledby="chess-custody-difference"
        >
          <div className="border-border rounded-2xl border p-5">
            <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
              CHESS-sponsored
            </p>
            <h2
              id="chess-custody-difference"
              className="font-display text-navy mt-2 text-xl font-bold"
            >
              Registered on the CHESS subregister
            </h2>
            <p className="text-muted mt-3 text-sm leading-6">
              ASX describes a CHESS-sponsored holder as the person or entity
              registered in CHESS as the owner of the securities. The sponsored
              holder is identified by a HIN.
            </p>
            <a
              href="https://www.asx.com.au/holder-management"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue mt-3 inline-block text-sm font-semibold underline"
            >
              ASX holder-management source ↗
            </a>
          </div>
          <div className="border-border rounded-2xl border p-5">
            <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
              Custodial / omnibus
            </p>
            <h2 className="font-display text-navy mt-2 text-xl font-bold">
              Legal title can sit with a custodian
            </h2>
            <p className="text-muted mt-3 text-sm leading-6">
              ASX notes that an investor may instead have a beneficial interest
              where legal title is held by a custodian, including through an
              omnibus structure. The provider&apos;s terms determine how that
              arrangement operates.
            </p>
            <a
              href="https://www.asx.com.au/investors/investment-tools-and-resources/faqs-company-defaults"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue mt-3 inline-block text-sm font-semibold underline"
            >
              ASX ownership source ↗
            </a>
          </div>
        </section>

        <section className="mt-10 max-w-3xl" aria-labelledby="custody-scope">
          <h2
            id="custody-scope"
            className="font-display text-navy text-2xl font-bold"
          >
            Important scope
          </h2>
          <p className="text-muted mt-3 leading-7">
            CHESS is an Australian market infrastructure concept. A platform can
            use CHESS sponsorship for Australian holdings and a custodial
            structure for international holdings, so a single platform should
            not be given one universal ownership label.
          </p>
          <div className="mt-5">
            <Notice>
              This explorer describes ownership and custody structures; it does
              not rate one structure as safer, better or more suitable for you.
              Check the provider&apos;s current terms and official documentation
              before relying on a platform-specific record.
            </Notice>
          </div>
        </section>

        <section
          className="border-border mt-10 border-t pt-8"
          aria-labelledby="custody-research-next"
        >
          <h2
            id="custody-research-next"
            className="font-display text-navy text-xl font-bold"
          >
            Research next
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <Link
              className="text-blue underline"
              href="/compare/trading-platforms"
            >
              Compare share-trading platforms →
            </Link>
            <Link
              className="text-blue underline"
              href="/tools/brokerage-calculator"
            >
              Brokerage calculator →
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
