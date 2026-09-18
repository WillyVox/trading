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
export function GuideProviderLinks({
  heading,
  providers,
  basePath = "/crypto/exchanges",
  compareHref = "/compare/crypto-exchanges",
  compareLabel = "Compare all exchanges side-by-side",
}: {
  heading: string;
  providers: ProviderLink[];
  /** Profile route prefix, e.g. "/share-trading" or "/crypto/exchanges" (default). */
  basePath?: string;
  compareHref?: string;
  compareLabel?: string;
}) {
  if (providers.length === 0) return null;

  return (
    <section className="border-border mt-10 border-t pt-6">
      <h2 className="font-display text-navy text-lg font-bold">{heading}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {providers.map((p) => (
          <Card key={p.slug}>
            <Link
              href={`${basePath}/${p.slug}`}
              className="font-display text-navy font-semibold hover:underline"
            >
              {p.name}
            </Link>
            <p className="text-muted mt-1.5 text-sm">{p.description}</p>
            <Link
              href={`${basePath}/${p.slug}`}
              className="border-border text-navy hover:bg-panel-secondary mt-4 inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold"
            >
              View profile
            </Link>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <Button href={compareHref} variant="secondary">
          {compareLabel}
        </Button>
      </div>
    </section>
  );
}