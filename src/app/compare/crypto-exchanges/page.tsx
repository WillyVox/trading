import { prisma } from "@/lib/prisma";
import { buildComparisonSections } from "@/lib/providers/compare";
import { CompareTable } from "@/components/compare/CompareTable";
import { CompareMobileCards } from "@/components/compare/CompareMobileCards";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Compare All Crypto Exchanges Australia \u2014 Fees & Features",
  description:
    "A single, always-current comparison of every crypto exchange in our Provider domain \u2014 fees, features, and verified facts side by side.",
  path: "/compare/crypto-exchanges",
  image: "/images/og/compare-crypto-exchanges.png",
});

/**
 * The dedicated, curated comparison route from docs/IMPLEMENTATION-PLAN.md
 * §2/§7 (Phase 5) -- unlike /compare/[slug], this always includes every
 * CRYPTO_EXCHANGE provider (no combinatorial URL to mistype), so it's safe
 * to index: the content is real and the set of providers is deterministic
 * rather than an arbitrary user-typed combination.
 */
export default async function CompareCryptoExchangesPage() {
  const providers = await prisma.provider.findMany({
    where: { providerType: "CRYPTO_EXCHANGE" },
    orderBy: { name: "asc" },
    include: { facts: true, fees: true, features: true },
  });

  const sections = buildComparisonSections(providers as any);

  const trail = breadcrumbTrail([
    { name: "Compare", path: "/compare" },
    { name: "Crypto exchanges", path: "/compare/crypto-exchanges" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Exchange comparison"
        title="Crypto exchange fees and features, compared"
        subheading="See fees, spreads, and verification requirements side-by-side."
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
      {providers.length === 0 ? (
        <p className="mt-8 text-muted">No crypto exchange providers seeded yet.</p>
      ) : (
        <div className="mt-8">
          <CompareTable providers={providers as any} sections={sections} />
          <CompareMobileCards providers={providers as any} sections={sections} />
        </div>
      )}
      </div>
    </>
  );
}