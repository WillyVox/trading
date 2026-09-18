import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { PageHero } from '@/components/layout/PageHero';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';

export const metadata = buildMetadata({
  title: 'Crypto Markets & Exchange Intelligence Australia',
  description:
    'Source-linked exchange research, verification status, and comparisons for the Australian crypto market.',
  path: '/crypto',
  image: '/images/og/crypto.png',
});

export default function CryptoPage() {
  const trail = breadcrumbTrail([{ name: 'Crypto', path: '/crypto' }]);

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
            <Card className="hover:border-gold-soft h-full transition-colors">
              <h2 className="font-display text-navy text-lg font-bold">
                Exchange intelligence
              </h2>
              <p className="text-muted mt-1 text-sm">
                Profiles with verified facts, fees, and sources.
              </p>
            </Card>
          </Link>
          <Link href="/compare">
            <Card className="hover:border-gold-soft h-full transition-colors">
              <h2 className="font-display text-navy text-lg font-bold">
                Compare exchanges
              </h2>
              <p className="text-muted mt-1 text-sm">
                Side-by-side, generated from the same dataset.
              </p>
            </Card>
          </Link>
          <Link href="/guides">
            <Card className="hover:border-gold-soft h-full transition-colors">
              <h2 className="font-display text-navy text-lg font-bold">
                Guides
              </h2>
              <p className="text-muted mt-1 text-sm">
                Educational content on crypto assets and exchanges.
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}
