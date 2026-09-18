import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOfferingBySlug } from '@/lib/offerings/service';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { ProviderLogo } from '@/components/providers/ProviderLogo';
import { Card } from '@/components/ui/Card';
import { OfferingAvailabilitySection } from '@/components/offerings/OfferingAvailabilitySection';
import { OfferingCustodySection } from '@/components/offerings/OfferingCustodySection';
import { formatProductType, formatAccountType } from '@/lib/offerings/labels';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/layout/PageHero';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offering = await getOfferingBySlug(slug);
  if (!offering)
    return buildMetadata({
      title: 'Platform not found',
      description: '',
      path: `/share-trading/${slug}`,
      noIndex: true,
    });

  return buildMetadata({
    title: `${offering.name} Australia Review: Markets, Custody & Verified Facts`,
    description:
      offering.description ??
      `${offering.name} share trading platform profile for Australian users \u2014 market access, ownership structures, and source-verified facts.`,
    path: `/share-trading/${slug}`,
    seoTitle: offering.seoTitle,
    seoDescription: offering.seoDescription,
    noIndex: offering.noIndex,
  });
}

export default async function ShareTradingOfferingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offering = await getOfferingBySlug(slug);
  if (!offering) notFound();

  const trail = breadcrumbTrail([
    { name: 'Share trading', path: '/share-trading' },
    { name: offering.name, path: `/share-trading/${slug}` },
  ]);

  const marketRows = offering.markets.map((m) => ({
    id: m.id,
    label: m.market.name,
    availability: m.availability,
    notes: m.notes,
  }));

  const productRows = offering.products.map((p) => ({
    id: p.id,
    label: formatProductType(p.productType),
    availability: p.availability,
    notes: p.notes,
  }));

  const accountTypeRows = offering.accountTypes.map((a) => ({
    id: a.id,
    label: formatAccountType(a.accountType),
    availability: a.availability,
    notes: a.notes,
  }));

  const custodyRows = offering.custody.map((c) => ({
    id: c.id,
    marketName: c.market?.name ?? null,
    custodyType: c.custodyType,
    custodianName: c.custodianName,
    verificationStatus: c.verificationStatus,
  }));

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Share trading platform profile"
        title={`${offering.name} Australia review`}
        subheading={offering.description ?? undefined}
        maxWidth="max-w-4xl"
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <ProviderLogo logo={offering.logo} name={offering.name} size="lg" />
            <div className="min-w-0">
              <h2 className="font-display text-navy truncate text-lg font-bold">
                {offering.name}
              </h2>
              <VerificationBadge status={offering.verificationStatus} />
            </div>
          </div>
        </div>

        <Card className="mt-8">
          <h2 className="font-display text-navy mb-1 text-lg font-bold">
            {offering.provider.name}
          </h2>
          <p className="text-muted text-sm">
            {offering.name} is a share trading product offered by{' '}
            {offering.provider.name}.
          </p>
        </Card>

        <OfferingAvailabilitySection
          title="Markets"
          emptyLabel="No market access data yet."
          rows={marketRows}
        />

        <OfferingAvailabilitySection
          title="Products"
          emptyLabel="No product data yet."
          rows={productRows}
        />

        <OfferingCustodySection rows={custodyRows} />

        <OfferingAvailabilitySection
          title="Account types"
          emptyLabel="No account type data yet."
          rows={accountTypeRows}
        />

        <Card className="mt-4">
          <p className="text-muted text-xs">
            Fees, order types, and platform features for share trading platforms
            are still being researched and aren&apos;t shown yet &mdash; see{' '}
            <Link href="/methodology" className="underline">
              our methodology
            </Link>{' '}
            for how we verify facts before publishing them.
          </p>
        </Card>
      </div>
    </>
  );
}
