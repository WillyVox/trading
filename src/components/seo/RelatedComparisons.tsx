import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { ComparisonDomain } from "@/lib/seo/curated-comparisons";
import { getCuratedComparisonsForSubject } from "@/lib/seo/curated-comparisons";

export function RelatedComparisons({
  domain,
  subjectSlug,
  excludeSlug,
}: {
  domain: ComparisonDomain;
  subjectSlug: string;
  excludeSlug?: string;
}) {
  const items = getCuratedComparisonsForSubject(domain, subjectSlug).filter(
    (item) => item.slug !== excludeSlug
  );
  if (!items.length) return null;
  return (
    <Card className="mt-8">
      <h2 className="font-display text-navy text-lg font-bold">
        Related comparisons
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/compare/${domain}/${item.slug}`}
            className="border-border hover:border-gold-soft rounded-lg border p-4"
          >
            <span className="text-navy text-sm font-semibold">
              {item.title.replace(/:.*$/, "")}
            </span>
            <span className="text-muted mt-1 block text-xs">
              Source-linked side-by-side research →
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
