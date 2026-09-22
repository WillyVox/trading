import assert from "node:assert/strict";
import test from "node:test";
import { findInternalLinkIssues, inspectInternalHref } from "../internal-links";

test("accepts canonical and external links", () => {
  assert.equal(inspectInternalHref("/compare/crypto-exchanges"), null);
  assert.equal(
    inspectInternalHref("/guides/how-to-buy-bitcoin-australia"),
    null
  );
  assert.equal(inspectInternalHref("https://asic.gov.au/example"), null);
});

test("detects relative and legacy links with canonical suggestions", () => {
  assert.deepEqual(inspectInternalHref("crypto/exchanges/compare"), {
    href: "crypto/exchanges/compare",
    kind: "RELATIVE",
    message: "Internal links must be site-root-relative.",
    suggestedHref: "/compare/crypto-exchanges",
  });
  assert.equal(
    inspectInternalHref("/share-trading/compare")?.suggestedHref,
    "/compare/trading-platforms"
  );
});

test("detects obsolete market-specific article namespaces", () => {
  assert.equal(
    inspectInternalHref("/crypto/guides/how-to-choose")?.suggestedHref,
    "/guides/how-to-choose"
  );
});

test("extracts article anchor issues", () => {
  const issues = findInternalLinkIssues(
    '<p><a href="crypto/exchanges/compare">Compare</a><a href="/guides/good">Guide</a></p>'
  );
  assert.equal(issues.length, 1);
});
