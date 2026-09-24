export type ProviderDestination = {
  href: string;
  type: "affiliate" | "official";
  isAffiliate: boolean;
  providerSlug: string;
  placement: string;
};

/**
 * Resolve a provider's outbound destination without coupling UI components to
 * commercial state. An active affiliate relationship changes the route and
 * disclosure semantics; it never decides whether a provider is useful to readers.
 *
 * Official websites are only eligible when the record carrying that website has
 * been verified and has a verification date. A syntactically valid URL alone is
 * not enough for Trading Guide to label it an "official" destination.
 */
export function resolveProviderDestination({
  providerSlug,
  officialWebsite,
  officialWebsiteVerified = false,
  hasActiveAffiliate,
  placement,
}: {
  providerSlug: string;
  officialWebsite?: string | null;
  officialWebsiteVerified?: boolean;
  hasActiveAffiliate: boolean;
  placement: string;
}): ProviderDestination | null {
  if (hasActiveAffiliate) {
    return {
      href: `/go/${providerSlug}?placement=${encodeURIComponent(placement)}`,
      type: "affiliate",
      isAffiliate: true,
      providerSlug,
      placement,
    };
  }

  if (!officialWebsiteVerified) return null;
  const href = officialWebsite?.trim();
  if (!href) return null;

  try {
    const url = new URL(href);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  } catch {
    return null;
  }

  return {
    href,
    type: "official",
    isAffiliate: false,
    providerSlug,
    placement,
  };
}
