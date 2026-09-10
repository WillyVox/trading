import { prisma } from "@/lib/prisma";
import { articleRepository } from "@/lib/repository";
import type { ArticleImportPayload } from "./types";

export interface CoreUpsertResult {
  id: string;
  outcome: "CREATED" | "UPDATED";
}

/**
 * Builds the scalar-field portion of the Prisma write, including only keys
 * that were actually present in the import file. This is the core of the
 * "safe merge" rule from spec §12: omitted fields are left completely
 * untouched on UPDATE rather than being nulled out. `status` is
 * deliberately never included here — see upsertArticleCore below.
 */
function buildScalarData(payload: ArticleImportPayload) {
  const data: Record<string, unknown> = {
    title: payload.title,
    content: payload.content,
  };

  if (payload.excerpt !== undefined) data.excerpt = payload.excerpt;
  if (payload.category !== undefined) data.category = payload.category;
  if (payload.seoTitle !== undefined) data.seoTitle = payload.seoTitle;
  if (payload.seoDescription !== undefined) data.seoDescription = payload.seoDescription;
  if (payload.canonicalUrl !== undefined) data.canonicalUrl = payload.canonicalUrl;
  if (payload.featuredImage !== undefined) data.featuredImage = payload.featuredImage;
  if (payload.author !== undefined) data.author = payload.author;
  if (payload.reviewer !== undefined) data.reviewer = payload.reviewer;
  if (payload.noIndex !== undefined) data.noIndex = payload.noIndex;
  if (payload.keyTakeaways !== undefined) data.keyTakeaways = payload.keyTakeaways;
  if (payload.searchIntent !== undefined) data.searchIntent = payload.searchIntent;
  if (payload.region !== undefined) data.region = payload.region === "GLOBAL" ? null : payload.region;

  return data;
}

async function syncTags(articleId: string, tags: string[] | undefined) {
  if (tags === undefined) return; // not present in file — leave existing tags untouched
  await prisma.articleTag.deleteMany({ where: { articleId } });
  if (tags.length > 0) {
    await prisma.articleTag.createMany({ data: tags.map((tag) => ({ articleId, tag })) });
  }
}

async function syncSources(articleId: string, sources: { label: string; url: string }[] | undefined) {
  if (sources === undefined) return; // not present in file — leave existing sources untouched
  await prisma.articleSource.deleteMany({ where: { articleId } });
  if (sources.length > 0) {
    await prisma.articleSource.createMany({
      data: sources.map((s) => ({ articleId, label: s.label, url: s.url })),
    });
  }
}

/**
 * PASS 1 (spec §15): creates or updates the core Article row plus its
 * directly-owned tags/sources, atomically per article (spec §30). Does NOT
 * touch provider/related-guide/canonical-article relationships — those may
 * reference another article in the same batch that hasn't been written yet,
 * and are resolved afterwards in relationships.ts (PASS 2).
 *
 * Idempotent by slug (spec §11/§33): re-running with the same file never
 * creates a duplicate article. Status is only ever set on CREATE, forced to
 * DRAFT regardless of what the file says (spec §7) — UPDATE never includes
 * `status` in its data at all, so an already-PUBLISHED article can never be
 * silently unpublished by a re-import (spec §12).
 */
export async function upsertArticleCore(payload: ArticleImportPayload): Promise<CoreUpsertResult> {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.article.findUnique({ where: { slug: payload.slug }, select: { id: true } });
    const scalarData = buildScalarData(payload);

    let id: string;
    let outcome: CoreUpsertResult["outcome"];

    if (existing) {
      const updated = await tx.article.update({ where: { id: existing.id }, data: scalarData });
      id = updated.id;
      outcome = "UPDATED";
    } else {
      const created = await tx.article.create({
        data: { ...scalarData, slug: payload.slug, status: "DRAFT" },
      });
      id = created.id;
      outcome = "CREATED";
    }

    await syncTags(id, payload.tags);
    await syncSources(id, payload.sources);

    return { id, outcome };
  });
}

/** Read-only lookup used by --dry-run to report CREATE vs UPDATE without writing anything. */
export async function previewOutcome(slug: string): Promise<"CREATED" | "UPDATED"> {
  const existing = await articleRepository.findBySlug(slug, { select: { id: true } });
  return existing ? "UPDATED" : "CREATED";
}