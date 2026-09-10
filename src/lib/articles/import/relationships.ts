import { prisma } from "@/lib/prisma";
import { articleRepository, providerRepository } from "@/lib/repository";
import type { ArticleImportPayload } from "./types";

export interface RelationshipResult {
  warnings: string[];
}

interface ResolvedProvider {
  providerId: string;
  slug: string;
  relationship: "MENTIONED" | "COMPARED" | "FEATURED";
}

/**
 * Providers this article mentions, comparing, or features — plus any
 * `affiliateProviders` not already covered by `relatedProviders`. See
 * docs/article-publishing-format.md "Affiliate resolution": affiliateProviders
 * never stores a URL, it only makes the provider eligible for the site's
 * existing affiliate-CTA logic (which keys off ArticleProvider + an ACTIVE
 * AffiliateLink — see src/lib/affiliates/service.ts).
 *
 * Sync behavior: `relatedProviders`, when present, is treated as the
 * complete desired list — existing ArticleProvider rows for providers no
 * longer listed are removed. `affiliateProviders`-only entries are
 * additive and never cause a deletion, so adding an affiliate declaration
 * alone can't accidentally wipe curated provider mentions (see spec §12,
 * update safety).
 */
async function resolveProviders(
  articleId: string,
  payload: ArticleImportPayload,
  warnings: string[]
): Promise<void> {
  const relatedEntries = payload.relatedProviders;
  const affiliateSlugs = payload.affiliateProviders ?? [];

  if (relatedEntries === undefined && affiliateSlugs.length === 0) return;

  const bySlug = new Map<string, ResolvedProvider["relationship"]>();
  for (const entry of relatedEntries ?? []) {
    bySlug.set(entry.slug, entry.relationship);
  }
  for (const slug of affiliateSlugs) {
    if (!bySlug.has(slug)) bySlug.set(slug, "MENTIONED");
  }

  const resolved: ResolvedProvider[] = [];
  for (const [slug, relationship] of bySlug) {
    const provider = await providerRepository.findBySlug(slug, { select: { id: true } });
    if (!provider) {
      warnings.push(`Provider "${slug}" not found — no relationship was created`);
      continue;
    }
    resolved.push({ providerId: provider.id, slug, relationship });
  }

  if (relatedEntries !== undefined) {
    // relatedProviders is the authoritative full list — drop anything no
    // longer mentioned. affiliateProviders-only slugs are exempt (additive).
    const affiliateOnlySlugs = new Set(affiliateSlugs.filter((s) => !relatedEntries.some((e) => e.slug === s)));
    const keepProviderIds = resolved.map((r) => r.providerId);
    await prisma.articleProvider.deleteMany({
      where: {
        articleId,
        providerId: { notIn: keepProviderIds.length > 0 ? keepProviderIds : ["__none__"] },
        // Never delete a row we're about to keep purely because it came in
        // via affiliateProviders rather than relatedProviders this run.
        NOT: { provider: { slug: { in: Array.from(affiliateOnlySlugs) } } },
      },
    });
  }

  for (const entry of resolved) {
    await prisma.articleProvider.upsert({
      where: { articleId_providerId: { articleId, providerId: entry.providerId } },
      create: { articleId, providerId: entry.providerId, relationshipType: entry.relationship },
      update: { relationshipType: entry.relationship },
    });
  }

  if (affiliateSlugs.length > 0) {
    const activeLinks = await prisma.affiliateLink.findMany({
      where: { partnerSlug: { in: affiliateSlugs }, active: true },
      select: { partnerSlug: true },
    });
    const activeSlugSet = new Set(activeLinks.map((l) => l.partnerSlug));
    for (const slug of affiliateSlugs) {
      if (!activeSlugSet.has(slug)) {
        warnings.push(
          `"${slug}" requested as affiliate placement, but no ACTIVE affiliate link exists — placement was not created`
        );
      }
    }
  }
}

/**
 * Curated related guides (ArticleRelated), editor-ordered by array position.
 * Full-sync semantics when `relatedGuides` is present (see resolveProviders
 * doc comment for the same pattern) — a missing slug warns rather than
 * failing the whole article (spec §14), since batch imports commonly
 * reference sibling articles that land in the same run (spec §15).
 */
async function resolveRelatedGuides(
  articleId: string,
  payload: ArticleImportPayload,
  warnings: string[]
): Promise<void> {
  if (payload.relatedGuides === undefined) return;

  const resolved: { relatedArticleId: string; position: number }[] = [];
  for (let i = 0; i < payload.relatedGuides.length; i++) {
    const slug = payload.relatedGuides[i];
    if (slug === payload.slug) {
      warnings.push(`related article "${slug}" is this article itself — skipped`);
      continue;
    }
    const related = await articleRepository.findBySlug(slug, { select: { id: true } });
    if (!related) {
      warnings.push(`related article "${slug}" does not exist yet — skipped (will not block this import)`);
      continue;
    }
    resolved.push({ relatedArticleId: related.id, position: i });
  }

  const keepIds = resolved.map((r) => r.relatedArticleId);
  await prisma.articleRelated.deleteMany({
    where: { articleId, relatedArticleId: { notIn: keepIds.length > 0 ? keepIds : ["__none__"] } },
  });

  for (const entry of resolved) {
    await prisma.articleRelated.upsert({
      where: { articleId_relatedArticleId: { articleId, relatedArticleId: entry.relatedArticleId } },
      create: { articleId, relatedArticleId: entry.relatedArticleId, position: entry.position },
      update: { position: entry.position },
    });
  }
}

