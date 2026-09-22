import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";
import { getTopicCluster } from "@/lib/seo/topic-clusters";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Crypto Exchange Guides Australia — Fees, Funding & Research",
  description:
    "A structured crypto research path for Australians: beginner education, trading fees, funding and withdrawals, exchange profiles and source-linked comparisons.",
  path: "/guides/crypto",
});

export default function CryptoGuidesHub() {
  const cluster = getTopicCluster("crypto");
  const trail = breadcrumbTrail([
    { name: "Guides", path: "/guides" },
    { name: "Crypto", path: cluster.hubHref },
  ]);
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Crypto learning path"
        title="Understand crypto platforms before comparing exchange fees"
        subheading="Learn the transaction flow first, then inspect supported funding, trading and withdrawal costs before comparing source-linked exchange facts."
      />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <section className="max-w-3xl">
          <h2 className="font-display text-navy text-2xl font-bold">
            Separate each cost instead of chasing one headline fee
          </h2>
          <p className="text-muted mt-3 leading-7">
            Crypto costs can occur at funding, trading, conversion and
            withdrawal stages. This path keeps those components separate and
            leaves network-dependent, variable or unverified costs unresolved
            rather than presenting them as free.
          </p>
        </section>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cluster.links.map((item, index) => (
            <Link key={item.href} href={item.href}>
              <Card className="hover:border-gold-soft h-full transition-colors">
                <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
                  Step {index + 1} · {item.kind}
                </p>
                <h2 className="font-display text-navy mt-2 text-lg font-bold">
                  {item.title}
                </h2>
                <p className="text-muted mt-2 text-sm leading-6">
                  {item.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
        <Card className="mt-8">
          <h2 className="font-display text-navy text-lg font-bold">
            Evidence stays connected to the tools
          </h2>
          <p className="text-muted mt-2 text-sm leading-6">
            Where a calculator uses provider-derived pricing, it reads
            structured fee records with source and verification context.
            Exchange profiles and curated comparisons reuse that research
            instead of maintaining separate marketing-style fee claims.
          </p>
          <Link
            href="/methodology"
            className="text-blue mt-3 inline-block text-sm font-semibold underline"
          >
            Read the methodology →
          </Link>
        </Card>
      </main>
    </>
  );
}
