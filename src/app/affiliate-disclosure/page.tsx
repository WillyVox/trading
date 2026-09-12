import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { businessIdentity } from "@/lib/config/business";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Affiliate & Advertiser Disclosure",
  description:
    "How AusMarket earns money from provider links, and what that does and doesn't affect on this site.",
  path: "/affiliate-disclosure",
});

/**
 * Content status: DRAFT, not legal-reviewed. Written to match what the
 * codebase actually does today (see docs/CONTENT-GAPS.md "Affiliate
 * Disclosure page" for the specific claims that still need sign-off before
 * this is production-final):
 *  - "clicks, registers, deposits, trades" -- matches AffiliateProgram's
 *    CommissionType enum (CPA / REVSHARE / HYBRID), not invented.
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
    title: "What affiliate links are",
    body: "Some links on this site \u2014 including the \u201cVisit\u201d buttons on provider pages and links inside guides and news articles \u2014 are tracking or referral links provided by our commercial partners. Clicking one takes you to the provider's own website through a link that identifies you as coming from AusMarket.",
  },
  {
    title: "How we may earn money",
    body: "Depending on our agreement with a provider, AusMarket may receive a payment when you click a link, register, open an account, deposit, or trade with that provider. We don't have a commercial relationship with every provider we mention or compare.",
  },
  {
    title: "Does it cost you more?",
    // TODO(content-gap): confirm against every current partner agreement
    // before stating a blanket "no extra cost" claim -- see CONTENT-GAPS.md.
    body: "Using a link on this site does not add a fee on top of what the provider would otherwise charge you, based on our current partner agreements. Always check the provider's own fee schedule before signing up, since fees and offers can change.",
  },
  {
    title: "Editorial independence",
    body: "Commercial arrangements do not affect which providers we cover or the order they appear in. Provider listings and comparison tables are sorted alphabetically \u2014 not by whether a provider pays us, how much, or how recently.",
  },
  {
    title: "Sponsored or promoted placements",
    body: "We don't currently sell sponsored or promoted placements. If we introduce paid placements in future, they'll be clearly labelled \u201cSponsored\u201d or \u201cPromoted\u201d directly next to the placement, and this page will be updated first.",
  },
  {
    title: "Market coverage",
    body: "Having a commercial relationship with a provider doesn't mean we compare every provider or product available in Australia. See our comparison methodology for how providers are selected.",
  },
  {
    title: "Dealing with the provider",
    body: "Clicking a provider link takes you to a third-party website. From that point, you're dealing directly with that provider under their own terms, privacy practices, and fees \u2014 not with AusMarket.",
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
      <h1 className="mt-4 font-display text-4xl font-extrabold text-navy">
        Affiliate &amp; advertiser disclosure
      </h1>
      <p className="mt-3 text-muted">
        A plain-English explanation of how AusMarket earns money, and what that does and doesn&apos;t
        affect on this site.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {SECTIONS.map((s) => (
          <Card key={s.title}>
            <h2 className="mb-1.5 font-display text-lg font-bold text-navy">{s.title}</h2>
            <p className="text-sm leading-relaxed text-muted">{s.body}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Notice>
          Questions about a specific commercial relationship? Contact us at{" "}
          {businessIdentity.supportEmail ?? "[support email not yet configured]"}.
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
        <Link href="/methodology/editorial-policy" className="text-blue underline">
          Editorial policy
        </Link>
      </div>
    </div>
  );
}