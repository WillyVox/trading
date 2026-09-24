import {
  resolveProviderDestination,
  type ProviderDestination,
} from "@/lib/affiliates/provider-destination";

type Props = {
  providerSlug: string;
  officialWebsite?: string | null;
  hasActiveAffiliate?: boolean;
  placement: string;
  destination?: ProviderDestination | null;
  className?: string;
};

/**
 * Primary outbound provider action. Commercial status changes the destination
 * and link relationship, never whether the provider is useful to readers.
 */
export function VisitSite({
  providerSlug,
  officialWebsite,
  hasActiveAffiliate = false,
  placement,
  destination: suppliedDestination,
  className = "",
}: Props) {
  const destination =
    suppliedDestination ??
    resolveProviderDestination({
      providerSlug,
      officialWebsite,
      hasActiveAffiliate,
      placement,
    });

  if (!destination) return null;

  return (
    <a
      href={destination.href}
      target="_blank"
      rel={destination.isAffiliate ? "sponsored noopener" : "noopener"}
      data-provider-outbound="true"
      data-provider-slug={destination.providerSlug}
      data-destination-type={destination.type}
      data-placement={destination.placement}
      className={`bg-navy text-background hover:bg-navy-dark focus-visible:ring-gold inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold whitespace-nowrap shadow-sm transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}
    >
      Visit site
      <svg
        width="12"
        height="12"
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
