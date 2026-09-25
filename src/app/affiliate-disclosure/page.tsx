import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Affiliate & Advertiser Disclosure",
  description:
    "How Trading Guide is funded, how commercial relationships are disclosed, and what they do and do not influence in our comparisons.",
  path: "/affiliate-disclosure",
  image: "/images/og/affiliate-disclosure.png",
});

/**
 * Content status: EDITORIALLY REVIEWED for implementation accuracy (2026-09-24).
 * This is an internal product/editorial approval, not a representation that external legal advice was obtained. Reconciled with what the codebase actually does today (see docs/CONTENT-GAPS.md
 * "Affiliate Disclosure page" for the implementation checks):
 *  - Every seeded AffiliateEngagement is currently DRAFT under a PROSPECT partnership.
 *    Some prospect records may store publicly researched program mechanics,
 *    but they are not treated as agreed Trading Guide commercial terms.
 *    prisma/seeds/lib/seed-affiliate-engagements.ts guards against a PROSPECT
 *    partnership being seeded active: true, so there is no live commercial
 *    relationship with any provider yet.
 *  - "alphabetical, not commercially weighted" -- verified true today
 *    against src/lib/providers/service.ts (orderBy: { name: "asc" }) and
 *    src/lib/crypto-exchanges/comparison.ts (no scoring/weighting logic exists). If
 *    that ever changes, this page must change with it.
 *  - Sponsored/Promoted/Featured labelling is described as "not currently
 *    used" because no such UI exists yet (see ArticleProviderRelationship
 *    .FEATURED in the schema, which drives an admin checklist warning only,
 *    not a visible label).
 */
const SECTIONS = [
  {
    title: "Our current funding status",
    body: "Trading Guide is currently 100% self-funded. We do not receive compensation, referral fees, or affiliate commissions from any providers featured on this platform. Provider inclusion and comparison treatment follow our published methodology and research process.",
  },
  {
    title: "What affiliate links will be",
    body: "To keep this platform free for users, we plan to partner with select providers through commercial agreements. Once that's in place, some links on this site \u2014 including the \u201cVisit\u201d buttons on provider pages and links inside guides and news articles \u2014 will become tracking or referral links, taking you to the provider's own website through a link that identifies you as coming from Trading Guide.",
  },
  {
    title: "How we plan to earn money",
    body: "Once partnerships are in place, Trading Guide may receive a referral commission when you click a provider link and sign up or purchase a service. We won't have a commercial relationship with every provider we mention or compare, and we'll update this page before any partnership goes live.",
  },
  {
    title: "Zero cost to you",
    body: "Trading Guide does not add a fee to a provider's product when you use an outbound link. Providers control their own prices, eligibility rules, offers and terms, which can change, so check the provider's current information before taking action.",
  },
  {
    title: "Commercial independence",
    body: "Provider partnerships will never dictate listing order, comparison treatment, or eligibility for inclusion. Provider listings and comparison tables are sorted alphabetically \u2014 not by whether a provider pays us, how much, or how recently.",
  },
  {
    title: "Sponsored or promoted placements",
    body: "We don't currently sell sponsored or promoted placements. If a provider sponsors a specific section or pays for an ad placement in future, it will always be explicitly labelled \u201cSponsored\u201d or \u201cAdvertisement\u201d directly next to the placement, and this page will be updated first.",
  },
  {
    title: "Market coverage",
    body: "Having a commercial relationship with a provider doesn't mean we compare every provider or product available in Australia. See our comparison methodology for how providers are selected.",
  },
  {
    title: "Dealing with the provider",
    body: "Clicking a provider link takes you to a third-party website. From that point, you're dealing directly with that provider under their own terms, privacy practices, and fees \u2014 not with Trading Guide.",
  },
  {
    title: "This can change",
    body: "Our commercial relationships with providers can start, end, or change over time. We aim to keep this page current, but always verify a provider's current terms directly with them.",
  },
];

export default function AffiliateDisclosurePage() {
  const trail = breadcrumbTrail([
    { name: "Methodology", path: "/methodology" },
    { name: "Affiliate Disclosure", path: "/affiliate-disclosure" },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <Eyebrow>Methodology</Eyebrow>
      <h1 className="font-display text-navy mt-4 text-4xl font-extrabold">
        Affiliate &amp; advertiser disclosure
      </h1>
      <p className="text-muted mt-3">
        This page explains how Trading Guide is funded today, how we expect that
        to change as provider partnerships go live, and exactly what a
        commercial relationship will and won&apos;t influence on this site.
      </p>

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
