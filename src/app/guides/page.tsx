import Link from "next/link";
import clsx from "clsx";
import { getPublishedArticles, getArticleCategories } from "@/lib/articles/service";
import { formatCategoryLabel } from "@/lib/articles/content";
import { PageHero } from "@/components/layout/PageHero";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Notice } from "@/components/ui/Notice";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Crypto Guides Australia \u2014 How-To & Educational Articles",
  description: "Step-by-step crypto guides for Australians \u2014 buying, wallets, fees, and how exchanges work.",
  path: "/guides",
});

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: selectedCategory } = await searchParams;

  const [{ items }, categories] = await Promise.all([
    getPublishedArticles({ articleType: "GUIDE", category: selectedCategory, pageSize: 48 }),
    getArticleCategories("GUIDE"),
  ]);

  const trail = breadcrumbTrail([
    { name: "Crypto", path: "/crypto" },
    { name: "Guides", path: "/guides" },
  ]);

  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="Guides"
        title="Step-by-step crypto guides for Australians"
        subheading="How-to guides for buying, storing, and trading crypto safely."
        graphic="guides"
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {categories.length > 0 && (
          // Plain links (not a client-side <select>/tab component), so
          // filtering works with JS disabled, is shareable/bookmarkable,
          // and each category is crawlable — consistent with the "search
          // dominance" goal. Canonical always points at the unfiltered
          // /guides (buildMetadata's `path` above never varies with the
          // query), so these read as views of one page rather than
          // competing near-duplicate pages for SEO purposes.
          <nav aria-label="Filter guides by category" className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/guides"
              className={clsx(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                !selectedCategory
                  ? "border-navy bg-navy text-background"
                  : "border-border bg-panel text-muted hover:border-gold-soft hover:text-navy"
              )}
            >
              All guides
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/guides?category=${encodeURIComponent(category)}`}
                className={clsx(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  selectedCategory === category
                    ? "border-navy bg-navy text-background"
                    : "border-border bg-panel text-muted hover:border-gold-soft hover:text-navy"
                )}
              >
                {formatCategoryLabel(category)}
              </Link>
            ))}
          </nav>
        )}

        {items.length === 0 ? (
          <Notice>
            {selectedCategory
              ? "No guides published in this category yet."
              : "No guides published yet."}
          </Notice>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a: any) => (
              <ArticleCard
                key={a.id}
                href={`/guides/${a.slug}`}
                title={a.title}
                excerpt={a.excerpt}
                featuredImage={a.featuredImage}
                featuredImageAlt={a.featuredImageAlt}
                category={a.category}
                author={a.author}
                publishedAt={a.publishedAt}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}