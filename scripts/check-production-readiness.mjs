import { existsSync, readFileSync, readdirSync } from "node:fs";

const errors = [];
const warnings = [];
const required = ["DATABASE_URL", "DIRECT_URL"];
for (const name of required) {
  if (!process.env[name]) errors.push(`${name} is not set.`);
}
const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
if (!authSecret) {
  errors.push("AUTH_SECRET (or NEXTAUTH_SECRET) is not set.");
} else if (authSecret.length < 32) {
  errors.push(
    "AUTH_SECRET (or NEXTAUTH_SECRET) must be at least 32 characters."
  );
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL;
if (!siteUrl) errors.push("NEXT_PUBLIC_SITE_URL (or NEXTAUTH_URL) is not set.");
else {
  try {
    const url = new URL(siteUrl);
    if (url.protocol !== "https:")
      errors.push("Production site URL must use HTTPS.");
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      errors.push("Production site URL must not point to localhost.");
    }
  } catch {
    errors.push("Production site URL is not a valid absolute URL.");
  }
}

const migrationsRoot = "prisma/migrations";
if (!existsSync(migrationsRoot)) {
  errors.push(
    "prisma/migrations is missing; production cannot safely use prisma migrate deploy."
  );
} else {
  const migrationDirs = readdirSync(migrationsRoot, {
    withFileTypes: true,
  }).filter((entry) => entry.isDirectory());
  if (migrationDirs.length === 0) {
    errors.push(
      "No committed Prisma migration directories were found. Establish/baseline migration history before production deployment; do not fabricate it against the live database."
    );
  }
}

let legalMarkersRemain = false;
for (const [path, label] of [
  ["src/app/privacy/page.tsx", "Privacy Policy"],
  ["src/app/terms/page.tsx", "Terms of Use"],
]) {
  if (!existsSync(path)) errors.push(`${label} page is missing.`);
  else {
    const text = readFileSync(path, "utf8");
    if (
      /working draft|LEGAL REVIEW REQUIRED|DRAFT ONLY|do not ship this section as-is/i.test(
        text
      )
    ) {
      legalMarkersRemain = true;
      errors.push(`${label} still contains draft/legal-review markers.`);
    }
  }
}
if (process.env.LEGAL_CONTENT_APPROVED !== "true") {
  errors.push(
    "LEGAL_CONTENT_APPROVED=true is required only after the final Terms/Privacy wording and deployment-specific privacy details have actually been approved."
  );
}
if (process.env.LEGAL_CONTENT_APPROVED === "true" && legalMarkersRemain) {
  errors.push(
    "LEGAL_CONTENT_APPROVED=true conflicts with draft/legal-review markers still present in the legal pages."
  );
}

if (process.env.TRUST_CONTENT_APPROVED !== "true") {
  errors.push(
    "TRUST_CONTENT_APPROVED=true is required after Methodology, Editorial Policy, Affiliate Disclosure and How We Get Paid have been reviewed against the deployed implementation."
  );
}

if (process.env.EDGE_RATE_LIMITING_CONFIGURED !== "true") {
  errors.push(
    "EDGE_RATE_LIMITING_CONFIGURED=true is required after deploying and verifying the host/WAF rules in docs/EDGE-RATE-LIMITING.md."
  );
}

if (process.env.CSP_ENFORCED_AND_VERIFIED !== "true") {
  errors.push(
    "CSP_ENFORCED_AND_VERIFIED=true is required after reviewing report-only violations and verifying the enforcing CSP in staging/production."
  );
}

console.log("Trading Guide production-readiness check\n");
for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
if (errors.length || warnings.length) process.exit(1);