/**
 * Links a regional variant back to its GLOBAL/default article. Only acts
 * when `region` is a real region (not GLOBAL/undefined) — see spec §19 and
 * docs/article-publishing-format.md "Regional variants".
 */
async function resolveCanonicalArticle(
  articleId: string,
  payload: ArticleImportPayload,
  warnings: string[]
): Promise<void> {
  const isRegionalVariant = payload.region !== undefined && payload.region !== "GLOBAL";

  if (!isRegionalVariant) {
    if (payload.canonicalArticleSlug) {
      warnings.push(`canonicalArticleSlug was set but region is GLOBAL — ignored`);
    }
    return;
  }

  if (!payload.canonicalArticleSlug) {
    // Already warned at validation time (schema.ts) — nothing to resolve.
    return;
  }

  const canonical = await articleRepository.findBySlug(payload.canonicalArticleSlug, { select: { id: true } });
  if (!canonical) {
    warnings.push(
      `canonicalArticleSlug "${payload.canonicalArticleSlug}" does not exist yet — regional link was not created`
    );
    return;
  }
  if (canonical.id === articleId) {
    warnings.push(`canonicalArticleSlug "${payload.canonicalArticleSlug}" refers to this article itself — ignored`);
    return;
  }

  await prisma.article.update({ where: { id: articleId }, data: { canonicalArticleId: canonical.id } });
}

/**
 * Resolves everything that may depend on another article existing in the
 * same batch (PASS 2 — see spec §15). Must run after every file's core
 * Article row has already been committed (PASS 1), so cross-references
 * within a batch resolve regardless of file order.
 */
export async function resolveRelationships(articleId: string, payload: ArticleImportPayload): Promise<RelationshipResult> {
  const warnings: string[] = [];
  await resolveProviders(articleId, payload, warnings);
  await resolveRelatedGuides(articleId, payload, warnings);
  await resolveCanonicalArticle(articleId, payload, warnings);
  return { warnings };
}

/**
 * Read-only equivalent of resolveRelationships, for `--dry-run`. Reports the
 * same warnings (missing provider, missing related guide, no active
 * affiliate link, missing/self-referencing canonical slug) without writing
 * anything. Note: in a batch dry-run, a `relatedGuides`/`canonicalArticleSlug`
 * reference to another file in the *same* batch will warn as "not found"
 * even though it would resolve on a real run, since dry-run never creates
 * the article those checks would find (spec §15 two-pass ordering only
 * applies once PASS 1 has actually written something).
 */
export async function previewRelationshipWarnings(payload: ArticleImportPayload): Promise<string[]> {
  const warnings: string[] = [];

  const providerSlugs = new Set<string>([
    ...(payload.relatedProviders?.map((p) => p.slug) ?? []),
    ...(payload.affiliateProviders ?? []),
  ]);
  for (const slug of providerSlugs) {
    const provider = await providerRepository.findBySlug(slug, { select: { id: true } });
    if (!provider) warnings.push(`Provider "${slug}" not found — no relationship will be created`);
  }

  for (const slug of payload.relatedGuides ?? []) {
    if (slug === payload.slug) {
      warnings.push(`related article "${slug}" is this article itself — will be skipped`);
      continue;
    }
    const related = await articleRepository.findBySlug(slug, { select: { id: true } });
    if (!related) warnings.push(`related article "${slug}" does not exist yet`);
  }

  const isRegionalVariant = payload.region !== undefined && payload.region !== "GLOBAL";
  if (isRegionalVariant && payload.canonicalArticleSlug) {
    const canonical = await articleRepository.findBySlug(payload.canonicalArticleSlug, { select: { id: true } });
    if (!canonical) warnings.push(`canonicalArticleSlug "${payload.canonicalArticleSlug}" does not exist yet`);
  } else if (!isRegionalVariant && payload.canonicalArticleSlug) {
    warnings.push(`canonicalArticleSlug was set but region is GLOBAL — would be ignored`);
  }

  if (payload.affiliateProviders && payload.affiliateProviders.length > 0) {
    const activeLinks = await prisma.affiliateLink.findMany({
      where: { partnerSlug: { in: payload.affiliateProviders }, active: true },
      select: { partnerSlug: true },
    });
    const activeSlugSet = new Set(activeLinks.map((l) => l.partnerSlug));
    for (const slug of payload.affiliateProviders) {
      if (!activeSlugSet.has(slug)) {
        warnings.push(`"${slug}" requested as affiliate placement, but no ACTIVE affiliate link exists`);
      }
    }
  }

  return warnings;
}