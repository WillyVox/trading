import { notFound } from "next/navigation";
import Link from "next/link";
import { getProviderBySlug, getRelatedContentForProvider } from "@/lib/providers/service";
import { getActiveAffiliateLink } from "@/lib/affiliates/service";
import { groupFeatures, type ProviderFeatureRow } from "@/lib/providers/features";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { AffiliateCTA } from "@/components/affiliate/AffiliateCTA";
import { Card } from "@/components/ui/Card";
import { ProviderFeatureSection } from "@/components/providers/ProviderFeatureSection";
import { ProviderProsCons } from "@/components/providers/ProviderProsCons";
import { RelatedGuides } from "@/components/guide/RelatedGuides";
import { RelatedNews } from "@/components/providers/RelatedNews";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider)
    return buildMetadata({ title: "Exchange not found", description: "", path: `/crypto/exchanges/${slug}`, noIndex: true });

  return buildMetadata({
    title: `${provider.name} Australia Review: Fees, Features & Verified Facts`,
    description:
      provider.description ??
      `${provider.name} crypto exchange profile for Australian users \u2014 fees, features, and source-verified facts.`,
    path: `/crypto/exchanges/${slug}`,
    seoTitle: provider.seoTitle,
    seoDescription: provider.seoDescription,
    noIndex: provider.noIndex,
  });
}

export default async function ExchangeProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();
  const [link, relatedContent] = await Promise.all([
    getActiveAffiliateLink(slug),
    getRelatedContentForProvider(provider.id),
  ]);

  const featureGroups = groupFeatures(provider.features as ProviderFeatureRow[]);

  const trail = breadcrumbTrail([
    { name: "Exchanges", path: "/crypto/exchanges" },
    { name: provider.name, path: `/crypto/exchanges/${slug}` },
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold text-navy">{provider.name}</h1>
        <VerificationBadge status={provider.verificationStatus} />
      </div>
      <p className="mt-2 text-muted">{provider.description}</p>

      <Card className="mt-8">
        <h2 className="mb-4 font-display text-lg font-bold text-navy">Facts</h2>
        <ul className="space-y-2 text-sm">
          {provider.facts.map((f: any) => (
            <li key={f.id} className="flex justify-between border-b border-border pb-2">
              <span className="text-muted">{f.label}</span>
              <span>{f.value}</span>
            </li>
          ))}
          {provider.facts.length === 0 && <li className="text-muted">No verified facts yet.</li>}
        </ul>
      </Card>

      <Card className="mt-4">
        <h2 className="mb-4 font-display text-lg font-bold text-navy">Fees</h2>
        <ul className="space-y-2 text-sm">
          {provider.fees.map((f: any) => (
            <li key={f.id} className="flex justify-between border-b border-border pb-2">
              <span className="text-muted">{f.label}</span>
              <span>{f.displayValue ?? "Not verified"}</span>
            </li>
          ))}
          {provider.fees.length === 0 && <li className="text-muted">No fee data yet.</li>}
        </ul>
      </Card>

      <ProviderFeatureSection
        title="Products & trading"
        emptyLabel="No product/trading feature data yet."
        features={featureGroups.products}
      />

      <ProviderFeatureSection
        title="Deposits & withdrawals"
        emptyLabel="No deposit/withdrawal method data yet."
        features={featureGroups.deposits}
      />

      <ProviderFeatureSection
        title="Security"
        emptyLabel="No security data yet."
        features={featureGroups.security}
      />

      <ProviderProsCons items={provider.prosCons} />

      {provider.assets.length > 0 && (
        <Card className="mt-4">
          <h2 className="mb-4 font-display text-lg font-bold text-navy">Supported assets</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {provider.assets.map((pa: any) => (
              <Link
                key={pa.asset.id}
                href={`/crypto/${pa.asset.slug}`}
                className="rounded-full border border-border px-3 py-1 hover:border-gold-soft"
              >
                {pa.asset.symbol}
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* showDisclosure defaults to true: this is the only AffiliateCTA on the
          page, so — unlike RelatedProviders/RelatedNews sections that render
          several cards under one shared <AffiliateDisclosure /> — it must
          carry its own disclosure rather than none at all. */}
      {link && <AffiliateCTA partnerSlug={slug} providerName={provider.name} />}

      <RelatedGuides guides={relatedContent.guides} />
      <RelatedNews items={relatedContent.news} />
    </div>
  );
}