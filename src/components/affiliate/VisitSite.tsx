type Props = {
  /**
   * Pass this ONLY when an active AffiliateLink exists for the provider.
   * It routes the click through /go/[partner] (recorded, sponsored). Without
   * it the button links straight to `href` -- a plain outbound link with no
   * commercial relationship, so it must not go through /go (which 404s for
   * any slug that has no active link).
   */
  partnerSlug?: string;
  /** The provider's own website, used when there is no active affiliate link. */
  href?: string;
  placement?: string; // where users click to navigate
};

/**
 * Referral/tracking parameters belong in AffiliateLink.approvedUrl, not here:
 * /go/[partner] redirects to that stored URL, so nothing has to be appended
 * to the link at render time.
 */
export function VisitSite({ partnerSlug, href, placement }: Props) {
  const isAffiliate = Boolean(partnerSlug);
  const target = isAffiliate
    ? placement
      ? `/go/${partnerSlug}?placement=${encodeURIComponent(placement)}`
      : `/go/${partnerSlug}`
    : href;

  // No active affiliate link and no website on record: render nothing
  // rather than a dead button.
  if (!target) return null;

  return (
    <a
      href={target}
      target="_blank"
      // "sponsored" only where money may change hands; "noopener" alone
      // (not "noreferrer") keeps the Referer that /go/[partner] reads for
      // click attribution.
      rel={isAffiliate ? "sponsored noopener" : "noopener"}
      className="bg-navy text-background hover:bg-navy-dark inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap"
    >
      Visit site
      <svg
        width="11"
        height="11"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 2h6v6M10 2 2 10"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
