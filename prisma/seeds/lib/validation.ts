import { OfferingType } from "@prisma/client";

type CatalogSeed = {
  provider: {
    slug: string;
    name?: string;
  };
  offering: {
    slug: string;
    offeringType: OfferingType;
  };
};

/**
 * Provider slugs are intentionally reusable across offerings: one legal/brand
 * provider can expose multiple comparable products (e.g. eToro share trading
 * and eToro crypto). Offering slugs, however, must remain globally unique.
 *
 * When a provider slug is reused, require the provider name to stay identical
 * so two unrelated entities cannot be merged accidentally by Provider.upsert.
 */
export function validateCatalogSlugs(
  crypto: CatalogSeed[],
  shares: CatalogSeed[]
) {
  const providerNamesBySlug = new Map<string, string | undefined>();
  const offeringSlugs = new Set<string>();

  for (const seed of [...crypto, ...shares]) {
    const p = seed.provider?.slug;
    const o = seed.offering?.slug;

    if (!p || !o) {
      throw new Error(
        "Every catalog seed requires provider.slug and offering.slug."
      );
    }

    const existingProviderName = providerNamesBySlug.get(p);
    if (
      providerNamesBySlug.has(p) &&
      existingProviderName &&
      seed.provider.name &&
      existingProviderName !== seed.provider.name
    ) {
      throw new Error(
        `Provider slug "${p}" is reused with conflicting names: "${existingProviderName}" and "${seed.provider.name}".`
      );
    }
    providerNamesBySlug.set(p, existingProviderName ?? seed.provider.name);

    // Provider and Offering slugs are independent identities. If the clearest
    // Offering identity is the same as its Provider, keep the same value rather
    // than manufacturing a redundant "-exchange" suffix.
    if (o === `${p}-exchange`) {
      throw new Error(
        `Offering slug "${o}" redundantly suffixes Provider slug "${p}". Use "${p}" unless the suffix is part of the product's real identity.`
      );
    }

    if (offeringSlugs.has(o)) {
      throw new Error(`Duplicate offering slug: ${o}`);
    }
    offeringSlugs.add(o);
  }

  for (const seed of crypto) {
    if (seed.offering.offeringType !== OfferingType.CRYPTO_EXCHANGE) {
      throw new Error(
        `${seed.offering.slug}: crypto exchange must use OfferingType.CRYPTO_EXCHANGE.`
      );
    }
  }

  for (const seed of shares) {
    if (seed.offering.offeringType !== OfferingType.SHARE_TRADING) {
      throw new Error(
        `${seed.offering.slug}: share platform must use OfferingType.SHARE_TRADING.`
      );
    }
  }
}
