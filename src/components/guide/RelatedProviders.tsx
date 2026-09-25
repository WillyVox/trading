import Link from "next/link";
import { cryptoExchangePath } from "@/lib/crypto-exchanges/routes";
import { Card } from "@/components/ui/Card";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import { VisitSite } from "../affiliate/VisitSite";

type GuideProvider = {
  id: string;
  slug: string;
  providerSlug: string;
  name: string;
  description: string | null;
  verificationStatus: "VERIFIED" | "UNVERIFIED" | "STALE";
  activeLink: boolean;
  website: string | null;
};

/**
 * "Providers mentioned in this guide" — deliberately not "Best" or
 * "Recommended for you" (see Guide spec §11): those labels require a
 * defensible editorial methodology this component has no way to verify.
 * An affiliate CTA only renders when providers.activeLink is true, which
 * the caller must have derived from a real ACTIVE AffiliateEngagement lookup —
 * never fabricated here.
 */
export function RelatedProviders({
  providers,
}: {
  providers: GuideProvider[];
}) {
  if (providers.length === 0) return null;

  const anyAffiliate = providers.some((p) => p.activeLink);

  return (
    <section className="border-border mt-10 border-t pt-6">
      <h2 className="font-display text-navy text-lg font-bold">
        Providers mentioned in this guide
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {providers.map((p) => (
          <Card key={p.id}>
            <div className="flex items-center justify-between">
              <Link
                href={cryptoExchangePath(p.slug)}
                className="font-display text-navy font-semibold hover:underline"
              >
                {p.name}
              </Link>
              <VerificationBadge status={p.verificationStatus} />
            </div>
            {p.description && (
              <p className="text-muted mt-1.5 text-sm">{p.description}</p>
            )}
            <div className="mt-4 flex items-center justify-between gap-4">
              <Link
                href={cryptoExchangePath(p.slug)}
                className="text-navy focus-visible:outline-navy inline-flex min-h-11 shrink-0 items-center text-sm font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                View profile{" "}
                <span className="ml-1" aria-hidden="true">
                  →
                </span>
              </Link>
              <VisitSite
                providerSlug={p.providerSlug}
                offeringSlug={p.slug}
                officialWebsite={p.website}
                hasActiveAffiliate={p.activeLink}
                placement="guide-related-provider"
                className="min-w-[9.5rem]"
              />
            </div>
          </Card>
        ))}
      </div>
      {anyAffiliate && <AffiliateDisclosure />}
    </section>
  );
}
