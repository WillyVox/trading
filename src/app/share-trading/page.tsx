import { getShareTradingPlatforms } from "@/lib/share-trading/service";
import { ShareTradingPlatformListCard } from "@/components/share-trading/ShareTradingPlatformListCard";
import { LatestArticlesSection } from "@/components/article/LatestArticlesSection";
import { getLatestArticlesForCategory } from "@/lib/content/latest";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { TopicClusterLinks } from "@/components/seo/TopicClusterLinks";
import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

// Matches the STATIC_GUIDES category already used by
// /guides/share-trading-for-beginners -- see src/lib/guides/static-guides.ts.
// Reuse this exact value when tagging future DB-backed guides/news so they
// surface in this module too.
const SHARE_TRADING_CATEGORY = "share-trading";

export const metadata = buildMetadata({
  title: "Share Trading Platforms in Australia — Compare Brokers",
  description:
    "Browse Australian share trading platform profiles with verified market access, ownership structures, and sources.",
  path: "/share-trading",
});

export default async function ShareTradingPage() {
  const pageDataResult = await publicDatabaseRead(
    "shareTrading.index",
    async () => {
      const [{ items }, latestArticles] = await Promise.all([
        getShareTradingPlatforms(),
        getLatestArticlesForCategory(SHARE_TRADING_CATEGORY),
      ]);
      return { items, latestArticles };
    }
  );
  const items = pageDataResult.ok ? pageDataResult.data.items : [];
  const latestArticles = pageDataResult.ok
    ? pageDataResult.data.latestArticles
    : [];
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
        {!pageDataResult.ok ? (
          <DataUnavailable title="Share trading research is temporarily unavailable">
            We couldn&lsquo;t retrieve platform data right now. No platforms are being
            shown rather than presenting an incomplete list.
          </DataUnavailable>
        ) : items.length === 0 ? (
          <p className="text-muted mt-4">No platforms seeded yet.</p>
        ) : null}
        <div className="mt-6 flex flex-col gap-4">
          {items.map((offering) => (
            <ShareTradingPlatformListCard
              key={offering.id}
              offering={offering}
            />
          ))}
        </div>

        <TopicClusterLinks
          clusterId="share-trading"
          excludeHref="/share-trading"
        />

        <LatestArticlesSection
          title="Latest in share trading"
          viewAllHref={`/guides?category=${SHARE_TRADING_CATEGORY}`}
          viewAllLabel="View all guides"
          items={latestArticles}
        />
      </div>
    </>
  );
}
