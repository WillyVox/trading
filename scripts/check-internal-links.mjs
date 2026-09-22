import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const registry = JSON.parse(
  readFileSync("src/lib/routes/route-registry.json", "utf8")
);
const roots = registry.roots;
const legacy = registry.legacy;
const invalidPrefixes = registry.invalidPrefixes;
const scanRoots = [
  "publish_article",
  "src/app/guides",
  "src/components/guide",
  "src/lib/guides",
  "src/lib/seo",
  "src/lib/nav",
];
const extensions = new Set([".ts", ".tsx", ".md", ".txt"]);
const findings = [];

function filesUnder(path) {
  if (!existsSync(path)) return [];
  const out = [];
  for (const entry of readdirSync(path)) {
    const child = join(path, entry);
    const st = statSync(child);
    if (st.isDirectory()) out.push(...filesUnder(child));
    else if (extensions.has(extname(child))) out.push(child);
  }
  return out;
}
function add(file, href, kind, suggestion) {
  findings.push({ file: relative(".", file), href, kind, suggestion });
}
function inspect(file, href) {
  const value = href.trim();
  if (!value || /^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(value))
    return;
  if (!value.startsWith("/")) {
    const rooted = `/${value.replace(/^\.\//, "")}`;
    add(file, value, "RELATIVE", legacy[rooted] ?? rooted);
    return;
  }
  const path = value.split(/[?#]/, 1)[0];
  if (legacy[path]) {
    add(file, value, "LEGACY", legacy[path]);
    return;
  }
  const bad = invalidPrefixes.find((prefix) => path.startsWith(prefix));
  if (bad) {
    const slug = path.slice(bad.length);
    add(
      file,
      value,
      "INVALID_NAMESPACE",
      `${bad.includes("news") ? roots.news : roots.guides}/${slug}`
    );
  }
}

for (const root of scanRoots)
  for (const file of filesUnder(root)) {
    const text = readFileSync(file, "utf8");
    // HTML/JSX href attributes and simple href object/string properties used by navigation configs.
    for (const match of text.matchAll(/\bhref\s*=\s*["']([^"']+)["']/g))
      inspect(file, match[1]);
    for (const match of text.matchAll(/\bhref\s*:\s*["']([^"']+)["']/g))
      inspect(file, match[1]);
    // Catch stale route literals in article-generation datasets/instructions even when not inside href.
    if (file.startsWith("publish_article")) {
      for (const oldPath of Object.keys(legacy))
        if (text.includes(oldPath))
          add(file, oldPath, "LEGACY_TEXT", legacy[oldPath]);
      for (const prefix of invalidPrefixes)
        if (text.includes(prefix))
          add(
            file,
            prefix,
            "INVALID_NAMESPACE_TEXT",
            prefix.includes("news") ? roots.news : roots.guides
          );
    }
  }

// De-duplicate same file/href/kind finding.
const unique = [
  ...new Map(
    findings.map((f) => [`${f.file}|${f.href}|${f.kind}`, f])
  ).values(),
];
console.log("Trading Guide canonical internal-link check\n");
for (const f of unique)
  console.error(
    `ERROR ${f.kind}: ${f.file}\n  ${f.href}${f.suggestion ? `\n  use ${f.suggestion}` : ""}`
  );
console.log(`\n${unique.length} error(s).`);
if (unique.length) process.exit(1);
