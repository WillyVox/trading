export type ProviderDestination = {
  href: string;
  type: "affiliate" | "official";
  isAffiliate: boolean;
  providerSlug: string;
  placement: string;
};

type ResolveProviderDestinationArgs = {
  providerSlug: string;
  officialWebsite?: string | null;
  officialWebsiteVerified?: boolean;
  hasActiveAffiliate: boolean;
  placement: string;
};

function safeHttpUrl(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    // Preserve the original URL rather than normalising it with
    // URL.toString(), which would turn:
    //
    // https://example.com
    //
    // into:
    //
    // https://example.com/
    return value;
  } catch {
    return null;
  }
}

/**
 * Resolve the destination for a provider's primary outbound CTA.
 *
 * Commercial relationships affect the destination, not whether the provider
 * itself is included in Trading Guide.
 *
 * Resolution order:
 *
 * 1. Active affiliate relationship -> tracked /go/... route.
 * 2. No active affiliate -> verified official provider website.
 * 3. Otherwise -> no outbound destination.
 */
export function resolveProviderDestination({
  providerSlug,
  officialWebsite,
  officialWebsiteVerified = false,
  hasActiveAffiliate,
  placement,
}: ResolveProviderDestinationArgs): ProviderDestination | null {
  if (hasActiveAffiliate) {
    return {
      href: `/go/${encodeURIComponent(
        providerSlug
      )}?placement=${encodeURIComponent(placement)}`,
      type: "affiliate",
      isAffiliate: true,
      providerSlug,
      placement,
    };
  }

  if (!officialWebsiteVerified) {
    return null;
  }

  const safeOfficialWebsite = safeHttpUrl(officialWebsite);

  if (!safeOfficialWebsite) {
    return null;
  }

  return {
    href: safeOfficialWebsite,
    type: "official",
    isAffiliate: false,
    providerSlug,
    placement,
  };
}
