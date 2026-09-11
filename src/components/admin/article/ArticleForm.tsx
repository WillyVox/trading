import { createArticle, updateArticle } from "@/lib/articles/actions";
import {
  getProvidersForArticleForm,
  getCryptoAssetsForArticleForm,
  getArticlesForRelatedPicker,
} from "@/lib/articles/service";
import { ARTICLE_TYPES, SEARCH_INTENTS } from "@/lib/articles/validation";
import { IMPORT_REGIONS } from "@/lib/articles/import/types";
import { buildEditorialChecklist } from "@/lib/articles/editorial-checklist";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { TitleSlugFields } from "@/components/admin/article/TitleSlugFields";
import { ProviderRelationshipsPicker } from "@/components/admin/article/ProviderRelationshipsPicker";
import { SourcesEditor } from "@/components/admin/article/SourcesEditor";
import { EditorialChecklistPanel } from "@/components/admin/article/EditorialChecklistPanel";
import { PublishingPanel } from "@/components/admin/article/PublishingPanel";

/**
 * The article shape this form edits — a subset of what
 * articleDetailInclude (src/lib/articles/service.ts) returns from
 * getArticleById/getArticleBySlug. Kept intentionally loose (fields
 * optional) so `mode: "create"` can pass `article={undefined}`.
 */
interface ArticleFormData {
  id: string;
  title: string;
  slug: string;
  articleType: "NEWS" | "GUIDE";
  category: string | null;
  excerpt: string | null;
  content: string;
  author: string | null;
  reviewer: string | null;
  lastReviewedAt: Date | null;
  keyTakeaways: string[];
  searchIntent: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  noIndex: boolean;
  affiliateDisclosureRequired: boolean;
  region: string | null;
  canonicalArticleId: string | null;
  scheduledAt: Date | null;
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  tags: { tag: string }[];
  sources: { label: string; url: string; sourceType: string | null }[];
  providers: { providerId: string; relationshipType: "MENTIONED" | "COMPARED" | "FEATURED" }[];
  cryptoAssets: { assetId: string }[];
  relatedFrom: { relatedArticleId: string }[];
}

function toDateInputValue(d: Date | null | undefined): string {
  if (!d) return "";
  return d.toISOString().slice(0, 10); // yyyy-mm-dd for <input type="date">
}

function toDateTimeInputValue(d: Date | null | undefined): string {
  if (!d) return "";
  return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm for <input type="datetime-local">
}

const inputClass =
  "rounded-lg border border-border bg-panel-secondary px-3 py-2 text-navy placeholder:text-muted";
const labelClass = "flex flex-col text-sm";
const labelSpanClass = "mb-1 font-medium text-navy";

