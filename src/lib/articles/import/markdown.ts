import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({ gfm: true, breaks: false });

/**
 * Allowlist for imported article bodies. Deliberately narrower than
 * sanitize-html's defaults: no `<script>`, no `<iframe>`, no inline event
 * handlers, no `style` attribute, no `javascript:`/`data:` URLs — see
 * spec §21 (treat imported AI content as untrusted) and the fact that
 * Article.content is rendered via `dangerouslySetInnerHTML`
 * (src/app/crypto/guides/[slug]/page.tsx).
 */
const ALLOWED_TAGS = [
  "h2",
  "h3",
  "h4",
  "p",
  "a",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "blockquote",
  "code",
  "pre",
  "hr",
  "br",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "img",
];

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ["href", "title", "rel"],
    img: ["src", "alt", "title"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
  },
};

/**
 * Converts an article body (Markdown, per docs/article-publishing-format.md) into sanitized
 * HTML for storage in Article.content. Headings get their anchor ids from
 * src/lib/articles/content.ts at render time, not here.
 */
export function markdownToSafeHtml(markdown: string): string {
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  return sanitizeHtml(rawHtml, SANITIZE_OPTIONS).trim();
}