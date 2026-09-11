export type VideoProvider = "youtube" | "vimeo";

const EMBED_SRC: Record<VideoProvider, (videoId: string) => string> = {
  // youtube-nocookie.com avoids setting tracking cookies until the visitor
  // actually plays the video — a small, free privacy improvement over the
  // default youtube.com embed domain.
  youtube: (videoId) => `https://www.youtube-nocookie.com/embed/${videoId}`,
  vimeo: (videoId) => `https://player.vimeo.com/video/${videoId}`,
};

/**
 * Renders an approved video embed safely — Req.md §19: "Do not store
 * arbitrary iframe HTML... Represent the video safely... Render through
 * our own component." The `src` is always built here from a validated
 * provider + videoId (see parseVideoArgs in renderer.tsx); this component
 * never accepts or trusts a raw URL/iframe string from article content.
 */
export function ArticleVideo({
  provider,
  videoId,
  caption,
}: {
  provider: VideoProvider;
  videoId: string;
  caption?: string;
}) {
  const src = EMBED_SRC[provider](videoId);

  return (
    <figure className="my-8">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-navy-dark">
        <iframe
          src={src}
          title={caption ?? `${provider === "youtube" ? "YouTube" : "Vimeo"} video`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {caption && <figcaption className="mt-2 text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}