import Link from "next/link";
import { getOfferings } from "@/lib/offerings/service";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Share Trading Platforms in Australia \u2014 Compare Brokers",
  description:
    "Browse Australian share trading platform profiles with verified market access, ownership structures, and sources.",
  path: "/share-trading",
});

export default async function ShareTradingPage() {
  const { items } = await getOfferings();
  const trail = breadcrumbTrail([
    { name: "Share trading", path: "/share-trading" },
  ]);

  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="Platform profiles"
        title="Share trading platforms in Australia"
        subheading="Verified market access, ownership structures, and account types for every platform we cover."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {items.length === 0 && (
          <p className="text-muted mt-4">No platforms seeded yet.</p>
        )}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((offering) => (
            <Link key={offering.id} href={`/share-trading/${offering.slug}`}>
              <Card className="hover:border-gold-soft h-full transition-colors">
                <div className="flex items-start gap-4">
                  <ProviderLogo
                    logo={offering.logo}
                    name={offering.name}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-display text-navy truncate text-lg font-bold">
                        {offering.name}
                      </h2>
                      <VerificationBadge status={offering.verificationStatus} />
                    </div>
                    <p className="text-muted mt-1 text-xs">
                      A {offering.provider.name} product
                    </p>
                    {offering.description && (
                      <p className="text-muted mt-2 line-clamp-3 text-sm">
                        {offering.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
