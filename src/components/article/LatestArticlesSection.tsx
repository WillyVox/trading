import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatCategoryLabel } from '@/lib/articles/content';
import type { LatestArticleSummary } from '@/lib/content/latest';

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[parts.length - 1][0] ?? '')).toUpperCase();
}

function Byline({
  author,
  publishedAt,
}: {
  author: string | null;
  publishedAt: Date | string | null;
}) {
  if (!author && !publishedAt) return null;
  return (
    <div className="border-border mt-auto flex items-center gap-2 border-t border-dashed pt-3">
      {author && (
        <span className="bg-navy text-gold-soft flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
          {initials(author)}
        </span>
      )}
      <span className="text-muted text-xs">
        {author && <span className="text-text font-semibold">{author}</span>}
        {author && publishedAt && ' · '}
        {publishedAt && formatDate(publishedAt)}
      </span>
    </div>
  );
}

/**
 * "Latest in <category>" module: a larger featured item (most recent) plus
 * a compact side rail for the next few, collapsing to one stacked column
 * on narrow screens. Returns null when there's nothing to show, rather
 * than rendering empty thumbnail boxes -- same "no synthetic placeholders"
 * convention as /news and /guides use for their own empty states.
 */
export function LatestArticlesSection({
  title,
  viewAllHref,
  viewAllLabel = 'View all',
  items,
}: {
  title: string;
  viewAllHref: string;
  viewAllLabel?: string;
  items: LatestArticleSummary[];
}) {
  if (items.length === 0) return null;

  const [featured, ...rest] = items;
  const sideItems = rest.slice(0, 3);

  return (
    <section className="mt-14" aria-labelledby="latest-articles-heading">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="latest-articles-heading"
          className="font-display text-navy text-2xl font-bold"
        >
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="text-navy text-sm font-bold hover:underline"
        >
          {viewAllLabel} →
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Link
          href={featured.href}
          className="group border-border bg-panel hover:border-gold-soft flex flex-col overflow-hidden rounded-2xl border transition-colors"
        >
          <div className="bg-navy aspect-video w-full shrink-0 overflow-hidden">
            {featured.featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featured.featuredImage}
                alt={featured.featuredImageAlt ?? ''}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="from-navy to-navy-dark flex h-full w-full items-center justify-center bg-gradient-to-br">
                <span className="font-display text-gold-soft/70 text-lg font-bold">
                  Trading Guide
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2.5 p-5">
            {featured.category && (
              <Badge tone="gold">
                {formatCategoryLabel(featured.category)}
              </Badge>
            )}
            <h3 className="font-display text-lg leading-snug font-bold">
              {featured.title}
            </h3>
            {featured.excerpt && (
              <p className="text-muted line-clamp-3 text-sm">
                {featured.excerpt}
              </p>
            )}
            <Byline
              author={featured.author}
              publishedAt={featured.publishedAt}
            />
          </div>
        </Link>

        <div className="flex flex-col gap-3">
          {sideItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group border-border bg-panel hover:border-gold-soft flex items-center gap-3 rounded-2xl border p-2.5 transition-colors"
            >
              <div className="bg-navy aspect-square w-16 shrink-0 overflow-hidden rounded-xl">
                {item.featuredImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.featuredImage}
                    alt={item.featuredImageAlt ?? ''}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="from-navy to-navy-dark h-full w-full bg-gradient-to-br" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="line-clamp-2 text-sm leading-snug font-bold">
                  {item.title}
                </h4>
                {(item.author || item.publishedAt) && (
                  <p className="text-muted mt-1 truncate text-xs">
                    {item.author && (
                      <span className="text-text font-semibold">
                        {item.author}
                      </span>
                    )}
                    {item.author && item.publishedAt && ' · '}
                    {item.publishedAt && formatDate(item.publishedAt)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
