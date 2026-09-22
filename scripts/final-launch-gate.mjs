import { spawnSync } from "node:child_process";
const steps = [
  ["Code validation", "npm", ["run", "validate:code"]],
  ["SEO release check", "npm", ["run", "check:seo:release"]],
  ["Canonical internal links", "npm", ["run", "check:internal-links"]],
  ["Production readiness", "npm", ["run", "check:production"]],
];
for (const [label, cmd, args] of steps) {
  console.log(`\n=== ${label} ===`);
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (r.status !== 0) {
    console.error(`\nFINAL LAUNCH GATE: BLOCKED at ${label}.`);
    process.exit(r.status ?? 1);
  }
}
console.log("\nFINAL LAUNCH GATE: automated checks passed.");
console.log(
  "Manual/external launch evidence must also be completed: database backup/restore, WAF verification, CSP workflow verification, legal approval, responsive/accessibility QA, and admin publishing smoke tests."
);
