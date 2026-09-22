import Link from "next/link";
import {
  CURATED_COMPARISONS,
  type ComparisonDomain,
} from "@/lib/seo/curated-comparisons";

export function CuratedComparisonList({
  domain,
}: {
  domain: ComparisonDomain;
}) {
  const items = CURATED_COMPARISONS.filter((item) => item.domain === domain);
  if (!items.length) return null;
  return (
    <section
      className="mt-12"
      aria-labelledby={`${domain}-popular-comparisons`}
    >
      <h2
        id={`${domain}-popular-comparisons`}
        className="font-display text-navy text-xl font-bold"
      >
        Research these comparisons
      </h2>
      <p className="text-muted mt-2 max-w-3xl text-sm leading-6">
        These pages are intentionally published comparison guides with
        source-linked data and additional context. Other combinations created
        with the selector remain useful research views but are not automatically
        indexed.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/compare/${domain}/${item.slug}`}
            className="border-border hover:border-gold-soft rounded-xl border bg-white p-5"
          >
            <span className="text-navy font-semibold">
              {item.title.replace(/:.*$/, "")}
            </span>
            <span className="text-muted mt-2 block text-sm leading-5">
              {item.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
