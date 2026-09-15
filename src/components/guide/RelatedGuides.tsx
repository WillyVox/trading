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
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="font-display text-lg font-bold text-navy">Related guides</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <Link key={g.id} href={g.href ?? `/guides/${g.slug}`}>
            <Card className="h-full transition-colors hover:border-gold-soft">
              <p className="font-display font-semibold text-navy">{g.title}</p>
              {g.excerpt && <p className="mt-1.5 text-sm text-muted">{g.excerpt}</p>}
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
