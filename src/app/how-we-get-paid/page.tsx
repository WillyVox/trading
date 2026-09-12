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
  description: "The revenue models AusMarket actually uses today, and how that's kept separate from editorial content.",
  path: "/how-we-get-paid",
});

/**
 * Content status: DRAFT, not legal-reviewed -- see docs/CONTENT-GAPS.md
 * "How We Get Paid page". CURRENT list below is deliberately restricted to
 * the two CommissionType values the schema actually models today (CPA,
 * REVSHARE -- see prisma/schema.prisma AffiliateProgram.commissionType).
 * HYBRID exists in the enum but isn't confirmed as an active model, so it's
 * omitted here rather than guessed at; add it once confirmed. Nothing in
 * FUTURE is currently built -- do not present these as active revenue.
 */
const CURRENT = [
  {
    title: "Referral / CPA commissions",
    body: "A one-off payment from a provider when someone we refer completes a qualifying action, such as registering or making a first deposit.",
  },
  {
    title: "Revenue share",
    body: "An ongoing share of the revenue a provider earns from a customer we referred, for as long as our agreement with that provider is in place.",
  },
];

const FUTURE = [
  "Sponsored or promoted placements (not sold today \u2014 see Affiliate Disclosure)",
  "Display advertising",
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
      <h1 className="mt-4 font-display text-4xl font-extrabold text-navy">How we get paid</h1>
      <p className="mt-3 text-muted">
        AusMarket is free to use. Here&apos;s how we currently fund the research, and how that&apos;s
        kept separate from what we write.
      </p>

      <h2 className="mt-8 font-display text-lg font-bold text-navy">Current revenue</h2>
      <div className="mt-3 flex flex-col gap-4">
        {CURRENT.map((c) => (
          <Card key={c.title}>
            <h3 className="mb-1.5 font-display font-bold text-navy">{c.title}</h3>
            <p className="text-sm text-muted">{c.body}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-navy">Not currently used</h2>
      <p className="mt-2 text-sm text-muted">
        These are common comparison-site revenue models we don&apos;t currently use. If that changes,
        this page will be updated first.
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
        {FUTURE.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <h2 className="mt-8 font-display text-lg font-bold text-navy">Kept separate from editorial content</h2>
      <p className="mt-2 text-sm text-muted">
        Which providers we cover, what we write about them, and the (alphabetical) order they appear
        in are not influenced by which providers pay us. See our{" "}
        <Link href="/methodology/editorial-policy" className="text-blue underline">
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