import Link from "next/link";
import clsx from "clsx";
import {
  getPublicGuideCategories,
  getPublicGuides,
} from "@/lib/guides/service";
import { formatCategoryLabel } from "@/lib/articles/content";
import { PageHero } from "@/components/layout/PageHero";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Notice } from "@/components/ui/Notice";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Trading & Crypto Guides Australia — Beginner Education",
  description:
    "Beginner-friendly Australian guides covering crypto exchanges, buying cryptocurrency, share trading, fees, security and how trading platforms work.",
  path: "/guides",
  image: "/images/og/guides.png",
});

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: selectedCategory } = await searchParams;

  const [items, categories] = await Promise.all([
    getPublicGuides(selectedCategory),
    getPublicGuideCategories(),
  ]);

  const trail = breadcrumbTrail([{ name: "Guides", path: "/guides" }]);

  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="Guides"
        title="Beginner-friendly trading and crypto guides for Australians"
        subheading="Understand trading platforms, cryptocurrency exchanges, fees, security and investing concepts before you compare providers."
        graphic="guides"
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {categories.length > 0 && (
          <nav
            aria-label="Filter guides by category"
            className="mb-8 flex flex-wrap gap-2"
          >
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
            {items.map((guide) => (
              <ArticleCard
                key={guide.id}
                href={`/guides/${guide.slug}`}
                title={guide.title}
                excerpt={guide.excerpt}
                featuredImage={guide.featuredImage}
                featuredImageAlt={guide.featuredImageAlt}
                category={guide.category}
                author={guide.author}
                publishedAt={guide.publishedAt}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
