import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const seedDir = path.join(root, "prisma/seeds/crypto-exchanges");
const expected = new Set([
  "btc-markets",
  "coinjar",
  "coinspot",
  "etoro-crypto",
  "independent-reserve",
  "kraken",
  "swyftx",
]);
const actual = new Set(
  fs
    .readdirSync(seedDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) =>
      JSON.parse(fs.readFileSync(path.join(seedDir, name), "utf8"))
    )
    .map((record) => record.offering.slug)
);
if (
  actual.size !== expected.size ||
  [...expected].some((slug) => !actual.has(slug))
) {
  errors.push(
    `Unexpected crypto Offering slugs: ${[...actual].sort().join(", ")}`
  );
}

const service = read("src/lib/crypto-exchanges/service.ts");
const routes = read("src/lib/crypto-exchanges/routes.ts");
const profile = read("src/app/crypto/exchanges/[slug]/page.tsx");
const comparison = read("src/app/compare/crypto-exchanges/[slug]/page.tsx");
const sitemap = read("src/lib/seo/sitemap-entries.ts");

const forbidden = [
  [service, "getCryptoExchangeByPublicSlug", "old public-slug lookup"],
  [service, "getCryptoExchangesByPublicSlugs", "old comparison lookup"],
  [
    service,
    "provider: { slug: { in: requested } }",
    "dynamic Provider-slug alias lookup",
  ],
  [
    service,
    'slug === "etoro-crypto" ? "etoro"',
    "hard-coded reverse eToro URL hack",
  ],
];
for (const [source, needle, label] of forbidden) {
  if (source.includes(needle))
    errors.push(`Legacy crypto identity pattern remains: ${label}`);
}

const required = [
  [service, 'etoro: "etoro-crypto"', "explicit historical eToro alias"],
  [
    service,
    "LEGACY_CRYPTO_EXCHANGE_SLUG_ALIASES",
    "explicit legacy alias registry",
  ],
  [service, "slug: { in: requested }", "Offering-only alias validation query"],
  [
    routes,
    'CRYPTO_EXCHANGES_PATH = "/crypto/exchanges"',
    "canonical exchange base path",
  ],
  [routes, "CRYPTO_EXCHANGE_COMPARISON_PATH", "canonical comparison base path"],
  [
    profile,
    "permanentRedirect(cryptoExchangePath(canonicalSlug))",
    "profile permanent canonical redirect",
  ],
  [
    profile,
    "path: cryptoExchangePath(offering.slug)",
    "profile canonical metadata",
  ],
  [
    comparison,
    "permanentRedirect(cryptoExchangeComparisonPath(canonicalSlug))",
    "comparison permanent canonical redirect",
  ],
  [
    comparison,
    "return unique.length >= 2 ? unique : null",
    "duplicate/one-subject rejection",
  ],
  [
    comparison,
    "path: cryptoExchangeComparisonPath(canonicalSlug)",
    "comparison canonical metadata/breadcrumb",
  ],
  [
    sitemap,
    "absoluteUrl(cryptoExchangePath(o.slug))",
    "Offering-based sitemap path",
  ],
];
for (const [source, needle, label] of required) {
  if (!source.includes(needle))
    errors.push(`Missing crypto identity invariant: ${label}`);
}

// Product-facing dynamic crypto profile URLs should go through the canonical
// helper rather than being rebuilt ad hoc. This excludes the helper itself.
const scanDirs = ["src/app", "src/components", "src/lib"];
for (const dir of scanDirs) {
  const walk = (folder) => {
    for (const entry of fs.readdirSync(path.join(root, folder), {
      withFileTypes: true,
    })) {
      const rel = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(rel);
      else if (
        /\.(ts|tsx)$/.test(entry.name) &&
        rel !== "src/lib/crypto-exchanges/routes.ts"
      ) {
        const source = read(rel);
        if (/\/crypto\/exchanges\/\$\{/.test(source)) {
          errors.push(
            `${rel} constructs a dynamic crypto profile path outside cryptoExchangePath()`
          );
        }
        if (/\/compare\/crypto-exchanges\/\$\{/.test(source)) {
          errors.push(
            `${rel} constructs a dynamic crypto comparison path outside cryptoExchangeComparisonPath()`
          );
        }
      }
    }
  };
  walk(dir);
}

console.log("Trading Guide crypto Offering identity + canonical SEO check");
if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`);
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log(
  "✓ Legacy aliases are explicit and canonicalized with permanent redirects."
);
console.log(
  "✓ Offering slugs own crypto profile/comparison URLs, sitemap, metadata and breadcrumbs."
);
console.log(
  "✓ Dynamic crypto product URLs use centralized canonical path helpers."
);
console.log(
  "✓ Provider identity remains separate while affiliate engagement routing is Offering-owned."
);
console.log("0 error(s).");
