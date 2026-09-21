import assert from "node:assert/strict";
import test from "node:test";
import {
  isLikelyBot,
  isPrefetchRequest,
  normaliseReferrer,
  sanitizePlacement,
  shouldRecordClick,
} from "../click-input";
import { isLivePartnershipStatus } from "../status";

const headers = (values: Record<string, string>) => ({
  get: (name: string) => values[name.toLowerCase()] ?? null,
});

test("placement accepts short identifiers and drops everything else", () => {
  assert.equal(sanitizePlacement("compare"), "compare");
  assert.equal(sanitizePlacement("ArticleDetails"), "ArticleDetails");
  assert.equal(sanitizePlacement("share-trading"), "share-trading");
  assert.equal(sanitizePlacement("profile_hero"), "profile_hero");
  assert.equal(sanitizePlacement(""), undefined);
  assert.equal(sanitizePlacement(null), undefined);
  assert.equal(sanitizePlacement("x".repeat(41)), undefined);
  assert.equal(sanitizePlacement("<script>alert(1)</script>"), undefined);
  assert.equal(sanitizePlacement("a b"), undefined);
  assert.equal(sanitizePlacement("a\nb"), undefined);
});

test("referrer keeps origin and path only", () => {
  assert.equal(
    normaliseReferrer(
      "https://tradingguide.com.au/share-trading?token=abc#frag"
    ),
    "https://tradingguide.com.au/share-trading"
  );
  assert.equal(normaliseReferrer("not a url"), undefined);
  assert.equal(normaliseReferrer("javascript:alert(1)"), undefined);
  assert.equal(normaliseReferrer(null), undefined);
});

test("referrer is length-capped", () => {
  const long = `https://tradingguide.com.au/${"a".repeat(1000)}`;
  const result = normaliseReferrer(long);
  assert.ok(result);
  assert.equal(result.length, 300);
});

test("prefetches are recognised", () => {
  assert.equal(isPrefetchRequest(headers({ purpose: "prefetch" })), true);
  assert.equal(
    isPrefetchRequest(headers({ "sec-purpose": "prefetch;prerender" })),
    true
  );
  assert.equal(
    isPrefetchRequest(headers({ "next-router-prefetch": "1" })),
    true
  );
  assert.equal(isPrefetchRequest(headers({})), false);
});

test("bots and empty user agents are filtered, browsers are not", () => {
  assert.equal(isLikelyBot(null), true);
  assert.equal(isLikelyBot(""), true);
  assert.equal(
    isLikelyBot("Googlebot/2.1 (+http://www.google.com/bot.html)"),
    true
  );
  assert.equal(isLikelyBot("curl/8.4.0"), true);
  assert.equal(
    isLikelyBot(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    ),
    false
  );
  assert.equal(
    isLikelyBot(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    ),
    false
  );
});

test("a click is recorded only for a real, non-prefetch browser request", () => {
  const browser =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36";
  assert.equal(shouldRecordClick(headers({ "user-agent": browser })), true);
  assert.equal(
    shouldRecordClick(headers({ "user-agent": browser, purpose: "prefetch" })),
    false
  );
  assert.equal(shouldRecordClick(headers({})), false);
});

test("only approved or active partnerships may go live", () => {
  assert.equal(isLivePartnershipStatus("APPROVED"), true);
  assert.equal(isLivePartnershipStatus("ACTIVE"), true);
  for (const status of [
    "PROSPECT",
    "APPLIED",
    "PAUSED",
    "REJECTED",
    "ENDED",
  ] as const) {
    assert.equal(isLivePartnershipStatus(status), false, status);
  }
});
