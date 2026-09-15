import { getPublishedArticles } from "@/lib/articles/service";
import { Notice } from "@/components/ui/Notice";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Trading News | Educational Materials | Trading Guides - TradingGuide",
  description: "Current crypto market and regulatory news relevant to Australian users.",
  path: "/news",
  image: "/images/og/news.png",
});

export default async function NewsPage() {
  const { items } = await getPublishedArticles({ articleType: "NEWS" });
  const trail = breadcrumbTrail([{ name: "News", path: "/news" }]);

  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="News"
        title="Australian crypto news"
        subheading="Regulatory updates and market news, source-linked."
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
      {items.length === 0 ? (
        <div className="mt-6">
          <Notice>
            No news ingestion source is connected yet. No synthetic headlines are shown in
            place of real content.
          </Notice>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((a: any) => (
            <Card key={a.id}>
              <h2 className="font-display text-lg font-bold text-navy">{a.title}</h2>
              {a.excerpt && <p className="mt-1 text-sm text-muted">{a.excerpt}</p>}
            </Card>
          ))}
        </div>
      )}
      </div>
    </>
  );
}