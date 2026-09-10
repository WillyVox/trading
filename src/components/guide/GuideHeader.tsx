import { Badge } from "@/components/ui/Badge";

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" });
}

export function GuideHeader({
  category,
  title,
  excerpt,
  author,
  reviewer,
  publishedAt,
  lastReviewedAt,
  updatedAt,
  readingMinutes,
}: {
  category?: string | null;
  title: string;
  excerpt?: string | null;
  author?: string | null;
  reviewer?: string | null;
  publishedAt?: Date | string | null;
  lastReviewedAt?: Date | string | null;
  updatedAt: Date | string;
  readingMinutes: number;
}) {
  // "Last updated" prefers the editorial lastReviewedAt over the raw
  // updatedAt timestamp (which also changes on non-editorial edits like
  // SEO field tweaks) — see docs/IMPLEMENTATION-PLAN.md Guide Phase 1.
  const lastUpdated = lastReviewedAt ?? updatedAt;

  return (
    <header>
      {category && (
        <Badge tone="gold">{category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</Badge>
      )}
      <h1 className="mt-3 font-display text-3xl font-extrabold text-navy sm:text-4xl">{title}</h1>
      {excerpt && <p className="mt-3 text-lg text-muted">{excerpt}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
        {author && <span>By {author}</span>}
        {reviewer && <span>Reviewed by {reviewer}</span>}
        {publishedAt && <span>Published {formatDate(publishedAt)}</span>}
        <span>Last updated {formatDate(lastUpdated)}</span>
        {readingMinutes > 0 && <span>{readingMinutes} min read</span>}
      </div>
    </header>
  );
}
