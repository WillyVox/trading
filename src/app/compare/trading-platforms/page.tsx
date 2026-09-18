import { getAllOfferingsForCompare } from '@/lib/offerings/service';
import {
  buildOfferingComparisonSections,
  toComparisonSubjects,
} from '@/lib/offerings/compare';
import { CompareTable } from '@/components/compare/CompareTable';
import { CompareMobileCards } from '@/components/compare/CompareMobileCards';
import { SectionAffiliateDisclosure } from '@/components/affiliate/AffiliateDisclosure';
import { PageHero } from '@/components/layout/PageHero';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata = buildMetadata({
  title:
    'Compare Share Trading Platforms Australia \u2014 Markets, Products & Custody',
  description:
    'A single, always-current comparison of every share trading platform in our Offering domain \u2014 market access, products, custody arrangements, and account types side by side.',
  path: '/compare/trading-platforms',
});

/**
 * The share trading counterpart to /compare/crypto-exchanges, unlocked by
 * the unified compare engine (see src/lib/compare/types.ts). Same rationale
 * for being indexable: it always includes every active offering, so the set
 * is deterministic and the content is real, rather than an arbitrary
 * user-typed combination the way /compare/[slug] is.
 *
 * No OG image yet -- unlike the crypto page there's no
 * /images/og/compare-trading-platforms.png generated, and pointing at a
 * missing asset is worse than falling back to the site default. Add it via
 * scripts/generate-page-og-images.ts and set `image` here.
 */
export default async function CompareTradingPlatformsPage() {
  const offerings = await getAllOfferingsForCompare();
  const subjects = toComparisonSubjects(offerings);
  const sections = buildOfferingComparisonSections(offerings);
  // Always false today -- the offering domain has no affiliate tier (see
  // toComparisonSubjects's comment in src/lib/offerings/compare.ts). Kept
  // as a real check, not hardcoded false, so this page picks up a
  // disclosure automatically if that tier is ever added.
  const hasAffiliateCta = subjects.some((s) => s.cta?.isAffiliate);

  const trail = breadcrumbTrail([
    { name: 'Compare', path: '/compare' },
    { name: 'Share trading platforms', path: '/compare/trading-platforms' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Platform comparison"
        title="Share trading platforms, compared"
        subheading="See which markets and products each platform covers, and how your shares are actually held \u2014 side by side."
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        {offerings.length === 0 ? (
          <p className="text-muted mt-8">
            No share trading platforms seeded yet.
          </p>
        ) : (
          <div className="mt-8">
            <CompareTable subjects={subjects} sections={sections} />
            <CompareMobileCards subjects={subjects} sections={sections} />
            {hasAffiliateCta && <SectionAffiliateDisclosure />}
          </div>
        )}
      </div>
    </>
  );
}
