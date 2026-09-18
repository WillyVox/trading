type Props = {
  partnerSlug: string;
  href?: string;
  placement?: string; // where users click to navigate
};
export function VisitSite({ partnerSlug, href, placement }: Props) {
  const link = !partnerSlug
    ? href
    : placement
      ? `/go/${partnerSlug}?placement=${encodeURIComponent(placement)}`
      : `/go/${partnerSlug}`; // [TODO] should append our referred Id here to send to partner
  return (
    <a
      href={link}
      target="_blank"
      rel="nofollow noopener"
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
