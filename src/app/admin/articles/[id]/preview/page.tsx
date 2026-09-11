import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getArticleById } from "@/lib/articles/service";
import { extractHeadings, estimateReadingMinutes } from "@/lib/articles/content";
import { Badge } from "@/components/ui/Badge";
import { Notice } from "@/components/ui/Notice";

/**
 * Admin-only preview — Req.md §42. Deliberately provisional: plain
 * sanitized HTML + heading ids, no embed parsing (that's the shared
 * ArticleRenderer, Block 3). Content shown here is already sanitized at
 * write time (see src/lib/articles/sanitize.ts), so this can render it
 * directly.
 *
 * - requireAdmin() independently of the /admin layout's own check, per the
 *   existing convention (a protected page is not the same as a protected
 *   mutation/view — see actions.ts).
 * - noindex via generateMetadata below.
 * - Cache-Control: no-store is set in src/proxy.ts for this exact path
 *   (Next's App Router has no per-page response-header hook), so the
 *   no-store guarantee lives at the routing layer, not here.
 * - Unlike the public Guide/News routes, this intentionally shows
 *   DRAFT/REVIEW/ARCHIVED content too — that's the whole point of preview.
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleById(id);
  return {
    title: article ? `Preview — ${article.title}` : "Preview not found",
    robots: { index: false, follow: false },
  };
}

export default async function ArticlePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  const { html, headings } = extractHeadings(article.content);
  const readingMinutes = estimateReadingMinutes(article.content);
  const publicPath = article.articleType === "GUIDE" ? `/crypto/guides/${article.slug}` : `/news/${article.slug}`;

  return (
    <div className="mx-auto max-w-3xl">
      <Notice>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            Admin preview — <strong>{article.status}</strong>. Never visible to the public at this URL; noindex,
            not cached.
          </span>
          <Link href={`/admin/articles/${article.id}`} className="font-semibold underline">
            Back to editor
          </Link>
        </div>
      </Notice>

      <article className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="blue">{article.articleType}</Badge>
          {article.category && <Badge>{article.category}</Badge>}
          {article.status === "PUBLISHED" && (
            <Link href={publicPath} className="text-xs font-semibold text-navy underline">
              View live →
            </Link>
          )}
        </div>

        <h1 className="font-display mt-3 text-3xl font-extrabold text-navy">{article.title || "(untitled)"}</h1>
        {article.excerpt && <p className="mt-3 text-lg text-muted">{article.excerpt}</p>}

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
          {article.author && <span>Written by {article.author}</span>}
          {article.reviewer && <span>Reviewed by {article.reviewer}</span>}
          {article.publishedAt && <span>Published {new Date(article.publishedAt).toLocaleDateString("en-AU")}</span>}
          {article.lastReviewedAt && (
            <span>Last reviewed {new Date(article.lastReviewedAt).toLocaleDateString("en-AU")}</span>
          )}
          <span>~{readingMinutes} min read</span>
        </div>

        {article.keyTakeaways.length > 0 && (
          <div className="mt-6 rounded-xl border border-border bg-panel-secondary p-4">
            <h2 className="text-sm font-bold text-navy">Key takeaways</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy">
              {article.keyTakeaways.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </div>
        )}

        {headings.length > 1 && (
          <nav className="mt-6 rounded-xl border border-border p-4 text-sm">
            <h2 className="font-bold text-navy">On this page</h2>
            <ul className="mt-2 space-y-1">
              {headings.map((h) => (
                <li key={h.id} className={h.level === 3 ? "ml-4" : undefined}>
                  <a href={`#${h.id}`} className="text-navy underline">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Already sanitized at write time (createArticle/updateArticle) — see src/lib/articles/sanitize.ts. */}
        <div className="prose prose-headings:font-display prose-headings:text-navy mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: html }} />

        {article.providers.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-navy">Related providers</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {article.providers.map((p) => (
                <li key={p.providerId}>
                  {p.provider.name} — <span className="text-muted">{p.relationshipType}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {article.sources.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-navy">Sources</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
              {article.sources.map((s, i) => (
                <li key={i}>
                  <a href={s.url} className="text-navy underline" target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                  {s.sourceType && <span className="text-muted"> · {s.sourceType}</span>}
                </li>
              ))}
            </ol>
          </div>
        )}
      </article>
    </div>
  );
}