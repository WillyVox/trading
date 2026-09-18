import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getProviderBySlug,
  getProviders,
  getRelatedContentForProvider,
} from '@/lib/providers/service';
import { getActiveAffiliateLink } from '@/lib/affiliates/service';
import {
  groupFeatures,
  type ProviderFeatureRow,
} from '@/lib/providers/features';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { ProviderLogo } from '@/components/providers/ProviderLogo';
import { AffiliateCTA } from '@/components/affiliate/AffiliateCTA';
// import { CompareSelector } from "@/components/compare/CompareSelector";
import { Card } from '@/components/ui/Card';
import { ProviderFeatureSection } from '@/components/providers/ProviderFeatureSection';
import { ProviderProsCons } from '@/components/providers/ProviderProsCons';
import { RelatedGuides } from '@/components/guide/RelatedGuides';
import { RelatedNews } from '@/components/providers/RelatedNews';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/layout/PageHero';
import { VisitSite } from '@/components/affiliate/VisitSite';

function formatProviderType(type: string) {
  const label = type.replace(/_/g, ' ').toLowerCase();
  return `${label.charAt(0).toUpperCase()}${label.slice(1)} profile`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider)
    return buildMetadata({
      title: 'Exchange not found',
      description: '',
      path: `/crypto/exchanges/${slug}`,
      noIndex: true,
    });

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

export default async function ExchangeProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();
  const [link, relatedContent, comparablesResult] = await Promise.all([
    getActiveAffiliateLink(slug),
    getRelatedContentForProvider(provider.id),
    // Same providerType only, per product decision -- if this provider has
    // no providerType set, getProviders() returns the unfiltered pool (see
    // its opts.providerType ternary), so that edge case surfaces as "compare
    // with everyone" rather than an empty list.
    provider.providerType
      ? getProviders({ providerType: provider.providerType })
      : getProviders(),
  ]);
  const comparableProviders = comparablesResult.items
    .filter((p: any) => p.slug !== slug)
    .map((p: any) => ({ id: p.id, slug: p.slug, name: p.name }));

  const featureGroups = groupFeatures(
    provider.features as ProviderFeatureRow[]
  );

  const trail = breadcrumbTrail([
    { name: 'Exchanges', path: '/crypto/exchanges' },
    { name: provider.name, path: `/crypto/exchanges/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow={formatProviderType(provider.providerType)}
        title={`${provider.name} Australia review`}
        subheading={provider.description ?? undefined}
        maxWidth="max-w-4xl"
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <ProviderLogo logo={provider.logo} name={provider.name} size="lg" />
            <div className="min-w-0">
              <h2 className="font-display text-navy truncate text-lg font-bold">
                {provider.name}
              </h2>
              <VerificationBadge status={provider.verificationStatus} />
            </div>
          </div>
          {link && <VisitSite partnerSlug={slug} placement="Exchange" />}
        </div>

        <Card className="mt-8">
          <h2 className="font-display text-navy mb-4 text-lg font-bold">
            Facts
          </h2>
          <ul className="space-y-2 text-sm">
            {provider.facts.map((f: any) => (
              <li
                key={f.id}
                className="border-border flex justify-between border-b pb-2"
              >
                <span className="text-muted">{f.label}</span>
                <span>{f.value}</span>
              </li>
            ))}
            {provider.facts.length === 0 && (
              <li className="text-muted">No verified facts yet.</li>
            )}
          </ul>
        </Card>

        <Card className="mt-4">
          <h2 className="font-display text-navy mb-4 text-lg font-bold">
            Fees
          </h2>
          <ul className="space-y-2 text-sm">
            {provider.fees.map((f: any) => (
              <li
                key={f.id}
                className="border-border flex justify-between border-b pb-2"
              >
                <span className="text-muted">{f.label}</span>
                <span>{f.displayValue ?? 'Not verified'}</span>
              </li>
            ))}
            {provider.fees.length === 0 && (
              <li className="text-muted">No fee data yet.</li>
            )}
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
            <h2 className="font-display text-navy mb-4 text-lg font-bold">
              Supported assets
            </h2>
            <div className="flex flex-wrap gap-2 text-sm">
              {provider.assets.map((pa: any) => (
                <Link
                  key={pa.asset.id}
                  href={`/crypto/${pa.asset.slug}`}
                  className="border-border hover:border-gold-soft rounded-full border px-3 py-1"
                >
                  {pa.asset.symbol}
                </Link>
              ))}
            </div>
          </Card>
        )}

        {/* The hero's compact AffiliateCTA above renders showDisclosure={false} --
          this is the one AffiliateCTA on the page that actually shows the
          disclosure, so it must stay true rather than false. */}
        {/* {link && <AffiliateCTA partnerSlug={slug} providerName={provider.name} showDisclosure={true} />} */}

        <RelatedGuides guides={relatedContent.guides} />
        <RelatedNews items={relatedContent.news} />
      </div>
    </>
  );
}
