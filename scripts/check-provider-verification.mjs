#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const TODAY = new Date(process.env.PROVIDER_AUDIT_DATE || new Date().toISOString().slice(0, 10));
const STALE_DAYS = Number(process.env.PROVIDER_STALE_DAYS || 90);
const REPORT_PATH = path.join(ROOT, "docs", "provider-verification-report.md");
const catalogs = [
  ["Share trading", "prisma/seeds/share-trading-platforms"],
  ["Crypto exchange", "prisma/seeds/crypto-exchanges"],
];

const daysOld = (date) => Math.floor((TODAY - date) / 86400000);
const iso = (date) => date.toISOString().slice(0, 10);
const safeUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

function firstMatch(text, re) {
  return text.match(re)?.[1] ?? null;
}

function objectLiteralSection(text, key) {
  const marker = new RegExp(String.raw`\b${key}\s*:\s*\{`).exec(text);
  if (!marker) return "";
  const start = text.indexOf("{", marker.index);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "\"" || ch === "'" || ch === "`") { quote = ch; continue; }
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(start + 1, i);
    }
  }
  return text.slice(start + 1);
}

function namedConstObjectSection(text, name) {
  const marker = new RegExp(String.raw`(?:export\s+)?const\s+${name}\s*=\s*\{`).exec(text);
  if (!marker) return "";
  const synthetic = `provider: ${text.slice(text.indexOf("{", marker.index))}`;
  return objectLiteralSection(synthetic, "provider");
}

