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
import { Card } from "@/components/ui/Card";

import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

// import { HomepageLearningProgress } from "@/components/learning/LearningProgressClient";

export const metadata = buildMetadata({
  title:
    "Online Share Trading & Crypto Exchanges Guides Australia — Beginner Education",
  description:
    "Beginner-friendly Australian guides covering crypto exchanges, buying cryptocurrency, share trading, fees, security and how trading platforms work.",
  path: "/guides",
  image: "/images/og/guides.png",
});

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;

  const selectedCategories = Array.isArray(category)
    ? category
    : category
      ? [category]
      : [];

  const guidesResult = await publicDatabaseRead("guides.index", async () => {
    const [items, categories] = await Promise.all([
      getPublicGuides(selectedCategories),
      getPublicGuideCategories(),
    ]);
    return { items, categories };
  });
  const items = guidesResult.ok ? guidesResult.data.items : [];
  const categories = guidesResult.ok ? guidesResult.data.categories : [];

  const trail = breadcrumbTrail([{ name: "Guides", path: "/guides" }]);

  const buildCategoryHref = (nextCategories: string[]) => {
    if (nextCategories.length === 0) return "/guides";
    const params = new URLSearchParams();
    for (const c of nextCategories) params.append("category", c);
    return `/guides?${params.toString()}`;
  };

  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="Guides"
        title="Beginner-friendly share trading and crypto guides for Australians"
        subheading="Understand trading platforms, cryptocurrency exchanges, fees, security and investing concepts before you compare providers."
        graphic="guides"
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <section
          className="mb-10 grid gap-4 md:grid-cols-2"
          aria-label="Learning paths"
        >
          <Link href="/guides/share-trading">
            <Card className="hover:border-gold-soft h-full transition-colors">
              <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
                Learning path
              </p>
              <h2 className="font-display text-navy mt-2 text-xl font-bold">
                Share trading
              </h2>
              <p className="text-muted mt-2 text-sm leading-6">
                Move from beginner concepts to CHESS and custody, brokerage, FX
                costs, provider profiles and comparisons.
              </p>
            </Card>
          </Link>
          <Link href="/guides/crypto">
            <Card className="hover:border-gold-soft h-full transition-colors">
              <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
                Learning path
              </p>
              <h2 className="font-display text-navy mt-2 text-xl font-bold">
                Crypto exchanges
              </h2>
              <p className="text-muted mt-2 text-sm leading-6">
                Understand crypto basics, funding, trading fees, withdrawals,
                exchange profiles and comparisons.
              </p>
            </Card>
          </Link>
        </section>
        {/* <HomepageLearningProgress/> */}
        {!guidesResult.ok && (
          <div className="mb-8">
            <DataUnavailable title="Published guide library is temporarily unavailable">
              The learning paths above remain available. Database-backed guide
              listings could not be loaded right now.
            </DataUnavailable>
          </div>
        )}
        {categories.length > 0 && (
          <nav
            aria-label="Filter guides by category"
            className="mb-8 flex flex-wrap gap-2"
          >
            <Link
              scroll={false}
              href="/guides"
              className={clsx(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                selectedCategories.length === 0
                  ? "border-navy bg-navy text-background"
                  : "border-border bg-panel text-muted hover:border-gold-soft hover:text-navy"
              )}
            >
              All guides
            </Link>
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              const nextCategories = isSelected
                ? selectedCategories.filter((c) => c !== category)
                : [...selectedCategories, category];

              return (
                <Link
                  scroll={false}
                  key={category}
                  href={buildCategoryHref(nextCategories)}
                  aria-pressed={isSelected}
                  className={clsx(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    isSelected
                      ? "border-navy bg-navy text-background"
                      : "border-border bg-panel text-muted hover:border-gold-soft hover:text-navy"
                  )}
                >
                  {formatCategoryLabel(category)}
                </Link>
              );
            })}
          </nav>
        )}

        {!guidesResult.ok ? null : items.length === 0 ? (
          <Notice>
            {selectedCategories.length > 0
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
