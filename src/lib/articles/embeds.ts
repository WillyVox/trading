/**
 * Parses `{{type:args}}` embed markers out of already-sanitized article
 * HTML — see docs/IMPLEMENTATION-PLAN.md Article CMS Block 3 and Req.md
 * §20–§23. This module only *splits* content into segments; it makes no
 * decision about whether a given `type` is supported or how its `argsRaw`
 * should be interpreted — that's the renderer's job (src/lib/articles/renderer.tsx),
 * kept separate so Block 4 can register new embed types without touching
 * this parser.
 *
 * Marker syntax matches the examples in Req.md §21/§57, e.g.:
 *   {{video:youtube:dQw4w9WgXcQ:Optional caption}}
 *   {{provider-comparison:coinspot,independent-reserve,kraken}}
 *
 * Markers are expected to appear as standalone text between block elements
 * (not nested inside a tag's attributes), which is how every example in
 * Req.md writes them and how the admin textarea naturally produces them.
 */

export type ArticleContentSegment =
  | { kind: "html"; html: string }
  | { kind: "embed"; type: string; argsRaw: string };

const EMBED_MARKER_RE = /\{\{\s*([a-z0-9][a-z0-9-]*)\s*(?::([^}]*))?\s*\}\}/gi;

export function parseEmbedMarkers(html: string): ArticleContentSegment[] {
  const segments: ArticleContentSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  EMBED_MARKER_RE.lastIndex = 0;
  while ((match = EMBED_MARKER_RE.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: "html", html: html.slice(lastIndex, match.index) });
    }
    segments.push({ kind: "embed", type: match[1].toLowerCase(), argsRaw: (match[2] ?? "").trim() });
    lastIndex = EMBED_MARKER_RE.lastIndex;
  }
  if (lastIndex < html.length) {
    segments.push({ kind: "html", html: html.slice(lastIndex) });
  }
  return segments;
}