export async function ArticleForm({
  mode,
  article,
}: {
  mode: "create" | "edit";
  article?: ArticleFormData;
}) {
  const [providers, cryptoAssets, relatedCandidates] = await Promise.all([
    getProvidersForArticleForm(),
    getCryptoAssetsForArticleForm(),
    getArticlesForRelatedPicker(article?.id),
  ]);

  const selectedProviderRelationships =
    article?.providers.map((p) => ({ providerId: p.providerId, relationship: p.relationshipType })) ?? [];
  const selectedSources = article?.sources.map((s) => ({ label: s.label, url: s.url, sourceType: s.sourceType ?? undefined })) ?? [];
  const selectedAssetIds = new Set(article?.cryptoAssets.map((a) => a.assetId) ?? []);
  const selectedRelatedIds = new Set(article?.relatedFrom.map((r) => r.relatedArticleId) ?? []);

  const checklist =
    mode === "edit" && article
      ? buildEditorialChecklist({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          seoTitle: article.seoTitle,
          seoDescription: article.seoDescription,
          featuredImage: article.featuredImage,
          featuredImageAlt: article.featuredImageAlt,
          author: article.author,
          reviewer: article.reviewer,
          lastReviewedAt: article.lastReviewedAt,
          keyTakeaways: article.keyTakeaways,
          sourceCount: article.sources.length,
          providerRelationships: article.providers.map((p) => ({ relationship: p.relationshipType })),
          cryptoAssetCount: article.cryptoAssets.length,
          noIndex: article.noIndex,
          affiliateDisclosureRequired: article.affiliateDisclosureRequired,
        })
      : null;

  const action = mode === "create" ? createArticle : updateArticle;

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-6">
        {mode === "edit" && article && <input type="hidden" name="id" value={article.id} />}

        <Card>
          <h2 className="font-display text-lg font-bold text-navy">Basic information</h2>
          <div className="mt-4 space-y-4">
            <TitleSlugFields
              initialTitle={article?.title ?? ""}
              initialSlug={article?.slug ?? ""}
              isPublished={article?.status === "PUBLISHED"}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                <span className={labelSpanClass}>Article type</span>
                <select name="articleType" required defaultValue={article?.articleType ?? ""} className={inputClass}>
                  <option value="" disabled>
                    Select a type…
                  </option>
                  {ARTICLE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                <span className={labelSpanClass}>Category</span>
                <input
                  name="category"
                  defaultValue={article?.category ?? ""}
                  placeholder="crypto-exchanges"
                  className={inputClass}
                />
                <span className="mt-1 text-xs text-muted">A topic, not the content type — e.g. "Bitcoin", "Regulation".</span>
              </label>
            </div>
            <label className={labelClass}>
              <span className={labelSpanClass}>Excerpt</span>
              <textarea
                name="excerpt"
                defaultValue={article?.excerpt ?? ""}
                rows={2}
                maxLength={500}
                placeholder="Shown in listings and used as a fallback meta description."
                className={inputClass}
              />
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold text-navy">Content</h2>
          <p className="mt-1 text-xs text-muted">
            HTML content. A rich block-based editor is planned for a later pass — this is deliberately a plain
            textarea for now; content is sanitized on save regardless of what's pasted in here.
          </p>
          <p className="mt-1 text-xs text-muted">
            Video embeds are supported: <code className="font-mono">{"{{video:youtube:VIDEO_ID:Optional caption}}"}</code>{" "}
            or <code className="font-mono">{"{{video:vimeo:VIDEO_ID}}"}</code>, on their own line. Other embed markers
            (e.g. <code className="font-mono">{"{{provider-comparison:...}}"}</code>) can be typed in now — they'll show a
            "not yet available" note in Preview until that block type ships.
          </p>
          <textarea
            name="content"
            required
            defaultValue={article?.content ?? ""}
            rows={20}
            className={`${inputClass} mt-3 w-full font-mono text-sm`}
            placeholder="<h2>Our top exchanges</h2>&#10;&#10;<p>...</p>"
          />
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold text-navy">Key takeaways &amp; tags</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              <span className={labelSpanClass}>Key takeaways</span>
              <textarea
                name="keyTakeaways"
                defaultValue={(article?.keyTakeaways ?? []).join("\n")}
                rows={5}
                placeholder={"One takeaway per line\ne.g. CoinSpot has the lowest AUD deposit fees of the three"}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              <span className={labelSpanClass}>Tags</span>
              <textarea
                name="tags"
                defaultValue={(article?.tags ?? []).map((t) => t.tag).join(", ")}
                rows={5}
                placeholder="crypto, exchanges, australia, beginner"
                className={inputClass}
              />
              <span className="mt-1 text-xs text-muted">Comma-separated.</span>
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold text-navy">Relationships</h2>
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-navy">Providers</h3>
              <p className="mt-1 text-xs text-muted">
                Drives exchange-page/comparison-page article surfacing (later block) — never influenced by
                affiliate commission.
              </p>
              <div className="mt-2">
                <ProviderRelationshipsPicker providers={providers} initialValue={selectedProviderRelationships} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                <span className={labelSpanClass}>Crypto assets</span>
                <select name="cryptoAssetIds" multiple size={6} className={`${inputClass}`}>
                  {cryptoAssets.map((a) => (
                    <option key={a.id} value={a.id} selected={selectedAssetIds.has(a.id)}>
                      {a.name} ({a.symbol})
                    </option>
                  ))}
                </select>
                <span className="mt-1 text-xs text-muted">Ctrl/Cmd-click to select multiple.</span>
              </label>
              <label className={labelClass}>
                <span className={labelSpanClass}>Related guides</span>
                <select name="relatedGuideIds" multiple size={6} className={`${inputClass}`}>
                  {relatedCandidates.map((a) => (
                    <option key={a.id} value={a.id} selected={selectedRelatedIds.has(a.id)}>
                      {a.title} · {a.articleType} · {a.status}
                    </option>
                  ))}
                </select>
                <span className="mt-1 text-xs text-muted">Curated related content — takes priority over automatic relevance.</span>
              </label>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold text-navy">Sources &amp; evidence</h2>
          <div className="mt-4">
            <SourcesEditor initialValue={selectedSources} />
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold text-navy">Editorial trust</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className={labelClass}>
              <span className={labelSpanClass}>Author</span>
              <input name="author" defaultValue={article?.author ?? ""} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span className={labelSpanClass}>Reviewer</span>
              <input name="reviewer" defaultValue={article?.reviewer ?? ""} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span className={labelSpanClass}>Last reviewed</span>
              <input
                type="date"
                name="lastReviewedAt"
                defaultValue={toDateInputValue(article?.lastReviewedAt)}
                className={inputClass}
              />
              <span className="mt-1 text-xs text-muted">Meaningfully fact-checked, not just edited — distinct from "updated".</span>
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold text-navy">SEO</h2>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                <span className={labelSpanClass}>SEO title</span>
                <input name="seoTitle" defaultValue={article?.seoTitle ?? ""} maxLength={70} className={inputClass} />
              </label>
              <label className={labelClass}>
                <span className={labelSpanClass}>Search intent</span>
                <select name="searchIntent" defaultValue={article?.searchIntent ?? ""} className={inputClass}>
                  <option value="">Unset</option>
                  {SEARCH_INTENTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className={labelClass}>
              <span className={labelSpanClass}>Meta description</span>
              <textarea
                name="seoDescription"
                defaultValue={article?.seoDescription ?? ""}
                rows={2}
                maxLength={200}
                className={inputClass}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                <span className={labelSpanClass}>Canonical URL</span>
                <input name="canonicalUrl" defaultValue={article?.canonicalUrl ?? ""} className={inputClass} />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="noIndex" defaultChecked={article?.noIndex ?? false} className="h-4 w-4" />
                <span className="font-medium text-navy">Noindex</span>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                <span className={labelSpanClass}>Featured image URL</span>
                <input name="featuredImage" defaultValue={article?.featuredImage ?? ""} className={inputClass} />
              </label>
              <label className={labelClass}>
                <span className={labelSpanClass}>Featured image alt text</span>
                <input
                  name="featuredImageAlt"
                  defaultValue={article?.featuredImageAlt ?? ""}
                  placeholder="Describe the image — not keywords"
                  className={inputClass}
                />
              </label>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold text-navy">Affiliate configuration</h2>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="affiliateDisclosureRequired"
              defaultChecked={article?.affiliateDisclosureRequired ?? false}
              className="h-4 w-4"
            />
            <span className="font-medium text-navy">Affiliate disclosure required</span>
          </label>
          <p className="mt-1 text-xs text-muted">
            Enable this whenever the article features/compares a provider with an affiliate relationship — the
            editorial checklist below warns if this looks mismatched.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold text-navy">Regional variant</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              <span className={labelSpanClass}>Region</span>
              <select name="region" defaultValue={article?.region ?? "GLOBAL"} className={inputClass}>
                {IMPORT_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              <span className={labelSpanClass}>Canonical article (if this is a regional variant)</span>
              <select name="canonicalArticleId" defaultValue={article?.canonicalArticleId ?? ""} className={inputClass}>
                <option value="">None — this is the global/default article</option>
                {relatedCandidates.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} · {a.articleType} · {a.status}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold text-navy">Scheduling</h2>
          <label className={labelClass}>
            <span className={labelSpanClass}>Scheduled at</span>
            <input
              type="datetime-local"
              name="scheduledAt"
              defaultValue={toDateTimeInputValue(article?.scheduledAt)}
              className={`${inputClass} sm:max-w-xs`}
            />
          </label>
          <div className="mt-3">
            <Notice>
              Advisory only — nothing in this project automatically publishes at this time. Treat it as a personal
              reminder; publishing always remains an explicit action below.
            </Notice>
          </div>
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-background hover:bg-navy-dark"
          >
            {mode === "create" ? "Save as draft" : "Save changes"}
          </button>
        </div>
      </form>

      {mode === "edit" && article && (
        <>
          {checklist && <EditorialChecklistPanel items={checklist} />}
          <PublishingPanel
            articleId={article.id}
            status={article.status}
            createdAt={article.createdAt}
            updatedAt={article.updatedAt}
            publishedAt={article.publishedAt}
          />
        </>
      )}
    </div>
  );
}