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

    return value;
  } catch {
    return null;
  }
}

export function resolveProviderDestination({
  providerSlug,
  officialWebsite,
  hasActiveAffiliate,
  placement,
}: ResolveProviderDestinationArgs): ProviderDestination | null {
  // Commercial relationship takes precedence when it is genuinely active.
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

  // No affiliate relationship:
  // link directly to the provider's official website.
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