function inspectFile(kind, file) {
  const full = path.join(ROOT, file);
  let text = fs.readFileSync(full, "utf8");
  let providerSection = objectLiteralSection(text, "provider");
  if (!providerSection) {
    const providerRef = firstMatch(text, /\bprovider\s*:\s*([A-Z][A-Z0-9_]*)/);
    if (providerRef) {
      const importMatch = text.match(new RegExp(String.raw`import\s*\{[^}]*\b${providerRef}\b[^}]*\}\s*from\s*["']([^"']+)["']`));
      if (importMatch) {
        const imported = path.resolve(path.dirname(full), `${importMatch[1]}.ts`);
        if (fs.existsSync(imported)) {
          const importedText = fs.readFileSync(imported, "utf8");
          providerSection = namedConstObjectSection(importedText, providerRef) || namedConstObjectSection(importedText, "ETORO_AU_PROVIDER_BASE");
          const baseRef = firstMatch(providerSection, /\.\.\.([A-Z][A-Z0-9_]*)/);
          if (baseRef) providerSection = `${namedConstObjectSection(importedText, baseRef)}\n${providerSection}`;
          for (const m of importedText.matchAll(/const\s+([A-Z][A-Z0-9_]*)\s*=\s*new Date\(["'](\d{4}-\d{2}-\d{2})["']\)/g)) {
            text += `\nconst ${m[1]} = new Date("${m[2]}");`;
          }
        }
      }
    }
  }
  const dateConstants = new Map([...text.matchAll(/const\s+([A-Z][A-Z0-9_]*)\s*=\s*new Date\(["'](\d{4}-\d{2}-\d{2})["']\)/g)].map((m) => [m[1], m[2]]));
  const name = firstMatch(providerSection, /\bname\s*:\s*["'`]([^"'`]+)["'`]/) ?? path.basename(file, ".ts");
  const slug = firstMatch(providerSection, /\bslug\s*:\s*["'`]([^"'`]+)["'`]/) ?? path.basename(file, ".ts");
  const website = firstMatch(providerSection, /\bwebsite\s*:\s*["'`]([^"'`]+)["'`]/);
  const status = firstMatch(providerSection, /\bverificationStatus\s*:\s*VerificationStatus\.(VERIFIED|UNVERIFIED|STALE)/) ?? "UNVERIFIED";
  const directLastVerified = firstMatch(providerSection, /\blastVerifiedAt\s*:\s*new Date\(["'](\d{4}-\d{2}-\d{2})["']\)/);
  const lastVerifiedSymbol = firstMatch(providerSection, /\blastVerifiedAt\s*:\s*([A-Z][A-Z0-9_]*)/);
  const lastVerifiedRaw = directLastVerified ?? (lastVerifiedSymbol ? dateConstants.get(lastVerifiedSymbol) ?? null : null);
  const lastVerifiedAt = lastVerifiedRaw ? new Date(`${lastVerifiedRaw}T00:00:00Z`) : null;
  const urls = [...text.matchAll(/\b(?:sourceUrl|url|website)\s*:\s*["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
  const evidenceUrls = [...text.matchAll(/\bsourceUrl\s*:\s*["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
  const verifiedDates = [...text.matchAll(/\bverifiedAt\s*:\s*new Date\(["'](\d{4}-\d{2}-\d{2})["']\)/g)].map((m) => new Date(`${m[1]}T00:00:00Z`));
  const reviewDates = [...text.matchAll(/\breviewDueAt\s*:\s*new Date\(["'](\d{4}-\d{2}-\d{2})["']\)/g)].map((m) => new Date(`${m[1]}T00:00:00Z`));
  const verifiedClaims = (text.match(/verificationStatus\s*:\s*VerificationStatus\.VERIFIED/g) || []).length;
  const unverifiedClaims = (text.match(/verificationStatus\s*:\s*VerificationStatus\.UNVERIFIED/g) || []).length;

  const errors = [];
  const warnings = [];

  if (!website) warnings.push("missing official website");
  else if (!safeUrl(website)) errors.push("official website is not a valid HTTP(S) URL");

  for (const url of urls) {
    if (!safeUrl(url)) errors.push(`invalid evidence URL: ${url}`);
  }

  if (status === "VERIFIED") {
    if (!lastVerifiedAt) errors.push("provider is VERIFIED but lastVerifiedAt is missing");
    if (evidenceUrls.length === 0) errors.push("provider is VERIFIED but has no sourceUrl evidence");
  }

  if (lastVerifiedAt && daysOld(lastVerifiedAt) > STALE_DAYS) {
    errors.push(`provider verification is ${daysOld(lastVerifiedAt)} days old (> ${STALE_DAYS})`);
  }

  const overdue = reviewDates.filter((d) => d < TODAY);
  if (overdue.length) errors.push(`${overdue.length} evidence review date(s) overdue`);

  const staleEvidence = verifiedDates.filter((d) => daysOld(d) > STALE_DAYS);
  if (staleEvidence.length) warnings.push(`${staleEvidence.length} verified evidence item(s) older than ${STALE_DAYS} days`);

  const affiliateEvidence = evidenceUrls.filter((u) => /[?&](affiliate|ref|referral|aff)=/i.test(u));
  if (affiliateEvidence.length) warnings.push(`${affiliateEvidence.length} research source URL(s) contain affiliate/referral parameters`);

  if (status === "UNVERIFIED" && verifiedClaims > 0) {
    warnings.push("provider remains UNVERIFIED although some individual claims are verified (allowed; review unresolved fields before upgrading)");
  }
  if (status === "VERIFIED" && unverifiedClaims > 0) {
    errors.push(`provider is VERIFIED but ${unverifiedClaims} seeded claim(s) remain UNVERIFIED`);
  }

  const effective = errors.length ? "STALE" : status;
  return { kind, file, name, slug, status, effective, website, lastVerifiedRaw, evidenceUrls, verifiedClaims, unverifiedClaims, errors, warnings };
}

const results = [];
for (const [kind, dir] of catalogs) {
  const abs = path.join(ROOT, dir);
  for (const entry of fs.readdirSync(abs).filter((f) => f.endsWith(".ts") && f !== "index.ts").sort()) {
    results.push(inspectFile(kind, path.join(dir, entry)));
  }
}

const errors = results.flatMap((r) => r.errors.map((message) => ({ ...r, message })));
const warnings = results.flatMap((r) => r.warnings.map((message) => ({ ...r, message })));

console.log(`Provider verification audit — ${iso(TODAY)} (stale after ${STALE_DAYS} days)`);
for (const r of results) {
  const mark = r.errors.length ? "✗" : r.warnings.length ? "△" : "✓";
  console.log(`${mark} ${r.name} [${r.kind}] — ${r.status}${r.errors.length ? " → STALE" : ""}`);
  for (const e of r.errors) console.log(`    ERROR: ${e}`);
  for (const w of r.warnings) console.log(`    WARN:  ${w}`);
}
console.log(`\n${results.length} providers checked; ${errors.length} error(s); ${warnings.length} warning(s).`);

const rows = results.map((r) => {
  const issues = [...r.errors.map((x) => `ERROR: ${x}`), ...r.warnings.map((x) => `WARN: ${x}`)].join("<br>") || "—";
  const safeBadge = r.status === "VERIFIED" && r.errors.length === 0 ? "YES" : "NO";
  return `| ${r.name} | ${r.kind} | ${r.status} | ${r.lastVerifiedRaw ?? "—"} | ${r.evidenceUrls.length} | ${safeBadge} | ${issues} |`;
});
const report = `# Provider Verification Launch Report\n\nGenerated: ${iso(TODAY)}  \nFreshness threshold: ${STALE_DAYS} days\n\nThis report audits the seeded provider catalog. It does **not** make affiliate status a condition of research verification, and provider verification does **not** control whether a valid official website can be shown as \`Visit site\`.\n\n## Summary\n\n- Providers checked: ${results.length}\n- Blocking verification errors: ${errors.length}\n- Warnings requiring review: ${warnings.length}\n- Safe to display \`Data verified\`: ${results.filter((r) => r.status === "VERIFIED" && !r.errors.length).length}\n\n## Catalog\n\n| Provider | Catalog | Seed status | Last provider verification | Evidence URLs | Safe verified badge | Outstanding items |\n| --- | --- | --- | --- | ---: | --- | --- |\n${rows.join("\n")}\n\n## Gate rules\n\nA seeded provider marked \`VERIFIED\` fails the launch gate when its provider-level verification date is missing/stale, it has no source evidence, a seeded claim remains \`UNVERIFIED\`, an evidence URL is malformed, or a review-due date has passed. \`UNVERIFIED\` is an acceptable research state and does not fail merely because information is unknown.\n\nWarnings flag mixed verification states, old evidence that has not yet crossed a specific review date, and research evidence URLs carrying affiliate/referral parameters.\n\n## Manual primary-source review still required\n\nBefore upgrading any provider to \`VERIFIED\`, confirm the material comparison fields against primary sources: official website/entity, ASIC or AUSTRAC/VASP status where applicable, fees, CHESS/custody, markets/assets, deposits/withdrawals, and the source date. Commercial affiliate status is reviewed separately and must never be inferred from research data.\n`;
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, report);
console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);

if (errors.length) process.exitCode = 1;
