import { existsSync, readFileSync } from "node:fs";

const errors = [];
const pathsFile = "src/lib/learning/paths.ts";
const progressFile = "src/lib/learning/progress.ts";
const sitemapFile = "src/lib/seo/sitemap-entries.ts";

for (const file of [
  pathsFile,
  progressFile,
  "src/components/learning/LearningJourney.tsx",
  "src/components/learning/LearningPathOverviewClient.tsx",
]) {
  if (!existsSync(file)) errors.push(`${file} missing`);
}

if (existsSync(pathsFile)) {
  const source = readFileSync(pathsFile, "utf8");
  const hrefs = [...source.matchAll(/href:\s*"([^\"]+)"/g)].map(
    (match) => match[1]
  );
  const lessonHrefs = [
    ...source.matchAll(
      /\{\s*id:\s*"[^\"]+",\s*title:\s*"[^\"]+",\s*href:\s*"([^\"]+)"/g
    ),
  ].map((match) => match[1]);
  if (new Set(lessonHrefs).size !== lessonHrefs.length)
    errors.push("lesson URLs must be unique across learning paths");

  const routeExists = (href) => {
    const parts = href.split("/").filter(Boolean);
    const direct = `src/app/${parts.join("/")}/page.tsx`;
    if (existsSync(direct)) return true;
    if (parts[0] === "guides" && parts.length === 2) {
      return ["(share-trading)", "(crypto)"].some((group) =>
        existsSync(`src/app/guides/${group}/${parts[1]}/page.tsx`)
      );
    }
    return false;
  };
  for (const href of hrefs)
    if (!routeExists(href))
      errors.push(`configured learning route missing: ${href}`);
}

if (existsSync(progressFile)) {
  const source = readFileSync(progressFile, "utf8");
  for (const token of [
    "localStorage",
    "completedLessonIds",
    "lastVisitedLessonId",
    "version: 1",
  ]) {
    if (!source.includes(token))
      errors.push(`progress implementation missing ${token}`);
  }
}

if (existsSync(sitemapFile)) {
  const sitemap = readFileSync(sitemapFile, "utf8");
  for (const href of ["/learn/share-trading", "/learn/crypto"]) {
    if (!sitemap.includes(href))
      errors.push(`sitemap missing learning hub ${href}`);
  }
}

console.log("Trading Guide learning-journey release check");
for (const error of errors) console.error(`ERROR: ${error}`);
console.log(`${errors.length} error(s).`);
if (errors.length) process.exit(1);
