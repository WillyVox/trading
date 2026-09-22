import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPublishedArticleBySlugAndType,
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
import { renderArticleContent } from "@/lib/articles/renderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { KeyTakeaways } from "@/components/guide/KeyTakeaways";
import { GuideTableOfContents } from "@/components/guide/GuideTableOfContents";
import { GuideSidebar } from "@/components/guide/GuideSidebar";
import { GuideSourceList } from "@/components/guide/GuideSourceList";
import { RelatedGuides } from "@/components/guide/RelatedGuides";
import { RelatedProviders } from "@/components/guide/RelatedProviders";
import { GuideNextSteps } from "@/components/guide/GuideNextSteps";

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articleResult = await publicDatabaseRead(
    "guides.metadata.article",
    () => getPublishedArticleBySlugAndType(slug, "GUIDE")
  );
  if (!articleResult.ok)
    return buildMetadata({
      title: "Guide",
      description: "",
      path: `/guides/${slug}`,
      noIndex: true,
    });
  const article = articleResult.data;
  if (!article) {
    return buildMetadata({
      title: "Guide not found",
      description: "",
      path: `/guides/${slug}`,
      noIndex: true,
    });
  }

  const metadata = buildMetadata({
    title: article.title,
    description: article.excerpt ?? article.title,
    path: `/guides/${slug}`,
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
  const familyResult = await publicDatabaseRead(
    "guides.metadata.regionalFamily",
    () => getRegionalFamily(article.id, article.canonicalArticleId)
  );
  const family = familyResult.ok ? familyResult.data : [];
  if (family.length > 1) {
    const globalMember = family.find((m) => !m.region);
    const languages: Record<string, string> = {};
    for (const member of family) {
      if (!member.region) continue;
      languages[regionHreflang(member.region)] = absoluteUrl(
        `/guides/${member.slug}`
      );
    }
    if (globalMember) {
      languages["x-default"] = absoluteUrl(`/guides/${globalMember.slug}`);
    }
    metadata.alternates = { ...metadata.alternates, languages };
  }

  return metadata;
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articleResult = await publicDatabaseRead("guides.detail", () =>
    getPublishedArticleBySlugAndType(slug, "GUIDE")
  );
  if (!articleResult.ok)
    return (
      <>
        <PageHero
          eyebrow="Guide"
          title="Guide temporarily unavailable"
          subheading="We couldn't load this published guide right now."
        />
        <main className="mx-auto max-w-6xl px-4 py-10">
          <DataUnavailable title="Guide data is temporarily unavailable">
            Please try again shortly. This is not being presented as a missing
            guide because the database could not be queried.
          </DataUnavailable>
        </main>
      </>
    );
  const article = articleResult.data;
  if (!article) notFound();

  const { content, headings, readingMinutes } = renderArticleContent(
    article.content
  );

  const relatedResult = await publicDatabaseRead(
    "guides.detail.related",
    async () => {
      const [relatedGuides, nextSteps, regionalFamily] = await Promise.all([
        getRelatedGuides(article),
        getNextSteps(article),
        getRegionalFamily(article.id, article.canonicalArticleId),
      ]);
      return { relatedGuides, nextSteps, regionalFamily };
    }
  );
  const relatedGuides = relatedResult.ok
    ? relatedResult.data.relatedGuides
    : [];
  const nextSteps = relatedResult.ok ? relatedResult.data.nextSteps : [];
  const regionalFamily = relatedResult.ok
    ? relatedResult.data.regionalFamily
    : [];
  const otherRegions = regionalFamily.filter((m) => m.slug !== slug);

  const providerSlugs = article.providers.map(
    (ap: { provider: { slug: string } }) => ap.provider.slug
  );
  const activeLinksResult = await publicDatabaseRead(
    "guides.detail.affiliateLinks",
    () => getActiveAffiliateLinksForProviderSlugs(providerSlugs)
  );
  const activeLinks = activeLinksResult.ok ? activeLinksResult.data : new Map();
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
    { name: "Guides", path: "/guides" },
    { name: article.title, path: `/guides/${slug}` },
  ]);

  // Same fields GuideHeader used to render inline — now the hero's
  // eyebrow/meta line, per the category/H1/subheading field mapping
  // (category -> eyebrow, title -> H1, excerpt -> subheading).
  const lastUpdated = article.lastReviewedAt ?? article.updatedAt;
  const metaItems = [
    article.author ? `By ${article.author}` : null,
    article.reviewer ? `Reviewed by ${article.reviewer}` : null,
    article.publishedAt ? `Published ${formatDate(article.publishedAt)}` : null,
    `Last updated ${formatDate(lastUpdated)}`,
    readingMinutes > 0 ? `${readingMinutes} min read` : null,
  ].filter(Boolean) as string[];

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: article.title,
          description: article.excerpt,
          image: article.featuredImage,
          author: article.author,
          datePublished: article.publishedAt,
          dateModified: article.lastReviewedAt ?? article.updatedAt,
          path: `/guides/${slug}`,
        })}
      />
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow={
          article.category
            ? article.category
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c: string) => c.toUpperCase())
            : undefined
        }
        title={article.title}
        subheading={article.excerpt ?? undefined}
        meta={metaItems}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {otherRegions.length > 0 && (
          <p className="text-muted mb-4 text-xs">
            Also available for:{" "}
            {otherRegions.map((m, i) => (
              <span key={m.id}>
                {i > 0 && ", "}
                <Link
                  href={`/guides/${m.slug}`}
                  className="hover:text-navy underline"
                >
                  {m.region ?? "Global"}
                </Link>
              </span>
            ))}
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="max-w-3xl min-w-0">
            <KeyTakeaways items={article.keyTakeaways} />

            <div className="mt-6 lg:hidden">
              <GuideTableOfContents headings={headings} />
            </div>

            <div className="prose prose-headings:font-display prose-headings:text-navy mt-8 max-w-none">
              {content}
            </div>

            <GuideSourceList sources={article.sources} />
            <RelatedProviders providers={guideProviders} />
            <RelatedGuides guides={relatedGuides} />
            <GuideNextSteps steps={nextSteps} />
          </article>

          <GuideSidebar
            headings={headings}
            category={article.category}
            readingMinutes={readingMinutes}
          />
        </div>
      </div>
    </>
  );
}
