import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/articles/service";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return buildMetadata({ title: "Guide not found", description: "", path: `/crypto/guides/${slug}`, noIndex: true });

  return buildMetadata({
    title: article.title,
    description: article.excerpt ?? article.title,
    path: `/crypto/guides/${slug}`,
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

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const trail = breadcrumbTrail([
    { name: "Guides", path: "/crypto/guides" },
    { name: article.title, path: `/crypto/guides/${slug}` },
  ]);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd
        data={articleSchema({
          headline: article.title,
          description: article.excerpt,
          image: article.featuredImage,
          author: article.author,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          path: `/crypto/guides/${slug}`,
        })}
      />
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <h1 className="font-display text-3xl font-extrabold text-navy">{article.title}</h1>
      <div className="prose mt-6" dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
}
