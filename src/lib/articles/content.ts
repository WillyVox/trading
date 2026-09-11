export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

/**
 * Extracts H2/H3 headings from article HTML and injects stable anchor ids
 * into the returned HTML so GuideTableOfContents links (#heading-id)
 * resolve correctly. Regex-based rather than a full HTML parser — article
 * content is admin-authored (not arbitrary user input), so this trade-off
 * is acceptable; revisit if a real HTML parser dependency gets added.
 */
export function extractHeadings(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();

  const annotated = html.replace(
    /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (full: string, tag: string, attrs: string, inner: string) => {
      const level = tag.toLowerCase() === "h2" ? 2 : 3;
      const text = stripTags(inner);
      if (!text) return full;

      let id = slugify(text) || `section-${headings.length + 1}`;
      const priorCount = seen.get(id) ?? 0;
      seen.set(id, priorCount + 1);
      if (priorCount > 0) id = `${id}-${priorCount + 1}`;

      headings.push({ id, text, level });

      const hasId = /\sid=/.test(attrs);
      const newAttrs = hasId ? attrs : `${attrs} id="${id}"`;
      return `<${tag}${newAttrs}>${inner}</${tag}>`;
    }
  );

  return { html: annotated, headings };
}

/**
 * Wraps every <table>...</table> block in a horizontally-scrollable
 * container so a wide comparison-style table (many columns) can't break
 * the article's mobile layout — see docs/IMPLEMENTATION-PLAN.md Article
 * CMS Block 3 / Req.md §31 & §60. Regex-based, same trade-off as
 * extractHeadings above (admin-authored content, not arbitrary user
 * input). Must run on already-sanitized HTML — the wrapper div itself is
 * system-authored, not part of the sanitize-html allowlist, so it has to
 * be added after sanitization, never before.
 */
export function wrapTables(html: string): string {
  return html.replace(
    /<table[^>]*>[\s\S]*?<\/table>/gi,
    (tableHtml) => `<div class="article-table-wrap overflow-x-auto">${tableHtml}</div>`
  );
}

const WORDS_PER_MINUTE = 200;

/** Reading time derived from actual content length — never a fabricated/fixed number. */
export function estimateReadingMinutes(html: string): number {
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}