import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { ARTICLE_SANITIZE_OPTIONS } from "@/lib/articles/sanitize";

marked.setOptions({ gfm: true, breaks: false });

/**
 * Converts an article body (Markdown, per docs/article-publishing-format.md) into sanitized
 * HTML for storage in Article.content. Headings get their anchor ids from
 * src/lib/articles/content.ts at render time, not here.
 *
 * Sanitization uses the SAME allowlist as the admin editor
 * (src/lib/articles/sanitize.ts) — see that file's header comment. This
 * used to be a separate, slightly different allowlist here; keeping one
 * shared policy means content saved by an admin and content brought in by
 * the importer are never sanitized differently, even if an admin later
 * edits an imported article.
 */
export function markdownToSafeHtml(markdown: string): string {
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  return sanitizeHtml(rawHtml, ARTICLE_SANITIZE_OPTIONS).trim();
}