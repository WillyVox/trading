"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma, ArticleType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { validateArticleForm, type ArticleFormInput } from "@/lib/articles/validation";
import { sanitizeArticleContent } from "@/lib/articles/sanitize";
import {
  isValidArticleStatusTransition,
  type ArticleLifecycleStatus,
} from "@/lib/articles/status-transitions";

/**
 * Block 2 admin mutations for the Article domain. Every action
 * independently calls requireAdmin() — the admin layout already blocks
 * unauthenticated/non-admin *page* access, but per the existing
 * affiliates/actions.ts convention (and Req.md §43), a protected page is
 * not the same as a protected mutation.
 *
 * createArticle/updateArticle treat the form as "save the whole editor",
 * not a partial PATCH — every relation (tags, sources, provider
 * relationships, crypto assets, related guides) is a full sync against
 * what was submitted, same semantics as the importer's
 * relationships.ts/importer.ts (delete what's no longer listed, upsert the
 * rest), just always-sync rather than "undefined means untouched" since
 * there's no such thing as an omitted field in a submitted form.
 */

function publicPathFor(articleType: ArticleType, slug: string): string {
  return articleType === "GUIDE" ? `/crypto/guides/${slug}` : `/news/${slug}`;
}

function revalidateArticlePaths(opts: {
  id: string;
  before?: { articleType: ArticleType; slug: string } | null;
  after: { articleType: ArticleType; slug: string };
}) {
  revalidatePath("/admin/articles");
  // Admin edit route is /admin/articles/[id] -- the id, not the slug, is
  // what the route actually keys on. Previously this revalidated
  // `/admin/articles/${slug}`, which never matches that route and was a
  // silent no-op.
  revalidatePath(`/admin/articles/${opts.id}`);
  revalidatePath(`/admin/articles/${opts.id}/preview`);
  revalidatePath(opts.after.articleType === "GUIDE" ? "/crypto/guides" : "/news");
  revalidatePath(publicPathFor(opts.after.articleType, opts.after.slug));
  if (opts.before && (opts.before.slug !== opts.after.slug || opts.before.articleType !== opts.after.articleType)) {
    revalidatePath(opts.before.articleType === "GUIDE" ? "/crypto/guides" : "/news");
    revalidatePath(publicPathFor(opts.before.articleType, opts.before.slug));
  }
}

/** Parses the raw <form> submission into the shape validateArticleForm() expects. */
function parseArticleFormData(formData: FormData): unknown {
  const str = (key: string): string | undefined => {
    const v = formData.get(key);
    return typeof v === "string" && v.trim() !== "" ? v : undefined;
  };
  const bool = (key: string): boolean => formData.get(key) === "on" || formData.get(key) === "true";
  const linesToList = (key: string): string[] | undefined => {
    const raw = formData.get(key);
    if (typeof raw !== "string") return undefined;
    const items = raw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return items;
  };
  const csvToList = (key: string): string[] | undefined => {
    const raw = formData.get(key);
    if (typeof raw !== "string") return undefined;
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };
  const json = (key: string): unknown => {
    const raw = formData.get(key);
    if (typeof raw !== "string" || raw.trim() === "") return undefined;
    try {
      return JSON.parse(raw);
    } catch {
      return undefined;
    }
  };

  return {
    title: str("title") ?? "",
    slug: str("slug") ?? "",
    articleType: str("articleType"),
    category: str("category"),
    excerpt: str("excerpt"),
    content: str("content") ?? "",
    author: str("author"),
    reviewer: str("reviewer"),
    lastReviewedAt: str("lastReviewedAt"),
    keyTakeaways: linesToList("keyTakeaways"),
    tags: csvToList("tags"),
    searchIntent: str("searchIntent"),
    seoTitle: str("seoTitle"),
    seoDescription: str("seoDescription"),
    canonicalUrl: str("canonicalUrl"),
    featuredImage: str("featuredImage"),
    featuredImageAlt: str("featuredImageAlt"),
    noIndex: bool("noIndex"),
    affiliateDisclosureRequired: bool("affiliateDisclosureRequired"),
    region: str("region"),
    canonicalArticleId: str("canonicalArticleId"),
    scheduledAt: str("scheduledAt"),
    providerRelationships: json("providerRelationshipsJson") ?? [],
    cryptoAssetIds: formData.getAll("cryptoAssetIds").filter((v): v is string => typeof v === "string"),
    relatedGuideIds: formData.getAll("relatedGuideIds").filter((v): v is string => typeof v === "string"),
    sources: json("sourcesJson") ?? [],
  };
}

