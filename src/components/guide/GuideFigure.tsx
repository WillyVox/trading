import type { ReactNode } from 'react';

/**
 * Wraps a topic-relevant visual (inline SVG, or a raster <img>) inside
 * article body copy. Deliberately used instead of a plain <img> so every
 * in-article visual gets a real, keyword-relevant caption — good for
 * accessibility and for image/SEO context, and consistent with this
 * project's "no undocumented visuals" convention (see PageHero, which
 * makes the same tradeoff for the hero itself).
 */
export function GuideFigure({
  children,
  caption,
}: {
  children: ReactNode;
  caption: string;
}) {
  return (
    <figure className="not-prose border-border bg-panel my-8 overflow-hidden rounded-2xl border">
      <div className="bg-navy">{children}</div>
      <figcaption className="border-border bg-panel-secondary text-muted border-t px-4 py-2.5 text-center text-xs">
        {caption}
      </figcaption>
    </figure>
  );
}
