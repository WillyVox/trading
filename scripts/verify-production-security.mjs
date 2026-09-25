const base = process.env.NEXT_PUBLIC_SITE_URL;
if (!base) {
  console.error(
    "NEXT_PUBLIC_SITE_URL is required, e.g. https://tradingguide.com.au"
  );
  process.exit(1);
}
const origin = new URL(base).origin;
const res = await fetch(origin, { redirect: "manual" });
const errors = [];
const required = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
};
for (const [name, expected] of Object.entries(required)) {
  const value = res.headers.get(name);
  if (!value || !value.toLowerCase().includes(expected.toLowerCase()))
    errors.push(`${name}: expected ${expected}, got ${value ?? "missing"}`);
}
if (!res.headers.get("strict-transport-security"))
  errors.push("strict-transport-security is missing");
const csp = res.headers.get("content-security-policy");
if (!csp) errors.push("enforcing content-security-policy is missing");
else {
  for (const directive of [
    "default-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ]) {
    if (!csp.includes(directive)) errors.push(`CSP missing: ${directive}`);
  }
}
const health = await fetch(`${origin}/api/health`, { redirect: "manual" });
if (health.status >= 500) errors.push(`/api/health returned ${health.status}`);
console.log(`Security verification: ${origin}`);
console.log(`Home status: ${res.status}; health status: ${health.status}`);
if (errors.length) {
  for (const e of errors) console.error(`ERROR: ${e}`);
  process.exit(1);
}
console.log("PASS: enforcing CSP and required response headers observed.");
console.log(
  "NOTE: this does not prove WAF rate limiting. Verify the edge rules separately before attesting EDGE_RATE_LIMITING_CONFIGURED=true."
);
