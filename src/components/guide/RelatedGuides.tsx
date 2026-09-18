import Link from "next/link";
import { Card } from "@/components/ui/Card";

type RelatedGuide = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  /** Full site-relative path override. Falls back to `/guides/${slug}` for
   * DB-driven guides — statically-authored guides that live outside the
   * /guides/ namespace (see app/(guides)) pass this explicitly. */
  href?: string;
};

export function RelatedGuides({ guides }: { guides: RelatedGuide[] }) {
  if (guides.length === 0) return null;

  return (
    <section className="border-border mt-10 border-t pt-6">
      <h2 className="font-display text-navy text-lg font-bold">
        Related guides
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <Link key={g.id} href={g.href ?? `/guides/${g.slug}`}>
            <Card className="hover:border-gold-soft h-full transition-colors">
              <p className="font-display text-navy font-semibold">{g.title}</p>
              {g.excerpt && (
                <p className="text-muted mt-1.5 text-sm">{g.excerpt}</p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