function toDateOrNull(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Shared scalar-field mapping for create/update — see buildScalarData() in import/importer.ts for the sibling pattern on the importer side. */
function buildScalarData(data: ArticleFormInput) {
  return {
    title: data.title,
    slug: data.slug,
    articleType: data.articleType,
    category: data.category ?? null,
    excerpt: data.excerpt ?? null,
    content: sanitizeArticleContent(data.content),
    author: data.author ?? null,
    reviewer: data.reviewer ?? null,
    lastReviewedAt: toDateOrNull(data.lastReviewedAt),
    keyTakeaways: data.keyTakeaways ?? [],
    searchIntent: data.searchIntent ?? null,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
    canonicalUrl: data.canonicalUrl ?? null,
    featuredImage: data.featuredImage ?? null,
    featuredImageAlt: data.featuredImageAlt ?? null,
    noIndex: data.noIndex ?? false,
    affiliateDisclosureRequired: data.affiliateDisclosureRequired ?? false,
    region: !data.region || data.region === "GLOBAL" ? null : data.region,
    canonicalArticleId: data.canonicalArticleId || null,
    // Advisory only — see docs/ROADMAP.md "Scheduling": nothing reads this
    // to auto-publish. It exists purely as an editor reminder.
    scheduledAt: toDateOrNull(data.scheduledAt),
  };
}

async function assertSlugAvailable(slug: string, excludeArticleId?: string) {
  const existing = await prisma.article.findUnique({ where: { slug }, select: { id: true } });
  if (existing && existing.id !== excludeArticleId) {
    throw new Error(`Slug "${slug}" is already used by another article — choose a different slug.`);
  }
}

/**
 * assertSlugAvailable() above is a pre-check, not a lock — two concurrent
 * saves of the same new slug could both pass it before either write lands.
 * Postgres's own `@unique` constraint on Article.slug is the real
 * guarantee (no duplicate row can ever exist), but without this, the loser
 * of that race would see Prisma's raw "Unique constraint failed on the
 * fields: (`slug`)" error instead of the same friendly message
 * assertSlugAvailable gives in the common (non-race) case. Wrap any
 * article write that can hit the slug unique constraint in this.
 */
async function withFriendlySlugConflict<T>(slug: string, write: () => Promise<T>): Promise<T> {
  try {
    return await write();
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error(`Slug "${slug}" is already used by another article — choose a different slug.`);
    }
    throw err;
  }
}

