import Link from "next/link";
import { Card } from "@/components/ui/Card";

type RelatedNewsItem = { id: string; slug: string; title: string; excerpt: string | null };

/** News-article counterpart to components/guide/RelatedGuides.tsx, for the
 * provider profile's "Related news" section (see getRelatedContentForProvider
 * in src/lib/providers/service.ts). Renders nothing when there's no real
 * published coverage rather than showing an empty section. */
export function RelatedNews({ items }: { items: RelatedNewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-4 font-display text-lg font-bold text-navy">Related news</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((n) => (
          <Link key={n.id} href={`/news/${n.slug}`}>
            <Card className="h-full transition-colors hover:border-gold-soft">
              <p className="font-display font-semibold text-navy">{n.title}</p>
              {n.excerpt && <p className="mt-1.5 text-sm text-muted">{n.excerpt}</p>}
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
