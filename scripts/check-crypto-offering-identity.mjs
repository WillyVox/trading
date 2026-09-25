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

const sourceFiles = [
  "src/lib/crypto-exchanges/service.ts",
  "src/lib/crypto-exchanges/comparison.ts",
  "src/app/crypto/exchanges/[slug]/page.tsx",
  "src/app/compare/crypto-exchanges/[slug]/page.tsx",
  "src/app/compare/crypto-exchanges/page.tsx",
  "src/lib/seo/sitemap-entries.ts",
  "src/lib/guides/live-evidence.ts",
  "src/lib/guides/topic-evidence.ts",
  "src/components/home/FeaturedProviders.tsx",
  "src/app/crypto/[slug]/page.tsx",
];
const source = sourceFiles.map(read).join("\n");

for (const legacy of [
  "getCryptoExchangeByPublicSlug",
  "getCryptoExchangesByPublicSlugs",
  'slug === "etoro-crypto" ? "etoro"',
]) {
  if (source.includes(legacy))
    errors.push(`Legacy crypto identity pattern remains: ${legacy}`);
}

const required = [
  ["src/lib/crypto-exchanges/service.ts", "slug: offeringSlug"],
  [
    "src/lib/crypto-exchanges/service.ts",
    "select: { id: true, slug: true, name: true }",
  ],
  ["src/lib/crypto-exchanges/comparison.ts", "slug: offering.slug"],
  [
    "src/lib/crypto-exchanges/comparison.ts",
    "providerSlug: offering.provider.slug",
  ],
  [
    "src/app/crypto/exchanges/[slug]/page.tsx",
    "permanentRedirect(`/crypto/exchanges/${canonicalSlug}`)",
  ],
  [
    "src/app/compare/crypto-exchanges/[slug]/page.tsx",
    "permanentRedirect(`${BASE_PATH}/${canonicalSlug}`)",
  ],
  ["src/lib/seo/sitemap-entries.ts", "`/crypto/exchanges/${o.slug}`"],
  ["src/lib/seo/curated-comparisons.ts", 'slugs: ["etoro-crypto", "coinspot"]'],
];
for (const [file, needle] of required) {
  if (!read(file).includes(needle))
    errors.push(`${file} is missing identity invariant: ${needle}`);
}

console.log("Trading Guide crypto Offering identity check");
if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`);
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log(
  "✓ Offering slugs are canonical across crypto profiles, comparisons, sitemap and internal links."
);
console.log(
  "✓ Provider slugs remain separate for Provider-owned affiliate/commercial lookups."
);
console.log("0 error(s).");
