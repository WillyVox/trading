import { getOfferings } from "@/lib/offerings/service";
import { OfferingListCard } from "@/components/offerings/OfferingListCard";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Share Trading Platforms in Australia — Compare Brokers",
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
      <JsonLd data={breadcrumbSchema(trail)} />
      {items.length > 0 && (
        <JsonLd
          data={itemListSchema(
            items.map((o) => ({
              name: o.name,
              path: `/share-trading/${o.slug}`,
            }))
          )}
        />
      )}
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
        <div className="mt-6 flex flex-col gap-4">
          {items.map((offering) => (
            <OfferingListCard key={offering.id} offering={offering} />
          ))}
        </div>
      </div>
    </>
  );
}
