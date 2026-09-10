import { providerRepository } from "@/lib/repository";

export function getProviders(opts: { page?: number; pageSize?: number } = {}) {
  return providerRepository.paginate({ orderBy: { name: "asc" }, page: opts.page, pageSize: opts.pageSize });
}

export function getProviderBySlug(slug: string) {
  return providerRepository.findBySlug(slug, {
    include: {
      facts: true,
      fees: true,
      features: true,
      sources: true,
      regulations: true,
      assets: { include: { asset: true } },
    },
  });
}

export function getProvidersForAsset(assetSlug: string) {
  return providerRepository.findMany({
    where: { assets: { some: { asset: { slug: assetSlug } } } },
    orderBy: { name: "asc" },
  });
}
