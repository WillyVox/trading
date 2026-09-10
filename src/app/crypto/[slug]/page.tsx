import { notFound } from "next/navigation";

/**
 * No CryptoAsset data model exists yet (see Phase 0 SEO audit, §S — this
 * needs a product decision before it's built). Previously this route
 * rendered a 200 OK placeholder for any slug, which is an indexable
 * soft-404 (see audit §B/§C). Until real per-asset content exists, every
 * slug here genuinely 404s rather than faking a page.
 */
export default async function CryptoAssetPage() {
  notFound();
}
