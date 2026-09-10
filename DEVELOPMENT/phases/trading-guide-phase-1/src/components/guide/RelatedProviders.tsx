import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { AffiliateCTA } from "@/components/affiliate/AffiliateCTA";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

type GuideProvider = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  verificationStatus: "VERIFIED" | "UNVERIFIED" | "STALE";
  activeLink: boolean;
};

/**
 * "Providers mentioned in this guide" — deliberately not "Best" or
 * "Recommended for you" (see Guide spec §11): those labels require a
 * defensible editorial methodology this component has no way to verify.
 * An affiliate CTA only renders when providers.activeLink is true, which
 * the caller must have derived from a real ACTIVE AffiliateLink lookup —
 * never fabricated here.
 */
export function RelatedProviders({ providers }: { providers: GuideProvider[] }) {
  if (providers.length === 0) return null;

  const anyAffiliate = providers.some((p) => p.activeLink);

  return (
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="font-display text-lg font-bold text-navy">Providers mentioned in this guide</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {providers.map((p) => (
          <Card key={p.id}>
            <div className="flex items-center justify-between">
              <Link href={`/crypto/exchanges/${p.slug}`} className="font-display font-semibold text-navy hover:underline">
                {p.name}
              </Link>
              <VerificationBadge status={p.verificationStatus} />
            </div>
            {p.description && <p className="mt-1.5 text-sm text-muted">{p.description}</p>}
            {p.activeLink ? (
              <AffiliateCTA partnerSlug={p.slug} providerName={p.name} showDisclosure={false} />
            ) : (
              <Link
                href={`/crypto/exchanges/${p.slug}`}
                className="mt-4 inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-navy hover:bg-panel-secondary"
              >
                View profile
              </Link>
            )}
          </Card>
        ))}
      </div>
      {anyAffiliate && <AffiliateDisclosure />}
    </section>
  );
}
