import Link from "next/link";
import { formatCategoryLabel, type Heading } from "@/lib/articles/content";
import { GuideTableOfContents } from "./GuideTableOfContents";

export function GuideSidebar({
  headings,
  category,
  readingMinutes,
  compareHref = "/compare",
  compareLabel = "Compare crypto exchanges",
}: {
  headings: Heading[];
  category?: string | null;
  readingMinutes: number;
  /** Defaults preserve existing crypto-guide behaviour; other guide
   * topics (e.g. share trading) should pass their own compare route. */
  compareHref?: string;
  compareLabel?: string;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="space-y-4">
        <GuideTableOfContents headings={headings} />

        <div className="border-border bg-panel rounded-2xl border p-4 text-sm">
          <p className="font-display text-navy text-sm font-bold tracking-wide uppercase">
            Article details
          </p>
          <dl className="text-muted mt-3 space-y-1.5">
            {category && (
              <div className="flex justify-between gap-2">
                <dt>Category</dt>
                <dd className="text-navy">{formatCategoryLabel(category)}</dd>
              </div>
            )}
            {readingMinutes > 0 && (
              <div className="flex justify-between gap-2">
                <dt>Reading time</dt>
                <dd className="text-navy">{readingMinutes} min</dd>
              </div>
            )}
          </dl>
        </div>

        <Link
          href={compareHref}
          className="border-border bg-panel-secondary text-navy hover:border-gold-soft block rounded-2xl border p-4 text-center text-sm font-semibold"
        >
          {compareLabel}
        </Link>
      </div>
    </aside>
  );
}