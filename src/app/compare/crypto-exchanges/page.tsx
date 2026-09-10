import { prisma } from "@/lib/prisma";
import { buildComparisonSections } from "@/lib/providers/compare";
import { CompareTable } from "@/components/compare/CompareTable";
import { CompareMobileCards } from "@/components/compare/CompareMobileCards";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata = buildMetadata({
  title: "Compare All Crypto Exchanges Australia \u2014 Fees & Features",
  description:
    "A single, always-current comparison of every crypto exchange in our Provider domain \u2014 fees, features, and verified facts side by side.",
  path: "/compare/crypto-exchanges",
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
    <div className="mx-auto max-w-6xl px-4 py-16">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <Eyebrow>Compare</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-extrabold text-navy">All crypto exchanges compared</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Every crypto exchange in our Provider domain, side by side. Generated live from verified provider
        facts, fees, and features {"\u2014"} nothing here is duplicated or hand-maintained separately.
      </p>

      {providers.length === 0 ? (
        <p className="mt-8 text-muted">No crypto exchange providers seeded yet.</p>
      ) : (
        <div className="mt-8">
          <CompareTable providers={providers as any} sections={sections} />
          <CompareMobileCards providers={providers as any} sections={sections} />
        </div>
      )}
    </div>
  );
}
