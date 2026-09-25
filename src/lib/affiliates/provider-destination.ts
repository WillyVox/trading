export type ProviderDestination = {
  href: string;
  type: "affiliate" | "official";
  isAffiliate: boolean;
  providerSlug: string;
  offeringSlug?: string;
  placement: string;
};

type ResolveProviderDestinationArgs = {
  providerSlug: string;
  offeringSlug?: string;
  officialWebsite?: string | null;
  hasActiveAffiliate: boolean;
  placement: string;
};

function safeHttpUrl(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

export function resolveProviderDestination({
  providerSlug,
  offeringSlug,
  officialWebsite,
  hasActiveAffiliate,
  placement,
}: ResolveProviderDestinationArgs): ProviderDestination | null {
  if (hasActiveAffiliate) {
    if (!offeringSlug) return null;
    return {
      href: `/go/${encodeURIComponent(offeringSlug)}?placement=${encodeURIComponent(placement)}`,
      type: "affiliate",
      isAffiliate: true,
      providerSlug,
      offeringSlug,
      placement,
    };
  }
  const safeOfficialWebsite = safeHttpUrl(officialWebsite);
  if (!safeOfficialWebsite) return null;
  return {
    href: safeOfficialWebsite,
    type: "official",
    isAffiliate: false,
    providerSlug,
    offeringSlug,
    placement,
  };
}
