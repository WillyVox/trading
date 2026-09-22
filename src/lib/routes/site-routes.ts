import registry from "./route-registry.json";

const segment = (value: string) => encodeURIComponent(value.trim());

export const siteRoutes = {
  home: registry.roots.home,
  guides: {
    root: registry.roots.guides,
    article: (slug: string) => `${registry.roots.guides}/${segment(slug)}`,
  },
  news: {
    root: registry.roots.news,
    article: (slug: string) => `${registry.roots.news}/${segment(slug)}`,
  },
  cryptoExchanges: {
    root: registry.roots.cryptoExchanges,
    profile: (slug: string) =>
      `${registry.roots.cryptoExchanges}/${segment(slug)}`,
  },
  shareTrading: {
    root: registry.roots.shareTrading,
    profile: (slug: string) =>
      `${registry.roots.shareTrading}/${segment(slug)}`,
  },
  compare: {
    crypto: registry.roots.compareCrypto,
    cryptoPair: (slug: string) =>
      `${registry.roots.compareCrypto}/${segment(slug)}`,
    shareTrading: registry.roots.compareShareTrading,
    shareTradingPair: (slug: string) =>
      `${registry.roots.compareShareTrading}/${segment(slug)}`,
  },
  tools: {
    root: registry.roots.tools,
    tool: (slug: string) => `${registry.roots.tools}/${segment(slug)}`,
  },
} as const;

export const LEGACY_INTERNAL_ROUTES: Readonly<Record<string, string>> =
  registry.legacy;
export const INVALID_INTERNAL_PREFIXES: readonly string[] =
  registry.invalidPrefixes;
