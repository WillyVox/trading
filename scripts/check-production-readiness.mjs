import { existsSync, readFileSync } from "node:fs";

const errors = [];
const warnings = [];
const required = ["DATABASE_URL"];
for (const name of required)
  if (!process.env[name]) errors.push(`${name} is not set.`);
if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET)
  errors.push("AUTH_SECRET (or NEXTAUTH_SECRET) is not set.");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL;
if (!siteUrl) errors.push("NEXT_PUBLIC_SITE_URL (or NEXTAUTH_URL) is not set.");
else {
  try {
    const url = new URL(siteUrl);
    if (url.protocol !== "https:")
      errors.push("Production site URL must use HTTPS.");
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1")
      errors.push("Production site URL must not point to localhost.");
  } catch {
    errors.push("Production site URL is not a valid absolute URL.");
  }
}

for (const [path, label] of [
  ["src/app/privacy/page.tsx", "Privacy Policy"],
  ["src/app/terms/page.tsx", "Terms of Use"],
]) {
  if (!existsSync(path)) errors.push(`${label} page is missing.`);
  else {
    const text = readFileSync(path, "utf8");
    if (/working draft|LEGAL REVIEW REQUIRED|DRAFT ONLY/i.test(text))
      warnings.push(`${label} still contains draft/legal-review markers.`);
  }
}

if (existsSync("docs/SECURITY.md")) {
  const security = readFileSync("docs/SECURITY.md", "utf8");
  if (/Report-Only/i.test(security))
    warnings.push(
      "CSP is still Report-Only; review production violation logs before enforcing it."
    );
}

// Edge/WAF rate limiting cannot be proven from application source because the
// control lives at the CDN/hosting layer. Production deployments must set this
// attestation only after the rules in docs/EDGE-RATE-LIMITING.md are deployed
// and verified with a 429 response.
if (process.env.EDGE_RATE_LIMITING_CONFIGURED !== "true") {
  errors.push(
    "EDGE_RATE_LIMITING_CONFIGURED=true is required after deploying and verifying the host/WAF rules in docs/EDGE-RATE-LIMITING.md."
  );
}

console.log("Trading Guide production-readiness check\n");
for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
if (errors.length) process.exit(1);
