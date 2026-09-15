import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Crypto Markets & Exchange Intelligence Australia",
  description:
    "Source-linked exchange research, verification status, and comparisons for the Australian crypto market.",
  path: "/crypto",
  image: "/images/og/crypto.png",
});

export default function CryptoPage() {
  const trail = breadcrumbTrail([{ name: "Crypto", path: "/crypto" }]);

  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="Crypto education"
        title="Understand crypto before you trade it"
        subheading="Detailed explains on exchanges, wallets, and how Australian crypto actually works."
        graphic="crypto"
      />
      <div className="mx-auto max-w-6xl px-4 py-16">

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
        <Link href="/guides">
          <Card className="h-full transition-colors hover:border-gold-soft">
            <h2 className="font-display text-lg font-bold text-navy">Guides</h2>
            <p className="mt-1 text-sm text-muted">Educational content on crypto assets and exchanges.</p>
          </Card>
        </Link>
      </div>
      </div>
    </>
  );
}