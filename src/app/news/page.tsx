import type { Article } from "@prisma/client";
import { getPublishedArticles } from "@/lib/articles/service";
import { Notice } from "@/components/ui/Notice";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";

import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

export const metadata = buildMetadata({
  title: "Trading News | Educational Materials | Trading Guides - TradingGuide",
  description:
    "Current share trading and crypto market news and regulatory updates relevant to Australian users.",
  path: "/news",
  image: "/images/og/news.png",
});

export default async function NewsPage() {
  const newsResult = await publicDatabaseRead("news.index", () =>
    getPublishedArticles({ articleType: "NEWS" })
  );
  const items = newsResult.ok ? newsResult.data.items : [];
  const trail = breadcrumbTrail([{ name: "News", path: "/news" }]);

  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="News"
        title="Australian trading & crypto news"
        subheading="Regulatory updates and market news for share trading and crypto, source-linked."
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        {!newsResult.ok ? (
          <DataUnavailable title="News is temporarily unavailable">
            We couldn&lsquo;t load database-backed news right now. Please try again
            shortly.
          </DataUnavailable>
        ) : items.length === 0 ? (
          <div className="mt-6">
            <Notice>
              No news ingestion source is connected yet. No synthetic headlines
              are shown in place of real content.
            </Notice>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {items.map((a: Article) => (
              <Card key={a.id}>
                <h2 className="font-display text-navy text-lg font-bold">
                  {a.title}
                </h2>
                {a.excerpt && (
                  <p className="text-muted mt-1 text-sm">{a.excerpt}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
