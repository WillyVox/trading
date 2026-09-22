import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
const root = "prisma/migrations";
const patterns = [
  ["DROP TABLE", /\bDROP\s+TABLE\b/i],
  ["DROP COLUMN", /\bDROP\s+COLUMN\b/i],
  ["DROP TYPE", /\bDROP\s+TYPE\b/i],
  ["TRUNCATE", /\bTRUNCATE\b/i],
  ["DELETE FROM", /\bDELETE\s+FROM\b/i],
];
const findings = [];
for (const entry of readdirSync(root).sort()) {
  const dir = join(root, entry);
  if (!statSync(dir).isDirectory()) continue;
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql"))) {
    const path = join(dir, file);
    const sql = readFileSync(path, "utf8");
    const labels = patterns
      .filter(([, rx]) => rx.test(sql))
      .map(([label]) => label);
    if (labels.length) findings.push({ path, labels });
  }
}
console.log("Trading Guide migration safety review\n");
if (!findings.length) {
  console.log("No destructive SQL patterns detected.");
  process.exit(0);
}
for (const f of findings) {
  console.log(`REVIEW: ${f.path}`);
  console.log(`        ${f.labels.join(", ")}`);
}
console.log(
  `\n${findings.length} migration file(s) contain destructive SQL patterns. Review target database state, backup/restore readiness and data implications before production deployment.`
);
