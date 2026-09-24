#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const TODAY = new Date(
  process.env.PROVIDER_AUDIT_DATE || new Date().toISOString().slice(0, 10)
);
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

function walk(value, visit) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit);
    return;
  }
  if (!value || typeof value !== "object") return;
  visit(value);
  for (const child of Object.values(value)) walk(child, visit);
}

function parseDate(value) {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function inspectFile(kind, file) {
  const full = path.join(ROOT, file);
  const seed = JSON.parse(fs.readFileSync(full, "utf8"));
  const provider = seed.provider ?? {};
  const name = provider.name ?? path.basename(file, ".json");
  const slug = provider.slug ?? path.basename(file, ".json");
  const website = provider.website ?? null;
  const status = provider.verificationStatus ?? "UNVERIFIED";
  const lastVerifiedAt = parseDate(provider.lastVerifiedAt);
  const lastVerifiedRaw = lastVerifiedAt ? iso(lastVerifiedAt) : null;
  const urls = [];
  const evidenceUrls = [];
  const verifiedDates = [];
  const reviewDates = [];
  let verifiedClaims = 0;
  let unverifiedClaims = 0;

  walk(seed, (object) => {
    for (const [key, value] of Object.entries(object)) {
      if (
        ["sourceUrl", "url", "website"].includes(key) &&
        typeof value === "string"
      )
        urls.push(value);
      if (key === "sourceUrl" && typeof value === "string")
        evidenceUrls.push(value);
      if (key === "verifiedAt") {
        const date = parseDate(value);
        if (date) verifiedDates.push(date);
      }
      if (key === "reviewDueAt") {
        const date = parseDate(value);
        if (date) reviewDates.push(date);
      }
      if (key === "verificationStatus" && value === "VERIFIED")
        verifiedClaims += 1;
      if (key === "verificationStatus" && value === "UNVERIFIED")
        unverifiedClaims += 1;
    }
  });

  const errors = [];
  const warnings = [];

  if (!website) warnings.push("missing official website");
  else if (!safeUrl(website))
    errors.push("official website is not a valid HTTP(S) URL");

  for (const url of urls) {
    if (!safeUrl(url)) errors.push(`invalid evidence URL: ${url}`);
  }

  if (status === "VERIFIED") {
    if (!lastVerifiedAt)
      errors.push("provider is VERIFIED but lastVerifiedAt is missing");
    if (evidenceUrls.length === 0)
      errors.push("provider is VERIFIED but has no sourceUrl evidence");
  }

  if (lastVerifiedAt && daysOld(lastVerifiedAt) > STALE_DAYS) {
    errors.push(
      `provider verification is ${daysOld(lastVerifiedAt)} days old (> ${STALE_DAYS})`
    );
  }

  const overdue = reviewDates.filter((d) => d < TODAY);
  if (overdue.length)
    errors.push(`${overdue.length} evidence review date(s) overdue`);

  const staleEvidence = verifiedDates.filter((d) => daysOld(d) > STALE_DAYS);
  if (staleEvidence.length)
    warnings.push(
      `${staleEvidence.length} verified evidence item(s) older than ${STALE_DAYS} days`
    );

  const affiliateEvidence = evidenceUrls.filter((u) =>
    /[?&](affiliate|ref|referral|aff)=/i.test(u)
  );
  if (affiliateEvidence.length)
    warnings.push(
      `${affiliateEvidence.length} research source URL(s) contain affiliate/referral parameters`
    );

  // Exclude the provider-level status itself when checking whether a VERIFIED
  // provider contains unresolved child claims.
  const childUnverifiedClaims = Math.max(
    0,
    unverifiedClaims - (status === "UNVERIFIED" ? 1 : 0)
  );
  const childVerifiedClaims = Math.max(
    0,
    verifiedClaims - (status === "VERIFIED" ? 1 : 0)
  );
  if (status === "UNVERIFIED" && childVerifiedClaims > 0) {
    warnings.push(
      "provider remains UNVERIFIED although some individual claims are verified (allowed; review unresolved fields before upgrading)"
    );
  }
  if (status === "VERIFIED" && childUnverifiedClaims > 0) {
    errors.push(
      `provider is VERIFIED but ${childUnverifiedClaims} seeded claim(s) remain UNVERIFIED`
    );
  }

  const effective = errors.length ? "STALE" : status;
  return {
    kind,
    file,
    name,
    slug,
    status,
    effective,
    website,
    lastVerifiedRaw,
    evidenceUrls,
    verifiedClaims,
    unverifiedClaims,
    errors,
    warnings,
  };
}

const results = [];
for (const [kind, dir] of catalogs) {
  const abs = path.join(ROOT, dir);
  for (const entry of fs
    .readdirSync(abs)
    .filter((f) => f.endsWith(".json"))
    .sort()) {
    results.push(inspectFile(kind, path.join(dir, entry)));
  }
}

const errors = results.flatMap((r) =>
  r.errors.map((message) => ({ ...r, message }))
);
const warnings = results.flatMap((r) =>
  r.warnings.map((message) => ({ ...r, message }))
);

console.log(
  `Provider verification audit — ${iso(TODAY)} (stale after ${STALE_DAYS} days)`
);
for (const r of results) {
  const mark = r.errors.length ? "✗" : r.warnings.length ? "△" : "✓";
  console.log(
    `${mark} ${r.name} [${r.kind}] — ${r.status}${r.errors.length ? " → STALE" : ""}`
  );
  for (const e of r.errors) console.log(`    ERROR: ${e}`);
  for (const w of r.warnings) console.log(`    WARN:  ${w}`);
}
console.log(
  `\n${results.length} providers checked; ${errors.length} error(s); ${warnings.length} warning(s).`
);

const rows = results.map((r) => {
  const issues =
    [
      ...r.errors.map((x) => `ERROR: ${x}`),
      ...r.warnings.map((x) => `WARN: ${x}`),
    ].join("<br>") || "—";
  const safeBadge =
    r.status === "VERIFIED" && r.errors.length === 0 ? "YES" : "NO";
  return `| ${r.name} | ${r.kind} | ${r.status} | ${r.lastVerifiedRaw ?? "—"} | ${r.evidenceUrls.length} | ${safeBadge} | ${issues} |`;
});
const report = `# Provider Verification Launch Report\n\nGenerated: ${iso(TODAY)}  \nFreshness threshold: ${STALE_DAYS} days\n\nThis report audits the seeded provider catalog. It does **not** make affiliate status a condition of research verification, and provider verification does **not** control whether a valid official website can be shown as \`Visit site\`.\n\n## Summary\n\n- Providers checked: ${results.length}\n- Blocking verification errors: ${errors.length}\n- Warnings requiring review: ${warnings.length}\n- Safe to display \`Data verified\`: ${results.filter((r) => r.status === "VERIFIED" && !r.errors.length).length}\n\n## Catalog\n\n| Provider | Catalog | Seed status | Last provider verification | Evidence URLs | Safe verified badge | Outstanding items |\n| --- | --- | --- | --- | ---: | --- | --- |\n${rows.join("\n")}\n\n## Gate rules\n\nA seeded provider marked \`VERIFIED\` fails the launch gate when its provider-level verification date is missing/stale, it has no source evidence, a seeded claim remains \`UNVERIFIED\`, an evidence URL is malformed, or a review-due date has passed. \`UNVERIFIED\` is an acceptable research state and does not fail merely because information is unknown.\n\nWarnings flag mixed verification states, old evidence that has not yet crossed a specific review date, and research evidence URLs carrying affiliate/referral parameters.\n\n## Manual primary-source review still required\n\nBefore upgrading any provider to \`VERIFIED\`, confirm the material comparison fields against primary sources: official website/entity, ASIC or AUSTRAC/VASP status where applicable, fees, CHESS/custody, markets/assets, deposits/withdrawals, and the source date. Commercial affiliate status is reviewed separately and must never be inferred from research data.\n`;
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, report);
console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);

if (errors.length) process.exitCode = 1;
