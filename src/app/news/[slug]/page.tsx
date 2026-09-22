import { notFound } from "next/navigation";
import { getPublishedArticleBySlugAndType } from "@/lib/articles/service";
import { buildMetadata } from "@/lib/seo/metadata";
import { newsArticleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { renderArticleContent } from "@/lib/articles/renderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { GuideTableOfContents } from "@/components/guide/GuideTableOfContents";
import { GuideSourceList } from "@/components/guide/GuideSourceList";

import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articleResult = await publicDatabaseRead("news.metadata", () =>
    getPublishedArticleBySlugAndType(slug, "NEWS")
  );
  if (!articleResult.ok)
    return buildMetadata({
      title: "News",
      description: "",
      path: `/news/${slug}`,
      noIndex: true,
    });
  const article = articleResult.data;
  if (!article)
    return buildMetadata({
      title: "News not found",
      description: "",
      path: `/news/${slug}`,
      noIndex: true,
    });

  return buildMetadata({
    title: article.title,
    description: article.excerpt ?? article.title,
    path: `/news/${slug}`,
    image: article.featuredImage,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: article.author ? [article.author] : undefined,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    canonicalUrl: article.canonicalUrl,
    noIndex: article.noIndex,
  });
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articleResult = await publicDatabaseRead("news.detail", () =>
    getPublishedArticleBySlugAndType(slug, "NEWS")
  );
  if (!articleResult.ok)
    return (
      <>
        <PageHero
          eyebrow="News"
          title="News temporarily unavailable"
          subheading="We couldn't load this article right now."
        />
        <main className="mx-auto max-w-6xl px-4 py-10">
          <DataUnavailable title="News data is temporarily unavailable">
            Please try again shortly. This is not being presented as a missing
            article because the database could not be queried.
          </DataUnavailable>
        </main>
      </>
    );
  const article = articleResult.data;
  if (!article) notFound();

  // Same shared renderer as Guide/admin preview (Block 3) — sanitized on
  // read as well as write, stable heading ids, table wrapping, and the
  // one working embed type (video). Previously this route rendered
  // article.content directly with no sanitization at all.
  const { content, headings, readingMinutes } = renderArticleContent(
    article.content
  );

  const trail = breadcrumbTrail([
    { name: "News", path: "/news" },
    { name: article.title, path: `/news/${slug}` },
  ]);

  // Trust signals — Req.md §30/§35: News needs a byline/dates too, not
  // just Guide. Reuses the same fields Guide already shows, now rendered
  // as the hero's meta line instead of a separate row under the H1.
  const metaItems = [
    article.author ? `By ${article.author}` : null,
    article.reviewer ? `Reviewed by ${article.reviewer}` : null,
    article.publishedAt ? `Published ${formatDate(article.publishedAt)}` : null,
    `Updated ${formatDate(article.updatedAt)}`,
    readingMinutes > 0 ? `${readingMinutes} min read` : null,
  ].filter(Boolean) as string[];

  return (
    <>
      <JsonLd
        data={newsArticleSchema({
          headline: article.title,
          description: article.excerpt,
          image: article.featuredImage,
          author: article.author,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          path: `/news/${slug}`,
        })}
      />
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="News"
        title={article.title}
        subheading={article.excerpt ?? undefined}
        meta={metaItems}
        maxWidth="max-w-3xl"
      />
      <article className="mx-auto max-w-3xl px-4 py-12">
        {headings.length > 1 && (
          <div className="mt-6">
            <GuideTableOfContents headings={headings} />
          </div>
        )}

        <div className="prose mt-8 max-w-none">{content}</div>

        <GuideSourceList sources={article.sources} />
      </article>
    </>
  );
}
