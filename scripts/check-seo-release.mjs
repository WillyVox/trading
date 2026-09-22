import { existsSync, readFileSync } from "node:fs";
const errors = [];
const mustExist = [
  "src/app/robots.ts",
  "src/app/sitemap.ts",
  "src/app/not-found.tsx",
  "src/lib/seo/config.ts",
];
for (const p of mustExist) if (!existsSync(p)) errors.push(`${p} missing`);
const robots = readFileSync("src/app/robots.ts", "utf8");
for (const path of ["/admin", "/go/", "/login", "/api/"])
  if (!robots.includes(`\"${path}\"`))
    errors.push(`robots does not disallow ${path}`);
if (!robots.includes("sitemap:"))
  errors.push("robots does not advertise sitemap");
const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
if (!sitemap.includes('dynamic = "force-dynamic"'))
  errors.push("sitemap is not runtime/dynamic");
if (!sitemap.includes("safeDatabaseQuery"))
  errors.push("sitemap lacks DB-outage fallback boundary");
const config = readFileSync("src/lib/seo/config.ts", "utf8");
if (!config.includes("NEXT_PUBLIC_SITE_URL"))
  errors.push("SEO config lacks canonical production URL source");
if (config.includes('sameAs: ["'))
  errors.push("SEO config appears to fabricate social profiles");
console.log("Trading Guide SEO release check");
for (const e of errors) console.error(`ERROR: ${e}`);
console.log(`${errors.length} error(s).`);
if (errors.length) process.exit(1);
