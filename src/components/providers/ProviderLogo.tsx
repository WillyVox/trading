import clsx from 'clsx';

const SIZE_CLASSES = {
  sm: 'h-10 w-10 rounded-lg',
  md: 'h-14 w-14 rounded-xl',
  lg: 'h-20 w-20 rounded-2xl',
} as const;

interface ProviderLogoProps {
  logo?: string | null;
  name: string;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

/**
 * `Provider.logo` (prisma/schema.prisma) is a plain URL string with no
 * domain allowlist behind it — admins can point it at any exchange's own
 * asset host. Rendered as a plain <img>, not next/image: next/image would
 * need every provider's logo host added to next.config.mjs's
 * `images.remotePatterns` (currently empty), which doesn't scale to an
 * open-ended, admin-managed list of exchanges without either maintaining
 * that allowlist by hand or wildcard-allowing all remote hosts through
 * the image optimizer. Logos are small and mostly static, so the
 * optimizer's main benefit (responsive resizing) barely applies here.
 *
 * Falls back to a navy/gold initials tile when `logo` is unset — every
 * provider in the current seed has no logo yet, so this fallback is what
 * the listing actually renders today, not an edge case.
 */
export function ProviderLogo({
  logo,
  name,
  size = 'md',
  className,
}: ProviderLogoProps) {
  const sizeClass = SIZE_CLASSES[size];

  if (!logo) {
    return (
      <div
        className={clsx(
          'border-border bg-navy font-display text-gold-soft flex shrink-0 items-center justify-center border font-bold',
          sizeClass,
          className
        )}
        aria-hidden
      >
        {initials(name)}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'border-border flex shrink-0 items-center justify-center overflow-hidden border bg-white p-2',
        sizeClass,
        className
      )}
    >
      {/* Decorative: the provider's name is always rendered as visible
          text right next to this logo, so an announced alt would just be
          a duplicate — same convention as a wordmark next to a heading. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt={name}
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
