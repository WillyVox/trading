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
 * disclosure semantics; it never decides whether a provider is linkable.
 *
 * Official websites are the non-commercial fallback. If neither an active
 * affiliate relationship nor a verified/stored official website exists, we
 * fail closed and render no outbound CTA rather than guessing a URL.
 */
export function resolveProviderDestination({
  providerSlug,
  officialWebsite,
  hasActiveAffiliate,
  placement,
}: {
  providerSlug: string;
  officialWebsite?: string | null;
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
