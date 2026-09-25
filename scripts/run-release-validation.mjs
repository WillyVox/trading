import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";
const npm = isWindows ? "npm.cmd" : "npm";

for (const [label, args] of [
  ["Code validation", ["run", "validate:code"]],
  ["Provider verification", ["run", "check:providers"]],
  ["Crypto Offering identity", ["run", "check:crypto-identity"]],
  ["Production readiness", ["run", "check:production"]],
]) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(npm, args, { stdio: "inherit", env: process.env });
  if (result.error) {
    console.error(`${label} could not start: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("\nTrading Guide release validation passed.");
