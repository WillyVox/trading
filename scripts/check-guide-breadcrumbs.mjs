import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const errors = [];
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
const detailPages = walk("src/app/guides").filter(
  (path) =>
    path.endsWith("/page.tsx") &&
    path !== "src/app/guides/page.tsx" &&
    path !== "src/app/guides/crypto/page.tsx" &&
    path !== "src/app/guides/share-trading/page.tsx"
);

for (const path of detailPages) {
  const source = readFileSync(path, "utf8");
  const isDynamic = path.includes("[slug]");
  const delegated = source.includes("ResearchGuidePage");
  if (!delegated && !source.includes("guideBreadcrumbTrail(")) {
    errors.push(`${path}: guide detail page must use guideBreadcrumbTrail().`);
  }
  if (
    source.includes('{ name: "Crypto", path: "/crypto" }') &&
    source.includes("breadcrumb")
  ) {
    errors.push(
      `${path}: category must not be inserted into a guide detail breadcrumb.`
    );
  }
}

const shared = readFileSync(
  "src/components/guide/ResearchGuidePage.tsx",
  "utf8"
);
if (!shared.includes("guideBreadcrumbTrail(config.title, config.path)")) {
  errors.push("ResearchGuidePage must use guideBreadcrumbTrail().");
}

console.log("Trading Guide guide-breadcrumb consistency check\n");
for (const error of errors) console.error(`ERROR: ${error}`);
console.log(`\n${errors.length} error(s).`);
if (errors.length) process.exit(1);
