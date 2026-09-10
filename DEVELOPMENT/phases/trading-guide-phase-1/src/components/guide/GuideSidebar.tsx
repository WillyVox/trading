import Link from "next/link";
import type { Heading } from "@/lib/articles/content";
import { GuideTableOfContents } from "./GuideTableOfContents";

export function GuideSidebar({
  headings,
  category,
  readingMinutes,
}: {
  headings: Heading[];
  category?: string | null;
  readingMinutes: number;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="space-y-4">
        <GuideTableOfContents headings={headings} />

        <div className="rounded-2xl border border-border bg-panel p-4 text-sm">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-navy">Article details</p>
          <dl className="mt-3 space-y-1.5 text-muted">
            {category && (
              <div className="flex justify-between gap-2">
                <dt>Category</dt>
                <dd className="text-navy">{category.replace(/-/g, " ")}</dd>
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
          href="/compare"
          className="block rounded-2xl border border-border bg-panel-secondary p-4 text-center text-sm font-semibold text-navy hover:border-gold-soft"
        >
          Compare crypto exchanges
        </Link>
      </div>
    </aside>
  );
}
