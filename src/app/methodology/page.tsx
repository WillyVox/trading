import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Methodology \u2014 How We Verify Crypto Exchange Research",
  description: "How AusMarket sources, verifies, and labels crypto exchange facts \u2014 evidence standards and editorial policy.",
  path: "/methodology",
});

const PRINCIPLES = [
  { title: "1 · Prefer primary evidence", body: "Regulators, government records, and official provider documentation are preferred for decision-relevant claims." },
  { title: "2 · Attach provenance", body: "Facts carry source, source type, jurisdiction, verified date, and status." },
  { title: "3 · Do not fill gaps", body: "Unknown, variable, or unverified values stay clearly labelled instead of being guessed." },
  { title: "4 · One source of truth", body: "Profiles, comparisons, and evidence views all derive from the same structured provider records." },
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Eyebrow>Methodology</Eyebrow>
      <h1 className="mt-4 font-display text-5xl font-extrabold text-navy">How AusMarket verifies research</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <Card key={p.title}>
            <h3 className="mb-1.5 font-display font-bold text-navy">{p.title}</h3>
            <p className="text-sm text-muted">{p.body}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Notice>
          General information only. This research interface is not personal financial advice
          and does not execute trades.
        </Notice>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/methodology/comparisons" className="text-blue underline">Comparison methodology</Link>
        <Link href="/methodology/editorial-policy" className="text-blue underline">Editorial policy</Link>
        <Link href="/methodology/affiliate-disclosure" className="text-blue underline">Affiliate disclosure</Link>
      </div>
    </div>
  );
}
