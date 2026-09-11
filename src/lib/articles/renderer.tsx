import type { ReactNode } from "react";
import { sanitizeArticleContent } from "@/lib/articles/sanitize";
import { extractHeadings, estimateReadingMinutes, wrapTables, type Heading } from "@/lib/articles/content";
import { parseEmbedMarkers } from "@/lib/articles/embeds";
import { ArticleVideo, type VideoProvider } from "@/components/article/ArticleVideo";
import { EmbedPlaceholder } from "@/components/article/EmbedPlaceHolder";

export interface RenderedArticleContent {
  content: ReactNode;
  headings: Heading[];
  readingMinutes: number;
}

export interface RenderArticleContentOptions {
  /**
   * "public" (default): an embed marker that isn't recognized or doesn't
   * validate renders nothing — a visitor never sees a broken/half-finished
   * block. "preview": the same marker renders a visible admin-only notice
   * instead, so an editor can see exactly what will (or won't) appear
   * before publishing. See EmbedPlaceholder.
   */
  context?: "public" | "preview";
}

const VIDEO_PROVIDERS = new Set<VideoProvider>(["youtube", "vimeo"]);
const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{4,32}$/;

function parseVideoArgs(argsRaw: string): { provider: VideoProvider; videoId: string; caption?: string } | null {
  const firstColon = argsRaw.indexOf(":");
  if (firstColon === -1) return null;

  const providerRaw = argsRaw.slice(0, firstColon).trim().toLowerCase();
  if (!VIDEO_PROVIDERS.has(providerRaw as VideoProvider)) return null;
  const provider = providerRaw as VideoProvider;

  const rest = argsRaw.slice(firstColon + 1);
  const secondColon = rest.indexOf(":");
  const videoId = (secondColon === -1 ? rest : rest.slice(0, secondColon)).trim();
  const caption = secondColon === -1 ? undefined : rest.slice(secondColon + 1).trim() || undefined;

  if (!VIDEO_ID_PATTERN.test(videoId)) return null;
  return { provider, videoId, caption };
}

/**
 * The one rendering pipeline for article HTML — used identically by public
 * Guide pages, public News pages, and admin preview (Req.md §23: "avoid
 * having public and admin preview render differently"). See
 * docs/IMPLEMENTATION-PLAN.md Article CMS Block 3.
 *
 * Steps, in order:
 *  1. Re-sanitize with the shared policy (src/lib/articles/sanitize.ts).
 *     Content is already sanitized at write time in actions.ts and the
 *     importer, but re-sanitizing here is cheap and idempotent, and means
 *     this function is safe to call on content that reached the database
 *     through any path — not just the ones that currently sanitize on
 *     write. Req.md §17 asks for one policy applied everywhere, not "trust
 *     write-time sanitization and hope nothing else ever writes to this
 *     column."
 *  2. Inject stable heading ids (content.ts, unchanged from Blocks 1/2) so
 *     table-of-contents links keep working.
 *  3. Wrap <table> elements so a wide comparison-style table can't break
 *     mobile layout (Req.md §31/§60).
 *  4. Split the result on {{type:args}} embed markers and render each
 *     segment — sanitized HTML via dangerouslySetInnerHTML (the one place
 *     article body HTML reaches the DOM), embeds via typed components.
 *
 * Embeds: only `video` (YouTube/Vimeo) is implemented in this block — see
 * src/lib/articles/embeds.ts for the marker-parsing mechanism. Every other
 * marker type (provider-comparison, provider-card, affiliate-cta, etc. —
 * Block 4) is intentionally inert on public pages: it renders nothing
 * rather than crashing, and shows an EmbedPlaceholder only when
 * `context: "preview"`. This lets editors draft embed markers into DRAFT
 * content today without anything breaking or leaking unfinished
 * functionality to visitors.
 */
export function renderArticleContent(
  rawHtml: string,
  options: RenderArticleContentOptions = {}
): RenderedArticleContent {
  const context = options.context ?? "public";

  const sanitized = sanitizeArticleContent(rawHtml ?? "");
  const readingMinutes = estimateReadingMinutes(sanitized);
  const { html: withHeadingIds, headings } = extractHeadings(sanitized);
  const wrapped = wrapTables(withHeadingIds);
  const segments = parseEmbedMarkers(wrapped);

  const nodes: ReactNode[] = segments.map((segment, i) => {
    if (segment.kind === "html") {
      if (!segment.html.trim()) return null;
      return (
        // eslint-disable-next-line react/no-danger
        <div key={`html-${i}`} dangerouslySetInnerHTML={{ __html: segment.html }} />
      );
    }

    if (segment.type === "video") {
      const video = parseVideoArgs(segment.argsRaw);
      if (video) {
        return (
          <ArticleVideo key={`embed-${i}`} provider={video.provider} videoId={video.videoId} caption={video.caption} />
        );
      }
      if (context === "preview") {
        return <EmbedPlaceholder key={`embed-${i}`} type={segment.type} argsRaw={segment.argsRaw} invalid />;
      }
      return null;
    }

    // Unknown/future embed type — Block 4 will register real renderers for
    // these (provider-comparison, provider-card, provider-fees,
    // affiliate-cta). Until then: inert on public pages, visible in preview.
    if (context === "preview") {
      return <EmbedPlaceholder key={`embed-${i}`} type={segment.type} argsRaw={segment.argsRaw} />;
    }
    return null;
  });

  return { content: <>{nodes}</>, headings, readingMinutes };
}