export async function createArticle(formData: FormData) {
  await requireAdmin();

  const raw = parseArticleFormData(formData);
  const validation = validateArticleForm(raw);
  if (!validation.ok) {
    throw new Error(`Could not save article: ${validation.errors.join("; ")}`);
  }
  const data = validation.data!;

  await assertSlugAvailable(data.slug);

  const created = await withFriendlySlugConflict(data.slug, () =>
    prisma.article.create({
      data: {
        ...buildScalarData(data),
        status: "DRAFT", // always DRAFT on create, regardless of what the form contains — see Req.md §40 (DRAFT-only ingestion applies to admin create too)
        tags: { create: (data.tags ?? []).map((tag) => ({ tag })) },
        sources: {
          create: (data.sources ?? []).map((s) => ({
            label: s.label,
            url: s.url,
            sourceType: s.sourceType ?? null,
          })),
        },
        providers: {
          create: (data.providerRelationships ?? []).map((p) => ({
            providerId: p.providerId,
            relationshipType: p.relationship,
          })),
        },
        cryptoAssets: {
          create: (data.cryptoAssetIds ?? []).map((assetId) => ({ assetId })),
        },
        relatedFrom: {
          create: (data.relatedGuideIds ?? []).map((relatedArticleId, position) => ({
            relatedArticleId,
            position,
          })),
        },
      },
      select: { id: true },
    })
  );

  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${created.id}`);
}

export async function updateArticle(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("id is required");

  const existing = await prisma.article.findUnique({
    where: { id },
    select: { slug: true, articleType: true, status: true },
  });
  if (!existing) throw new Error("Article not found");

  const raw = parseArticleFormData(formData);
  const validation = validateArticleForm(raw);
  if (!validation.ok) {
    throw new Error(`Could not save article: ${validation.errors.join("; ")}`);
  }
  const data = validation.data!;

  await assertSlugAvailable(data.slug, id);

  await withFriendlySlugConflict(data.slug, () => prisma.$transaction(async (tx) => {
    await tx.article.update({ where: { id }, data: buildScalarData(data) });

    await tx.articleTag.deleteMany({ where: { articleId: id } });
    if ((data.tags ?? []).length > 0) {
      await tx.articleTag.createMany({ data: data.tags!.map((tag) => ({ articleId: id, tag })) });
    }

    await tx.articleSource.deleteMany({ where: { articleId: id } });
    if ((data.sources ?? []).length > 0) {
      await tx.articleSource.createMany({
        data: data.sources!.map((s) => ({
          articleId: id,
          label: s.label,
          url: s.url,
          sourceType: s.sourceType ?? null,
        })),
      });
    }

    const keepProviderIds = (data.providerRelationships ?? []).map((p) => p.providerId);
    await tx.articleProvider.deleteMany({
      where: { articleId: id, providerId: { notIn: keepProviderIds.length > 0 ? keepProviderIds : ["__none__"] } },
    });
    for (const p of data.providerRelationships ?? []) {
      await tx.articleProvider.upsert({
        where: { articleId_providerId: { articleId: id, providerId: p.providerId } },
        create: { articleId: id, providerId: p.providerId, relationshipType: p.relationship },
        update: { relationshipType: p.relationship },
      });
    }

    const keepAssetIds = data.cryptoAssetIds ?? [];
    await tx.articleCryptoAsset.deleteMany({
      where: { articleId: id, assetId: { notIn: keepAssetIds.length > 0 ? keepAssetIds : ["__none__"] } },
    });
    for (const assetId of keepAssetIds) {
      await tx.articleCryptoAsset.upsert({
        where: { articleId_assetId: { articleId: id, assetId } },
        create: { articleId: id, assetId },
        update: {},
      });
    }

    const keepRelatedIds = (data.relatedGuideIds ?? []).filter((relatedId) => relatedId !== id);
    await tx.articleRelated.deleteMany({
      where: { articleId: id, relatedArticleId: { notIn: keepRelatedIds.length > 0 ? keepRelatedIds : ["__none__"] } },
    });
    for (let i = 0; i < keepRelatedIds.length; i++) {
      await tx.articleRelated.upsert({
        where: { articleId_relatedArticleId: { articleId: id, relatedArticleId: keepRelatedIds[i] } },
        create: { articleId: id, relatedArticleId: keepRelatedIds[i], position: i },
        update: { position: i },
      });
    }
  }));

  revalidateArticlePaths({
    id,
    before: { articleType: existing.articleType, slug: existing.slug },
    after: { articleType: data.articleType, slug: data.slug },
  });
}

/**
 * Publish-time hard validation (Req.md §44). Content is already sanitized
 * at write time (see buildScalarData -> sanitizeArticleContent), and
 * provider/asset relationships are already FK-enforced by Postgres at
 * create/update time, so the checks below are a final defence-in-depth
 * gate rather than the first line of validation. Soft/editorial warnings
 * (missing excerpt, no sources, etc.) are intentionally NOT enforced here
 * — they're surfaced continuously in the admin editor's checklist panel so
 * the admin can make an informed call, per Req.md §44 "allow admins to
 * make informed decisions."
 */
async function assertPublishable(articleId: string) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { title: true, slug: true, content: true, articleType: true },
  });
  if (!article) throw new Error("Article not found");
  const problems: string[] = [];
  if (!article.title.trim()) problems.push("title is empty");
  if (!article.slug.trim()) problems.push("slug is empty");
  if (!article.content.trim()) problems.push("content is empty");
  if (!article.articleType) problems.push("article type is not set");
  if (problems.length > 0) {
    throw new Error(`Cannot publish: ${problems.join("; ")}`);
  }
  return article;
}

async function transitionStatus(
  formData: FormData,
  opts: {
    to: ArticleLifecycleStatus;
    extraData?: (article: { publishedAt: Date | null }) => Prisma.ArticleUpdateInput;
  }
) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("id is required");

  const existing = await prisma.article.findUnique({
    where: { id },
    select: { status: true, slug: true, articleType: true, publishedAt: true },
  });
  if (!existing) throw new Error("Article not found");
  // Single source of truth for legal transitions -- see
  // src/lib/articles/status-transitions.ts. Previously each exported
  // action below repeated its own `from` array; that's now generated from
  // (and tested against) one shared table instead of six parallel copies.
  if (!isValidArticleStatusTransition(existing.status, opts.to)) {
    throw new Error(`Cannot move from ${existing.status} to ${opts.to} directly.`);
  }

  if (opts.to === "PUBLISHED") {
    await assertPublishable(id);
  }

  const extra = opts.extraData ? opts.extraData(existing) : {};
  await prisma.article.update({ where: { id }, data: { status: opts.to, ...extra } });

  revalidateArticlePaths({
    id,
    before: { articleType: existing.articleType, slug: existing.slug },
    after: { articleType: existing.articleType, slug: existing.slug },
  });
}

export async function submitArticleForReview(formData: FormData) {
  await transitionStatus(formData, { to: "REVIEW" });
}

export async function moveArticleBackToDraft(formData: FormData) {
  await transitionStatus(formData, { to: "DRAFT" });
}

export async function publishArticle(formData: FormData) {
  await transitionStatus(formData, {
    to: "PUBLISHED",
    extraData: (article) => (article.publishedAt ? {} : { publishedAt: new Date() }),
  });
}

export async function unpublishArticle(formData: FormData) {
  await transitionStatus(formData, { to: "DRAFT" });
}

export async function archiveArticle(formData: FormData) {
  await transitionStatus(formData, { to: "ARCHIVED" });
}

/**
 * Not part of the DRAFT -> REVIEW -> PUBLISHED -> ARCHIVED forward flow in
 * Req.md, but ARCHIVED with no way back would be a one-way trap for a
 * misclick — see the "decide + document ARCHIVED behaviour" instruction in
 * Req.md §4. Restoring always lands back in DRAFT, never straight to
 * PUBLISHED (see ARTICLE_STATUS_TRANSITIONS), so a restored article always
 * goes through review again.
 */
export async function restoreArticleFromArchive(formData: FormData) {
  await transitionStatus(formData, { to: "DRAFT" });
}