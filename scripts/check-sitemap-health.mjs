#!/usr/bin/env node

const DEFAULT_SITEMAP =
  process.env.SITEMAP_URL || "http://localhost:3000/sitemap.xml";
const sitemapUrl = process.argv[2] || DEFAULT_SITEMAP;
const CONCURRENCY = Number(process.env.SITEMAP_CHECK_CONCURRENCY || 8);
const TIMEOUT_MS = Number(process.env.SITEMAP_CHECK_TIMEOUT_MS || 15000);
const SLOW_MS = Number(process.env.SITEMAP_CHECK_SLOW_MS || 3000);
const STRICT_WARNINGS = process.env.SITEMAP_CHECK_STRICT_WARNINGS === "true";

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) =>
    decodeXml(match[1].trim())
  );
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "TradingGuide-SitemapHealthChecker/1.0",
        ...options.headers,
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
    return url.toString();
  } catch {
    return value;
  }
}

function getMetaContent(html, name) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const nameMatch = tag.match(/\bname=["']([^"']+)["']/i);
    if (nameMatch?.[1]?.toLowerCase() !== name.toLowerCase()) continue;
    return tag.match(/\bcontent=["']([^"']*)["']/i)?.[1]?.trim() || "";
  }
  return "";
}

function getCanonical(html) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const rel = tag.match(/\brel=["']([^"']+)["']/i)?.[1] || "";
    if (!rel.toLowerCase().split(/\s+/).includes("canonical")) continue;
    return tag.match(/\bhref=["']([^"']+)["']/i)?.[1]?.trim() || "";
  }
  return "";
}

function getTitle(html) {
  return (
    html
      .match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
      ?.replace(/\s+/g, " ")
      .trim() || ""
  );
}

function countH1(html) {
  return (html.match(/<h1\b[^>]*>/gi) || []).length;
}

function inspectHtml(html, requestedUrl) {
  const errors = [];
  const warnings = [];
  const title = getTitle(html);
  const description = getMetaContent(html, "description");
  const robots = getMetaContent(html, "robots").toLowerCase();
  const canonical = getCanonical(html);
  const h1Count = countH1(html);

  if (!title) errors.push("missing <title>");
  if (!description) warnings.push("missing meta description");
  if (/(^|[,\s])noindex([,\s]|$)/i.test(robots)) errors.push("page is noindex");
  if (!canonical) {
    errors.push("missing canonical");
  } else {
    try {
      const resolvedCanonical = new URL(canonical, requestedUrl).toString();
      if (normalizeUrl(resolvedCanonical) !== normalizeUrl(requestedUrl)) {
        errors.push(`canonical mismatch → ${resolvedCanonical}`);
      }
    } catch {
      errors.push(`invalid canonical → ${canonical}`);
    }
  }
  if (h1Count === 0) errors.push("missing H1");
  if (h1Count > 1) warnings.push(`${h1Count} H1 elements`);

  return { errors, warnings, title, description, canonical, h1Count };
}

async function checkUrl(url) {
  const startedAt = Date.now();
  try {
    const response = await fetchWithTimeout(url);
    const duration = Date.now() - startedAt;
    const finalUrl = response.url;
    const redirected = normalizeUrl(finalUrl) !== normalizeUrl(url);
    const contentType = response.headers.get("content-type") || "";
    const errors = [];
    const warnings = [];

    if (!response.ok) errors.push(`HTTP ${response.status}`);
    if (redirected) warnings.push(`redirected → ${finalUrl}`);
    if (duration >= SLOW_MS) warnings.push(`slow response (${duration}ms)`);

    let htmlInspection = null;
    if (response.ok) {
      if (!contentType.toLowerCase().includes("text/html")) {
        errors.push(
          `expected HTML, got ${contentType || "unknown content type"}`
        );
      } else {
        const html = await response.text();
        htmlInspection = inspectHtml(html, url);
        errors.push(...htmlInspection.errors);
        warnings.push(...htmlInspection.warnings);
      }
    }

    return {
      url,
      status: response.status,
      finalUrl,
      duration,
      errors,
      warnings,
      htmlInspection,
    };
  } catch (error) {
    return {
      url,
      status: null,
      finalUrl: null,
      duration: Date.now() - startedAt,
      errors: [error instanceof Error ? error.message : String(error)],
      warnings: [],
      htmlInspection: null,
    };
  }
}

async function runWithConcurrency(items, worker, concurrency) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function runner() {
    while (true) {
      const index = nextIndex++;
      if (index >= items.length) return;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, runner)
  );
  return results;
}

async function main() {
  console.log(`\nTrading Guide sitemap health check`);
  console.log(`Sitemap: ${sitemapUrl}\n`);

  let sitemapResponse;
  try {
    sitemapResponse = await fetchWithTimeout(sitemapUrl);
  } catch (error) {
    console.error(
      `ERROR: Could not fetch sitemap: ${error instanceof Error ? error.message : error}`
    );
    process.exit(1);
  }
  if (!sitemapResponse.ok) {
    console.error(`ERROR: Sitemap returned HTTP ${sitemapResponse.status}`);
    process.exit(1);
  }

  const contentType = sitemapResponse.headers.get("content-type") || "";
  if (!contentType.includes("xml") && !contentType.includes("text/plain")) {
    console.warn(`WARN: Sitemap content type is ${contentType || "unknown"}`);
  }

  const urls = [...new Set(extractLocs(await sitemapResponse.text()))];
  if (!urls.length) {
    console.error("ERROR: No <loc> URLs found in sitemap.");
    process.exit(1);
  }
  console.log(
    `Found ${urls.length} unique URLs. Checking with concurrency ${CONCURRENCY}...\n`
  );

  const results = await runWithConcurrency(urls, checkUrl, CONCURRENCY);
  for (const result of results) {
    const prefix = result.errors.length
      ? "FAIL"
      : result.warnings.length
        ? "WARN"
        : "PASS";
    console.log(
      `${prefix} ${result.status ?? "ERR"} ${result.url} (${result.duration}ms)`
    );
    for (const error of result.errors) console.log(`     ERROR: ${error}`);
    for (const warning of result.warnings)
      console.log(`     WARN:  ${warning}`);
  }

  const failed = results.filter((result) => result.errors.length);
  const warned = results.filter((result) => result.warnings.length);
  const redirected = results.filter((result) =>
    result.warnings.some((warning) => warning.startsWith("redirected"))
  );
  const slow = results.filter((result) => result.duration >= SLOW_MS);

  console.log("\n────────────────────────────────────");
  console.log("SITEMAP SEO HEALTH SUMMARY");
  console.log("────────────────────────────────────");
  console.log(`Total URLs:       ${results.length}`);
  console.log(
    `Passed cleanly:   ${results.length - failed.length - warned.filter((r) => !r.errors.length).length}`
  );
  console.log(`With errors:      ${failed.length}`);
  console.log(`With warnings:    ${warned.length}`);
  console.log(`Redirected:       ${redirected.length}`);
  console.log(`Slow (>=${SLOW_MS}ms): ${slow.length}`);
  console.log("────────────────────────────────────\n");

  if (failed.length) {
    console.error(
      "Sitemap health check FAILED because one or more sitemap URLs have SEO/reachability errors."
    );
    process.exit(1);
  }
  if (STRICT_WARNINGS && warned.length) {
    console.error(
      "Sitemap health check FAILED because strict warning mode is enabled."
    );
    process.exit(1);
  }
  console.log(
    warned.length
      ? "Sitemap health check passed with warnings."
      : "Sitemap health check passed."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
