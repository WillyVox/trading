import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";
const npm = isWindows ? "npm.cmd" : "npm";
const npx = isWindows ? "npx.cmd" : "npx";

const steps = [
  ["Prisma schema", npx, ["prisma", "validate"]],
  ["Prisma client", npx, ["prisma", "generate"]],
  ["ESLint", npm, ["run", "lint"]],
  ["TypeScript", npx, ["tsc", "--noEmit"]],
  ["Tests", npm, ["test"]],
  ["Formatting", npm, ["run", "format:check"]],
  ["Production build", npm, ["run", "build"]],
];

for (const [label, command, args] of steps) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
  });
  if (result.error) {
    console.error(`${label} could not start: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`${label} failed with exit code ${result.status}.`);
    process.exit(result.status ?? 1);
  }
}

console.log("\nAll code validation steps passed.");
