import Link from 'next/link';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';
import { Notice } from '@/components/ui/Notice';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';
import { businessIdentity } from '@/lib/config/business';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Affiliate & Advertiser Disclosure',
  description:
    "Trading Guide is currently self-funded and doesn't earn money from provider links. Here's our current funding status, our future affiliate plans, and what that will and won't affect on this site.",
  path: '/affiliate-disclosure',
  image: '/images/og/affiliate-disclosure.png',
});

/**
 * Content status: DRAFT, not legal-reviewed. Rewritten 2026-09-14 to match
 * what the codebase actually does today (see docs/CONTENT-GAPS.md
 * "Affiliate Disclosure page" for the specific claims that still need
 * sign-off before this is production-final):
 *  - Every AffiliateLink in the seed data is active: false with
 *    commissionType NONE and partnershipStatus PROSPECT (see
 *    prisma/seed.ts seedAffiliateLinks()) -- there is no live commercial
 *    relationship with any provider yet, so this page describes affiliate
 *    links as a planned future model, not a current one.
 *  - "alphabetical, not commercially weighted" -- verified true today
 *    against src/lib/providers/service.ts (orderBy: { name: "asc" }) and
 *    src/lib/providers/compare.ts (no scoring/weighting logic exists). If
 *    that ever changes, this page must change with it.
 *  - Sponsored/Promoted/Featured labelling is described as "not currently
 *    used" because no such UI exists yet (see ArticleProviderRelationship
 *    .FEATURED in the schema, which drives an admin checklist warning only,
 *    not a visible label).
 */
const SECTIONS = [
  {
    title: 'Our current funding status',
    body: 'Trading Guide is currently 100% self-funded. We do not receive compensation, referral fees, or affiliate commissions from any providers featured on this platform. All product recommendations and comparisons are based solely on our objective methodology and market research.',
  },
  {
    title: 'What affiliate links will be',
    body: "To keep this platform free for users, we plan to partner with select providers through commercial agreements. Once that's in place, some links on this site \u2014 including the \u201cVisit\u201d buttons on provider pages and links inside guides and news articles \u2014 will become tracking or referral links, taking you to the provider's own website through a link that identifies you as coming from Trading Guide.",
  },
  {
    title: 'How we plan to earn money',
    body: "Once partnerships are in place, Trading Guide may receive a referral commission when you click a provider link and sign up or purchase a service. We won't have a commercial relationship with every provider we mention or compare, and we'll update this page before any partnership goes live.",
  },
  {
    title: 'Zero cost to you',
    body: "Clicking our links will never increase your price or alter the terms offered by the provider, now or once partnerships are active. Always check the provider's own fee schedule before signing up, since fees and offers can change.",
  },
  {
    title: 'Neutral ranking guarantee',
    body: 'Provider partnerships will never dictate ranking order, star ratings, or eligibility for our top picks. Provider listings and comparison tables are sorted alphabetically \u2014 not by whether a provider pays us, how much, or how recently.',
  },
  {
    title: 'Sponsored or promoted placements',
    body: "We don't currently sell sponsored or promoted placements. If a provider sponsors a specific section or pays for an ad placement in future, it will always be explicitly labelled \u201cSponsored\u201d or \u201cAdvertisement\u201d directly next to the placement, and this page will be updated first.",
  },
  {
    title: 'Market coverage',
    body: "Having a commercial relationship with a provider doesn't mean we compare every provider or product available in Australia. See our comparison methodology for how providers are selected.",
  },
  {
    title: 'Dealing with the provider',
    body: "Clicking a provider link takes you to a third-party website. From that point, you're dealing directly with that provider under their own terms, privacy practices, and fees \u2014 not with Trading Guide.",
  },
  {
    title: 'This can change',
    body: "Our commercial relationships with providers can start, end, or change over time. We aim to keep this page current, but always verify a provider's current terms directly with them.",
  },
];

export default function AffiliateDisclosurePage() {
  const trail = breadcrumbTrail([
    { name: 'Methodology', path: '/methodology' },
    { name: 'Affiliate Disclosure', path: '/affiliate-disclosure' },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <Eyebrow>Methodology</Eyebrow>
      <h1 className="font-display text-navy mt-4 text-4xl font-extrabold">
        Affiliate &amp; advertiser disclosure
      </h1>
      <p className="text-muted mt-3">[TODO]</p>

      <div className="mt-8 flex flex-col gap-4">
        {SECTIONS.map((s) => (
          <Card key={s.title}>
            <h2 className="font-display text-navy mb-1.5 text-lg font-bold">
              {s.title}
            </h2>
            <p className="text-muted text-sm leading-relaxed">{s.body}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Notice>
          Questions about a specific commercial relationship? Contact us at{' '}
          {businessIdentity.supportEmail ??
            '[support email not yet configured]'}
          .
          {/* TODO(content-gap): link to a real /contact page once it exists
              -- not in the current footer scope. See CONTENT-GAPS.md. */}
        </Notice>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/how-we-get-paid" className="text-blue underline">
          How we get paid
        </Link>
        <Link href="/methodology/comparisons" className="text-blue underline">
          Comparison methodology
        </Link>
        <Link
          href="/methodology/editorial-policy"
          className="text-blue underline"
        >
          Editorial policy
        </Link>
      </div>
    </div>
  );
}
