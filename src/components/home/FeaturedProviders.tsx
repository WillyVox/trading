import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import {
  getFeaturedCryptoExchanges,
  type FeaturedCryptoExchange,
} from "@/lib/crypto-exchanges/service";
import { formatFeatureLabel } from "@/lib/crypto-exchanges/features";

/**
 * Isolated behind its own Suspense boundary in page.tsx so a slow or failed
 * query here can't block/break the hero and the rest of the homepage.
 * Catches its own errors (DB connection issues, etc.) instead of letting
 * them bubble to the route's error.tsx -- a failure in this one optional
 * section should degrade to "section not shown", not blank the whole page.
 */
export async function FeaturedCryptoExchanges() {
  let providers: FeaturedCryptoExchange[];
  try {
    providers = await getFeaturedCryptoExchanges(3);
  } catch (error) {
    console.error(
      "[FeaturedCryptoExchanges] failed to load featured providers:",
      error
    );
    return null;
  }

  if (providers.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <Eyebrow>Featured providers</Eyebrow>
      <h2 className="font-display text-navy mt-4 text-3xl font-bold">
        A few providers we&apos;ve verified.
      </h2>
      <p className="text-muted mt-1 text-sm">
        Shown alphabetically — not a ranking.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {providers.map((offering) => {
          const provider = offering.provider;
          return (
            <Card key={offering.id} className="h-full">
              <div className="flex items-center gap-3">
                <ProviderLogo
                  logo={provider.logo}
                  name={provider.name}
                  size="sm"
                />
                <div className="font-display text-navy text-lg font-bold">
                  {provider.name}
                </div>
              </div>
              <div className="mt-3">
                <Badge tone="green">Verified</Badge>
              </div>
              {(offering.description ?? provider.description) && (
                <p className="text-muted mt-3 text-sm">
                  {offering.description ?? provider.description}
                </p>
              )}
              {offering.features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {offering.features.map((feature) => (
                    <span
                      key={feature.id}
                      className="bg-panel-secondary text-navy rounded-full px-2 py-0.5 text-xs"
                    >
                      {formatFeatureLabel(feature.featureType, feature.label)}
                    </span>
                  ))}
                </div>
              )}
              <Link
                href={`/crypto/exchanges/${provider.slug}`}
                className="border-border text-blue focus-visible:ring-gold-soft mt-3 inline-block rounded border-t pt-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                View profile →
              </Link>
            </Card>
          );
        })}
      </div>
      <Link
        href="/crypto/exchanges"
        className="text-blue mt-4 inline-block text-sm font-semibold"
      >
        See all exchanges →
      </Link>
    </section>
  );
}

/** Suspense fallback: same grid shape as the real section, no text (avoids layout shift + no flash of mismatched copy). */
export function FeaturedCryptoExchangesSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14" aria-hidden="true">
      <div className="bg-panel-secondary h-5 w-40 animate-pulse rounded-full" />
      <div className="bg-panel-secondary mt-4 h-8 w-80 max-w-full animate-pulse rounded" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="h-44 animate-pulse" />
        ))}
      </div>
    </section>
  );
}
