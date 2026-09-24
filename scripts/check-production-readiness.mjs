import { existsSync, readFileSync } from "node:fs";

const errors = [];
const warnings = [];
const required = ["DATABASE_URL"];
for (const name of required) {
  if (!process.env[name]) errors.push(`${name} is not set.`);
}
if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  errors.push("AUTH_SECRET (or NEXTAUTH_SECRET) is not set.");
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

let trustMarkersRemain = false;
for (const [path, label] of [
  ["src/app/methodology/editorial-policy/page.tsx", "Editorial Policy"],
  ["src/app/methodology/comparisons/page.tsx", "Comparison Methodology"],
  ["src/app/affiliate-disclosure/page.tsx", "Affiliate Disclosure"],
]) {
  if (!existsSync(path)) errors.push(`${label} page is missing.`);
  else {
    const text = readFileSync(path, "utf8");
    if (/Content status:\s*DRAFT|not legal-reviewed|needs? sign-off before.*production/i.test(text)) {
      trustMarkersRemain = true;
      errors.push(`${label} still contains unresolved draft/approval markers.`);
    }
  }
}
if (process.env.TRUST_CONTENT_APPROVED !== "true") {
  errors.push(
    "TRUST_CONTENT_APPROVED=true is required after the Editorial Policy, Comparison Methodology and Affiliate Disclosure have been reconciled with the production implementation and internally approved."
  );
}
if (process.env.TRUST_CONTENT_APPROVED === "true" && trustMarkersRemain) {
  errors.push(
    "TRUST_CONTENT_APPROVED=true conflicts with unresolved draft/approval markers in trust pages."
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
