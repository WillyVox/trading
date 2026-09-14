import { notFound } from "next/navigation";
import Link from "next/link";
import { getCryptoAssetBySlug } from "@/lib/crypto/service";
import { Card } from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const asset = await getCryptoAssetBySlug(slug);
  if (!asset) return buildMetadata({ title: "Asset not found", description: "", path: `/crypto/${slug}`, noIndex: true });

  return buildMetadata({
    title: `${asset.name} (${asset.symbol}): Guide, Exchanges & How It Works`,
    description:
      asset.description ??
      `${asset.name} (${asset.symbol}) explained \u2014 how it works, where to buy it in Australia, and related guides.`,
    path: `/crypto/${slug}`,
  });
}

export default async function CryptoAssetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const asset = await getCryptoAssetBySlug(slug);
  if (!asset) notFound();

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
        <h2 className="mb-4 font-display text-lg font-bold text-navy">Where to buy {asset.symbol} in Australia</h2>
        {asset.providers.length === 0 ? (
          <p className="text-sm text-muted">No exchanges linked to this asset yet.</p>
        ) : (
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {asset.providers.map((pa: any) => (
              <li key={pa.provider.id}>
                <Link href={`/crypto/exchanges/${pa.provider.slug}`} className="text-navy hover:underline">
                  {pa.provider.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {asset.articles.length > 0 && (
        <Card className="mt-4">
          <h2 className="mb-4 font-display text-lg font-bold text-navy">Related guides</h2>
          <ul className="space-y-2 text-sm">
            {asset.articles.map((aa: any) => (
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