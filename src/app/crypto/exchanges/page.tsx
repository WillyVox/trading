import Link from "next/link";
import { getProviders } from "@/lib/providers/service";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { Card } from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Crypto Exchanges in Australia \u2014 Compare Platforms",
  description: "Browse Australian crypto exchange profiles with verified facts, fees, and sources.",
  path: "/crypto/exchanges",
});

export default async function ExchangesPage() {
  const { items } = await getProviders();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-extrabold text-navy">Crypto Exchanges</h1>
      {items.length === 0 && <p className="mt-4 text-muted">No providers seeded yet.</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((p: any) => (
          <Link key={p.id} href={`/crypto/exchanges/${p.slug}`}>
            <Card className="h-full transition-colors hover:border-gold-soft">
              <div className="flex items-start gap-4">
                <ProviderLogo logo={p.logo} name={p.name} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="truncate font-display text-lg font-bold text-navy">{p.name}</h2>
                    <VerificationBadge status={p.verificationStatus} />
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-muted">{p.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}