import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getArticleBySlug,
  getRelatedGuides,
  getNextSteps,
  getRegionalFamily,
} from "@/lib/articles/service";
import { getActiveAffiliateLinksForProviderSlugs } from "@/lib/affiliates/service";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { regionHreflang } from "@/lib/seo/canonical";
import { absoluteUrl } from "@/lib/seo/config";
import { extractHeadings, estimateReadingMinutes } from "@/lib/articles/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { GuideHeader } from "@/components/guide/GuideHeader";
import { KeyTakeaways } from "@/components/guide/KeyTakeaways";
import { GuideTableOfContents } from "@/components/guide/GuideTableOfContents";
import { GuideSidebar } from "@/components/guide/GuideSidebar";
import { GuideSourceList } from "@/components/guide/GuideSourceList";
import { RelatedGuides } from "@/components/guide/RelatedGuides";
import { RelatedProviders } from "@/components/guide/RelatedProviders";
import { GuideNextSteps } from "@/components/guide/GuideNextSteps";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return buildMetadata({ title: "Guide not found", description: "", path: `/crypto/guides/${slug}`, noIndex: true });
  }

  const metadata = buildMetadata({
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

  // hreflang — only emitted when real regional variants exist (see Guide
  // spec §7: never fabricate duplicate pages for identical content).
  const family = await getRegionalFamily(article.id, article.canonicalArticleId);
  if (family.length > 1) {
    const globalMember = family.find((m) => !m.region);
    const languages: Record<string, string> = {};
    for (const member of family) {
      if (!member.region) continue;
      languages[regionHreflang(member.region)] = absoluteUrl(`/crypto/guides/${member.slug}`);
    }
    if (globalMember) {
      languages["x-default"] = absoluteUrl(`/crypto/guides/${globalMember.slug}`);
    }
    metadata.alternates = { ...metadata.alternates, languages };
  }

  return metadata;
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const { html: contentHtml, headings } = extractHeadings(article.content);
  const readingMinutes = estimateReadingMinutes(article.content);

  const [relatedGuides, nextSteps, regionalFamily] = await Promise.all([
    getRelatedGuides(article),
    getNextSteps(article),
    getRegionalFamily(article.id, article.canonicalArticleId),
  ]);
  const otherRegions = regionalFamily.filter((m) => m.slug !== slug);

  const providerSlugs = article.providers.map(
    (ap: { provider: { slug: string } }) => ap.provider.slug
  );
  const activeLinks = await getActiveAffiliateLinksForProviderSlugs(providerSlugs);
  const guideProviders = article.providers.map(
    (ap: {
      provider: {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        verificationStatus: string;
      };
    }) => ({
      id: ap.provider.id,
      slug: ap.provider.slug,
      name: ap.provider.name,
      description: ap.provider.description,
      verificationStatus: ap.provider.verificationStatus,
      activeLink: activeLinks.has(ap.provider.slug),
    })
  );

  const trail = breadcrumbTrail([
    { name: "Crypto", path: "/crypto" },
    { name: "Guides", path: "/crypto/guides" },
    { name: article.title, path: `/crypto/guides/${slug}` },
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <JsonLd
        data={articleSchema({
          headline: article.title,
          description: article.excerpt,
          image: article.featuredImage,
          author: article.author,
          datePublished: article.publishedAt,
          dateModified: article.lastReviewedAt ?? article.updatedAt,
          path: `/crypto/guides/${slug}`,
        })}
      />
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />

      {otherRegions.length > 0 && (
        <p className="mb-4 text-xs text-muted">
          Also available for:{" "}
          {otherRegions.map((m, i) => (
            <span key={m.id}>
              {i > 0 && ", "}
              <Link href={`/crypto/guides/${m.slug}`} className="underline hover:text-navy">
                {m.region ?? "Global"}
              </Link>
            </span>
          ))}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0 max-w-3xl">
          <GuideHeader
            category={article.category}
            title={article.title}
            excerpt={article.excerpt}
            author={article.author}
            reviewer={article.reviewer}
            publishedAt={article.publishedAt}
            lastReviewedAt={article.lastReviewedAt}
            updatedAt={article.updatedAt}
            readingMinutes={readingMinutes}
          />

          <KeyTakeaways items={article.keyTakeaways} />

          <div className="mt-6 lg:hidden">
            <GuideTableOfContents headings={headings} />
          </div>

          <div className="prose prose-headings:font-display prose-headings:text-navy mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          <GuideSourceList sources={article.sources} />
          <RelatedProviders providers={guideProviders} />
          <RelatedGuides guides={relatedGuides} />
          <GuideNextSteps steps={nextSteps} />
        </article>

        <GuideSidebar headings={headings} category={article.category} readingMinutes={readingMinutes} />
      </div>
    </div>
  );
}
