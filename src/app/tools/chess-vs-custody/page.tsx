import Link from "next/link";
import { CustodyExplorer } from "@/components/tools/custody/CustodyExplorer";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Notice } from "@/components/ui/Notice";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getCustodyExplorerRows } from "@/lib/tools/custody/service";

export const metadata = buildMetadata({
  title: "CHESS vs Custody Explorer Australia",
  description: "Explore CHESS sponsorship, HINs and custodial ownership in plain English, then inspect source-linked custody records for share-trading platforms and markets.",
  path: "/tools/chess-vs-custody",
});

export default async function ChessVsCustodyPage() {
  const trail = breadcrumbTrail([
    { name: "Tools", path: "/tools" },
    { name: "CHESS vs custody", path: "/tools/chess-vs-custody" },
  ]);
  const rows = await getCustodyExplorerRows();

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
        <CustodyExplorer rows={rows} />

        <section className="mt-10 max-w-3xl" aria-labelledby="custody-scope">
          <h2 id="custody-scope" className="font-display text-navy text-2xl font-bold">Important scope</h2>
          <p className="text-muted mt-3 leading-7">CHESS is an Australian market infrastructure concept. A platform can use CHESS sponsorship for Australian holdings and a custodial structure for international holdings, so a single platform should not be given one universal ownership label.</p>
          <div className="mt-5"><Notice>General information only. This explorer describes ownership and custody structures; it does not rate one structure as safer, better or more suitable for you. Check the provider&apos;s current terms and official documentation before relying on a platform-specific record.</Notice></div>
        </section>

        <section className="border-border mt-10 border-t pt-8" aria-labelledby="custody-research-next">
          <h2 id="custody-research-next" className="font-display text-navy text-xl font-bold">Research next</h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <Link className="text-blue underline" href="/share-trading/compare">Compare share-trading platforms →</Link>
            <Link className="text-blue underline" href="/tools/brokerage-calculator">Brokerage calculator →</Link>
            <Link className="text-blue underline" href="/tools">All tools →</Link>
          </div>
        </section>
      </main>
    </>
  );
}
