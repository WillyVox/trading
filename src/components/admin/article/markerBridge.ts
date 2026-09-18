/**
 * Bridges the existing `{{video:provider:videoId:caption}}` text-marker
 * syntax (see src/lib/articles/embeds.ts and renderer.tsx) with the Tiptap
 * editor, which needs a real, selectable/deletable DOM node rather than
 * raw text sitting inside a paragraph.
 *
 * Nothing downstream changes because of this file: sanitize.ts, embeds.ts
 * and renderer.tsx are untouched. The editor still only ever produces the
 * exact same `{{video:...}}` marker text an admin typing it by hand would
 * have produced today — this module just lets the editor represent that
 * marker as an editable block *while the admin is working in the editor*,
 * and converts it back to marker text the instant content leaves the
 * editor (on every keystroke, via onUpdate — see ArticleRichEditor.tsx).
 *
 * The custom `<video-embed>` tag below only ever exists transiently inside
 * the editor's own in-memory document. It is never sent to
 * sanitizeArticleContent() and never reaches the database or the public
 * renderer — sanitize.ts doesn't even allowlist the tag, so if this
 * bridge ever failed to run, the tag would simply be stripped rather than
 * silently leaking into published HTML.
 */

const VIDEO_MARKER_RE = /\{\{\s*video\s*:([^}]*)\}\}/gi;
export const VIDEO_EMBED_TAG_NAME = "video-embed";

interface VideoMarkerArgs {
  provider: string;
  videoId: string;
  caption: string;
}

function parseVideoMarkerArgs(argsRaw: string): VideoMarkerArgs | null {
  const [provider, videoId, ...rest] = argsRaw.split(":").map((s) => s.trim());
  if (!provider || !videoId) return null;
  return { provider, videoId, caption: rest.join(":").trim() };
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function unescapeAttr(s: string): string {
  return s.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
}

/**
 * Run on HTML loaded FROM `Article.content`, before handing it to
 * `editor.commands.setContent(...)`. Turns `{{video:youtube:abc:Caption}}`
 * into `<video-embed provider="youtube" video-id="abc" caption="Caption">`
 * so VideoEmbed's `parseHTML` (see nodes/VideoEmbed.tsx) can pick it up as
 * a real node. A marker that doesn't parse (matches Block 4's "invalid
 * marker" philosophy) is left as plain text rather than dropped, same as
 * an editor would see raw text if they typed it wrong.
 */
export function markersToEditorHtml(html: string): string {
  return html.replace(VIDEO_MARKER_RE, (full, argsRaw: string) => {
    const parsed = parseVideoMarkerArgs(argsRaw);
    if (!parsed) return full;
    const { provider, videoId, caption } = parsed;
    return `<${VIDEO_EMBED_TAG_NAME} provider="${provider}" video-id="${videoId}" caption="${escapeAttr(caption)}"></${VIDEO_EMBED_TAG_NAME}>`;
  });
}

const OPEN_TAG_RE = new RegExp(
  `<${VIDEO_EMBED_TAG_NAME}\\s+([^>]*)>\\s*</${VIDEO_EMBED_TAG_NAME}>`,
  "gi"
);
const ATTR_RE = /([a-z-]+)="([^"]*)"/gi;

/**
 * Run on `editor.getHTML()` output before it goes anywhere near
 * `sanitizeArticleContent()` or the server action. Converts
 * `<video-embed ...>` back into the canonical `{{video:...}}` marker text.
 * Attribute order isn't assumed — each attribute is parsed by name so this
 * survives however the browser/Tiptap happens to serialize the tag.
 */
export function editorHtmlToMarkers(html: string): string {
  return html.replace(OPEN_TAG_RE, (full, attrsRaw: string) => {
    const attrs: Record<string, string> = {};
    ATTR_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = ATTR_RE.exec(attrsRaw))) {
      attrs[m[1]] = unescapeAttr(m[2]);
    }
    if (!attrs.provider || !attrs["video-id"]) return "";
    const caption = attrs.caption?.trim();
    return caption
      ? `{{video:${attrs.provider}:${attrs["video-id"]}:${caption}}}`
      : `{{video:${attrs.provider}:${attrs["video-id"]}}}`;
  });
}
