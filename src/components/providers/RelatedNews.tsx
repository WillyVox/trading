import Link from "next/link";
import { Card } from "@/components/ui/Card";

type RelatedNewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
};

/** News-article counterpart to components/guide/RelatedGuides.tsx, for the
 * provider profile's "Related news" section (see getRelatedContentForProvider
 * in src/lib/providers/service.ts). Renders nothing when there's no real
 * published coverage rather than showing an empty section. */
export function RelatedNews({ items }: { items: RelatedNewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="font-display text-navy mb-4 text-lg font-bold">
        Related news
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((n) => (
          <Link key={n.id} href={`/news/${n.slug}`}>
            <Card className="hover:border-gold-soft h-full transition-colors">
              <p className="font-display text-navy font-semibold">{n.title}</p>
              {n.excerpt && (
                <p className="text-muted mt-1.5 text-sm">{n.excerpt}</p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
