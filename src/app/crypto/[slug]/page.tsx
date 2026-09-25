import { notFound } from "next/navigation";
import Link from "next/link";
import { getCryptoAssetBySlug } from "@/lib/crypto/service";
import { Card } from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";

import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const assetResult = await publicDatabaseRead("cryptoAsset.metadata", () =>
    getCryptoAssetBySlug(slug)
  );
  if (!assetResult.ok)
    return buildMetadata({
      title: "Crypto asset",
      description: "",
      path: `/crypto/${slug}`,
      noIndex: true,
    });
  const asset = assetResult.data;
  if (!asset)
    return buildMetadata({
      title: "Asset not found",
      description: "",
      path: `/crypto/${slug}`,
      noIndex: true,
    });

  return buildMetadata({
    title: `${asset.name} (${asset.symbol}): Guide, Exchanges & How It Works`,
    description:
      asset.description ??
      `${asset.name} (${asset.symbol}) explained \u2014 how it works, where to buy it in Australia, and related guides.`,
    path: `/crypto/${slug}`,
    image: "/images/og/crypto-asset.png",
  });
}

export default async function CryptoAssetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const assetResult = await publicDatabaseRead("cryptoAsset.detail", () =>
    getCryptoAssetBySlug(slug)
  );
  if (!assetResult.ok)
    return (
      <>
        <PageHero
          eyebrow="Crypto asset"
          title="Crypto research temporarily unavailable"
          subheading="We couldn't load this asset's research right now."
        />
        <main className="mx-auto max-w-4xl px-4 py-10">
          <DataUnavailable title="Asset data is temporarily unavailable">
            Please try again shortly. This is not being presented as a missing
            asset because the database could not be queried.
          </DataUnavailable>
        </main>
      </>
    );
  const asset = assetResult.data;
  if (!asset) notFound();

  // One entry per active crypto Offering, alphabetical and never ranked.
  // Product links use the Offering slug, matching profiles and comparisons.
  const exchanges = asset.offerings
    .map((oa) => oa.offering)
    .sort((a, b) => a.name.localeCompare(b.name));

  const trail = breadcrumbTrail([
    { name: "Crypto", path: "/crypto" },
    { name: asset.name, path: `/crypto/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow={asset.symbol}
        title={asset.name}
        subheading={asset.description ?? undefined}
        maxWidth="max-w-4xl"
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Card className="mt-8">
          <h2 className="font-display text-navy mb-4 text-lg font-bold">
            Where to buy {asset.symbol} in Australia
          </h2>
          {exchanges.length === 0 ? (
            <p className="text-muted text-sm">
              No exchanges linked to this asset yet.
            </p>
          ) : (
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {exchanges.map((exchange) => (
                <li key={exchange.id}>
                  <Link
                    href={`/crypto/exchanges/${exchange.slug}`}
                    className="text-navy hover:underline"
                  >
                    {exchange.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {asset.articles.length > 0 && (
          <Card className="mt-4">
            <h2 className="font-display text-navy mb-4 text-lg font-bold">
              Related guides
            </h2>
            <ul className="space-y-2 text-sm">
              {asset.articles.map((aa) => (
                <li key={aa.article.id}>
                  <Link
                    href={`/${aa.article.category === "news" ? "news" : "guides"}/${aa.article.slug}`}
                    className="text-navy hover:underline"
                  >
                    {aa.article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </>
  );
}
