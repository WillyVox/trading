import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatCategoryLabel } from '@/lib/articles/content';

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface ArticleCardProps {
  href: string;
  title: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  category?: string | null;
  author?: string | null;
  publishedAt?: Date | string | null;
  readingMinutes?: number | null;
}

/**
 * Thumbnail card for a guide/news grid listing (see /guides). Generic
 * across article type — News can adopt this unchanged if it gets the same
 * grid+filter treatment later.
 *
 * `featuredImage` is a plain admin-typed URL with no domain allowlist,
 * same as `Provider.logo` (see ProviderLogo.tsx) — rendered as a plain
 * <img>, not next/image, for the same reason: next/image would need every
 * possible image host added to next.config's remotePatterns, which
 * doesn't scale to an open-ended, admin-managed field. Falls back to a
 * plain navy/gold tile when unset, which is what most cards render today
 * since existing content mostly has no featured image yet.
 */
export function ArticleCard({
  href,
  title,
  excerpt,
  featuredImage,
  featuredImageAlt,
  category,
  author,
  publishedAt,
  readingMinutes,
}: ArticleCardProps) {
  const metaParts = [
    author ? `By ${author}` : null,
    publishedAt ? formatDate(publishedAt) : null,
    readingMinutes ? `${readingMinutes} min read` : null,
  ].filter(Boolean);

  return (
    <Link
      href={href}
      className="group border-border bg-panel hover:border-gold-soft flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-colors"
    >
      <div className="bg-navy aspect-video w-full shrink-0 overflow-hidden">
        {featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={featuredImage}
            alt={featuredImageAlt ?? ''}
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

      <div className="flex flex-1 flex-col p-5">
        {category && (
          <div className="mb-2">
            <Badge tone="gold">{formatCategoryLabel(category)}</Badge>
          </div>
        )}
        <h3 className="font-display text-navy text-lg leading-snug font-bold">
          {title}
        </h3>
        {excerpt && (
          <p className="text-muted mt-2 line-clamp-3 text-sm">{excerpt}</p>
        )}

        {metaParts.length > 0 && (
          <div className="border-border text-muted mt-auto flex flex-wrap gap-x-2 gap-y-1 border-t pt-3 text-xs">
            {metaParts.map((part, i) => (
              <span key={i}>
                {part}
                {i < metaParts.length - 1 && (
                  <span className="text-border ml-2">·</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
