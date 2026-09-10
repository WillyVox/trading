import { getPublishedArticles } from "@/lib/articles/service";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Notice } from "@/components/ui/Notice";
import { Card } from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Crypto News Australia \u2014 Market & Regulatory Updates",
  description: "Current crypto market and regulatory news relevant to Australian users.",
  path: "/news",
});

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const { items } = await getPublishedArticles({ category: "news" });
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Eyebrow>News</Eyebrow>
      <h1 className="mt-4 font-display text-5xl font-extrabold text-navy">Market News</h1>

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
  );
}
