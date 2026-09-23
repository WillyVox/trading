import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "How We Get Paid",
  description:
    "Trading Guide is currently self-funded and doesn't earn commissions from providers. Here's our current funding status and how we plan to monetize in future.",
  path: "/how-we-get-paid",
  image: "/images/og/how-we-get-paid.png",
});

/**
 * Content status: DRAFT, not legal-reviewed -- see docs/CONTENT-GAPS.md
 * "How We Get Paid page". Every AffiliateLink in the seed data is
 * active: false as of 2026-09-21 (the BTC Markets seed previously set
 * active: true against a PROSPECT partnership -- see
 * prisma/seeds/affiliate-links/btc-markets.ts -- fixed, and
 * prisma/seeds/lib/seed-affiliate-links.ts now guards against this class of
 * bug recurring). No commercial agreement is live today. FUTURE_PLAN
 * describes the intended model once partnerships go live; nothing in it is
 * active yet, so don't present it as current revenue.
 */
const EFFECTIVE_DATE = "September 2026";

const FUTURE_PLAN = [
  {
    title: "Affiliate links",
    body: "If you click on a provider link on our site and sign up or purchase a service, the provider may pay us a small referral commission.",
  },
  {
    title: "Zero cost to you",
    body: "Clicking our links will never increase your price or alter the terms offered by the provider.",
  },
  {
    title: "Commercial independence",
    body: "Provider partnerships will never dictate listing order, comparison treatment, or eligibility for inclusion.",
  },
];

export default function HowWeGetPaidPage() {
  const trail = breadcrumbTrail([
    { name: "Methodology", path: "/methodology" },
    { name: "How We Get Paid", path: "/how-we-get-paid" },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <Eyebrow>Methodology</Eyebrow>
      <h1 className="font-display text-navy mt-4 text-4xl font-extrabold">
        How we get paid
      </h1>
      <p className="text-muted mt-3">
        Our goal is to help you compare online share trading platforms & crypto
        exchanges transparently so you can make confident decisions. Here&apos;s
        how we&apos;re funded today, and how we plan to fund the platform going
        forward.
      </p>

      <h2 className="font-display text-navy mt-8 text-lg font-bold">
        Current funding status
      </h2>
      <Card className="mt-3">
        <p className="text-muted text-sm leading-relaxed">
          Trading Guide is currently 100% self-funded. As of {EFFECTIVE_DATE},
          we do not receive compensation, referral fees, or affiliate
          commissions from any providers featured on this platform. All product
          recommendations and comparisons are based solely on our objective
          methodology and market research.
        </p>
      </Card>

      <h2 className="font-display text-navy mt-8 text-lg font-bold">
        How we plan to monetize in the future
      </h2>
      <p className="text-muted mt-2 text-sm">
        To keep our platform free for users, we plan to partner with select
        providers through commercial agreements. Here&apos;s how that will work:
      </p>
      <div className="mt-3 flex flex-col gap-4">
        {FUTURE_PLAN.map((f) => (
          <Card key={f.title}>
            <h3 className="font-display text-navy mb-1.5 font-bold">
              {f.title}
            </h3>
            <p className="text-muted text-sm">{f.body}</p>
          </Card>
        ))}
      </div>

      <h2 className="font-display text-navy mt-8 text-lg font-bold">
        Our commitment to transparency
      </h2>
      <p className="text-muted mt-2 text-sm">
        If a provider sponsors a specific section or pays for an ad placement on
        our site in the future, it will always be explicitly labelled as
        &ldquo;Sponsored&rdquo; or &ldquo;Advertisement.&rdquo;
      </p>

      <h2 className="font-display text-navy mt-8 text-lg font-bold">
        Kept separate from editorial content
      </h2>
      <p className="text-muted mt-2 text-sm">
        Which providers we cover, what we write about them, and the
        (alphabetical) order they appear in are not influenced by which
        providers pay us, today or in future. See our{" "}
        <Link
          href="/methodology/editorial-policy"
          className="text-blue underline"
        >
          editorial policy
        </Link>{" "}
        for how that separation works in practice.
      </p>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/affiliate-disclosure" className="text-blue underline">
          Affiliate disclosure
        </Link>
        <Link href="/methodology/comparisons" className="text-blue underline">
          Comparison methodology
        </Link>
      </div>
    </div>
  );
}
