import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const seedRoot = path.join(root, "prisma", "seeds");
for (const file of walk(seedRoot).filter((file) => file.endsWith(".json"))) {
  const value = JSON.parse(fs.readFileSync(file, "utf8"));
  const records = Array.isArray(value) ? value : [value];
  for (const record of records) {
    for (const feature of record.features ?? []) {
      if (Object.prototype.hasOwnProperty.call(feature, "reviewDueAt")) {
        failures.push(
          `${path.relative(root, file)}: OfferingFeature seed contains unsupported reviewDueAt`
        );
      }
    }
  }
}

const compareValue = fs.readFileSync(
  path.join(root, "src/components/compare/CompareValue.tsx"),
  "utf8"
);
if (
  !compareValue.includes("Not verified") ||
  !compareValue.includes("Not supported")
) {
  failures.push(
    "CompareValue must distinguish Not verified from Not supported"
  );
}

const crypto = fs.readFileSync(
  path.join(root, "src/lib/crypto-exchanges/comparison.ts"),
  "utf8"
);
if (!crypto.includes("PRIMARY_CRYPTO_FEATURES,\n    true")) {
  failures.push(
    "Primary crypto comparison rows must remain visible when evidence is missing"
  );
}

if (failures.length) {
  console.error(
    "Comparison/data-integrity check failed:\n" +
      failures.map((f) => `- ${f}`).join("\n")
  );
  process.exit(1);
}
console.log("Comparison/data-integrity check passed.");
