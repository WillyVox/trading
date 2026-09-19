import { OfferingType } from "@prisma/client";

export function validateCatalogSlugs(crypto: any[], shares: any[]) {
  const providerSlugs = new Set<string>();
  const offeringSlugs = new Set<string>();
  for (const seed of [...crypto, ...shares]) {
    const p = seed.provider?.slug;
    const o = seed.offering?.slug;
    if (!p || !o)
      throw new Error(
        "Every catalog seed requires provider.slug and offering.slug."
      );
    if (providerSlugs.has(p)) throw new Error(`Duplicate provider slug: ${p}`);
    if (offeringSlugs.has(o)) throw new Error(`Duplicate offering slug: ${o}`);
    providerSlugs.add(p);
    offeringSlugs.add(o);
  }
  for (const seed of crypto) {
    if (seed.offering.offeringType !== OfferingType.CRYPTO_EXCHANGE)
      throw new Error(
        `${seed.offering.slug}: crypto exchange must use OfferingType.CRYPTO_EXCHANGE.`
      );
  }
  for (const seed of shares) {
    if (seed.offering.offeringType !== OfferingType.SHARE_TRADING)
      throw new Error(
        `${seed.offering.slug}: share platform must use OfferingType.SHARE_TRADING.`
      );
  }
}
