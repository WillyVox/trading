import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Crypto Markets & Exchange Intelligence Australia",
  description:
    "Source-linked exchange research, verification status, and comparisons for the Australian crypto market.",
  path: "/crypto",
});

export default function CryptoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Eyebrow>Crypto · Deep research</Eyebrow>
      <h1 className="mt-4 font-display text-5xl font-extrabold text-navy">Crypto Markets &amp; Exchange Intelligence</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Source-linked exchange research, verification status, and comparisons — for the
        Australian market only in this MVP.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link href="/crypto/exchanges">
          <Card className="h-full transition-colors hover:border-gold-soft">
            <h2 className="font-display text-lg font-bold text-navy">Exchange intelligence</h2>
            <p className="mt-1 text-sm text-muted">Profiles with verified facts, fees, and sources.</p>
          </Card>
        </Link>
        <Link href="/compare">
          <Card className="h-full transition-colors hover:border-gold-soft">
            <h2 className="font-display text-lg font-bold text-navy">Compare exchanges</h2>
            <p className="mt-1 text-sm text-muted">Side-by-side, generated from the same dataset.</p>
          </Card>
        </Link>
        <Link href="/crypto/guides">
          <Card className="h-full transition-colors hover:border-gold-soft">
            <h2 className="font-display text-lg font-bold text-navy">Guides</h2>
            <p className="mt-1 text-sm text-muted">Educational content on crypto assets and exchanges.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
