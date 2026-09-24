#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogs = [
  ["crypto assets", "prisma/seeds/crypto-assets"],
  ["crypto exchanges", "prisma/seeds/crypto-exchanges"],
  ["share trading platforms", "prisma/seeds/share-trading-platforms"],
  ["affiliate links", "prisma/seeds/affiliate-links"],
  ["markets", "prisma/seeds/markets"],
];

let errors = 0;
let records = 0;
for (const [label, relativeDir] of catalogs) {
  const dir = path.join(root, relativeDir);
  const indexText = fs.readFileSync(path.join(dir, "index.ts"), "utf8");
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .sort();
  for (const file of files) {
    records += 1;
    const full = path.join(dir, file);
    try {
      const value = JSON.parse(fs.readFileSync(full, "utf8"));
      if (!value || Array.isArray(value) || typeof value !== "object") {
        console.error(
          `ERROR ${relativeDir}/${file}: each JSON file must contain exactly one object record.`
        );
        errors += 1;
      }
    } catch (error) {
      console.error(
        `ERROR ${relativeDir}/${file}: invalid JSON (${error.message}).`
      );
      errors += 1;
    }
    if (!indexText.includes(`./${file}`)) {
      console.error(
        `ERROR ${relativeDir}/${file}: not imported by ${relativeDir}/index.ts.`
      );
      errors += 1;
    }
  }
  console.log(`✓ ${label}: ${files.length} JSON record(s)`);
}

console.log(`\n${records} JSON seed record(s); ${errors} error(s).`);
if (errors) process.exitCode = 1;
