import sanitizeHtml from "sanitize-html";

/**
 * The one HTML sanitization policy for article content — see
 * docs/IMPLEMENTATION-PLAN.md Article CMS Block 3 ("one policy, not
 * three") and Req.md §17 ("avoid having three inconsistent HTML
 * policies").
 *
 * This is now the single source of truth for what HTML is allowed in
 * Article.content, used by BOTH:
 *  - the admin editor (createArticle/updateArticle in actions.ts), and
 *  - the file importer (src/lib/articles/import/markdown.ts),
 * so content saved through either path — or edited via one after
 * originating from the other — is sanitized identically. Previously these
 * were two separate allowlists that had already drifted (different img
 * attributes, only the importer added rel="noopener noreferrer" to links).
 * If that happens again, an admin editing an imported article would
 * silently change its safety/attribute profile on save — don't let a
 * second copy of this policy get created; extend this one instead.
 *
 * Block 3/4 will extend this policy further (embed marker passthrough,
 * video wrapper elements) but should still import and build on this
 * module.
 */
const ALLOWED_TAGS = [
  "h2",
  "h3",
  "h4",
  "p",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "figure",
  "figcaption",
  "img",
  "code",
  "pre",
  "hr",
  "br",
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  // No `class` on `a`/`img`/`*` — nothing in the spec calls for admins or
  // imported content to hand-author CSS classes into article body HTML;
  // dropping it removes surface area for no lost functionality.
  // `rel` must be listed here even though nothing ever hand-authors it —
  // sanitize-html's own allowedAttributes filter runs AFTER transformTags,
  // so the rel="noopener noreferrer" added below would otherwise be
  // stripped right back out and silently do nothing (caught by
  // src/lib/articles/__test__/sanitize.test.ts).
  a: ["href", "title", "rel"],
  // width/height "where known" per Req.md §18 — purely descriptive
  // (browser-side layout hint), not a styling escape hatch.
  img: ["src", "alt", "title", "width", "height"],
};

export const ARTICLE_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRIBUTES,
  allowedSchemes: ["http", "https", "mailto"],
  // Belt-and-braces on top of allowedTags: never let a script or arbitrary
  // iframe through even if the allowlist above is edited carelessly later.
  disallowedTagsMode: "discard",
  allowProtocolRelative: false,
  // Applies to every path that uses this policy (admin save AND import) —
  // stops a linked page from controlling the referring tab via
  // window.opener. Previously only the importer did this.
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
  },
};

/** Sanitizes article HTML — admin-authored or imported — before it's ever written to the database. */
export function sanitizeArticleContent(html: string): string {
  return sanitizeHtml(html ?? "", ARTICLE_SANITIZE_OPTIONS);
}