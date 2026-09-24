import { existsSync, readFileSync } from "node:fs";

const errors = [];
const warnings = [];

const gitignore = existsSync(".gitignore")
  ? readFileSync(".gitignore", "utf8")
  : "";
for (const pattern of [".env", ".env.*", "!.env.example", ".vercel"]) {
  if (!gitignore.split(/\r?\n/).includes(pattern)) {
    errors.push(`.gitignore must contain ${pattern}`);
  }
}

const publicSecretPatterns = [
  /NEXT_PUBLIC_.*(?:SECRET|PASSWORD|TOKEN|DATABASE_URL|DIRECT_URL|PRIVATE_KEY)/i,
];

for (const path of [".env.example"]) {
  if (!existsSync(path)) continue;
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const key = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=/)?.[1];
    if (!key) continue;
    if (publicSecretPatterns.some((pattern) => pattern.test(key))) {
      errors.push(
        `${path}:${index + 1} exposes a secret-like variable with NEXT_PUBLIC_: ${key}`
      );
    }
  }
}

console.log("Trading Guide environment-safety check\n");
for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
if (errors.length) process.exit(1);
