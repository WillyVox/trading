import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface ProviderLink {
  slug: string;
  name: string;
  description: string;
}

/**
 * Lightweight "where to actually do this" cross-link block for statically
 * authored guides (app/(guides)/*). Deliberately simpler than
 * RelatedProviders: it never renders a verification badge or affiliate CTA,
 * because those both require a live DB lookup (VerificationBadge status,
 * ACTIVE AffiliateLink check) this static page doesn't perform — showing
 * either here would be fabricating trust signals the page hasn't earned.
 * Plain profile links only; the real comparison lives at /compare.
 */
export function GuideProviderLinks({ heading, providers }: { heading: string; providers: ProviderLink[] }) {
  if (providers.length === 0) return null;

  return (
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="font-display text-lg font-bold text-navy">{heading}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {providers.map((p) => (
          <Card key={p.slug}>
            <Link href={`/crypto/exchanges/${p.slug}`} className="font-display font-semibold text-navy hover:underline">
              {p.name}
            </Link>
            <p className="mt-1.5 text-sm text-muted">{p.description}</p>
            <Link
              href={`/crypto/exchanges/${p.slug}`}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-navy hover:bg-panel-secondary"
            >
              View profile
            </Link>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <Button href="/compare/crypto-exchanges" variant="secondary">
          Compare all exchanges side-by-side
        </Button>
      </div>
    </section>
  );
}
