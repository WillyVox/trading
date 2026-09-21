import assert from "node:assert/strict";
import test from "node:test";
import { assertSafeArticleHtml, parseTags } from "./html-assertions";

test("the checker accepts clean article HTML", () => {
  assertSafeArticleHtml(
    '<h2>Fees</h2><p>See <a href="https://example.com/x?a=1&amp;b=2" rel="noopener noreferrer" target="_blank">the fee schedule</a>.</p>' +
      '<img src="/images/a.png" alt="Diagram" width="600" height="400" data-align="center"><table><tbody><tr><td>1</td></tr></tbody></table>'
  );
});

test("the checker does not flag escaped text that merely looks like markup", () => {
  assertSafeArticleHtml(
    '<img src="/a.png" title="--&gt;&lt;img src=1 onerror=alert(1)&gt;">'
  );
});

test("the checker catches what the sanitizer must never let through", () => {
  const bad = [
    "<script>alert(1)</script>",
    "<img src=x onerror=alert(1)>",
    '<a href="javascript:alert(1)">x</a>',
    '<a href="  JaVaScRiPt:alert(1)">x</a>',
    '<a href="jav&#x09;ascript:alert(1)">x</a>',
    '<a href="data:text/html;base64,AAAA">x</a>',
    '<a href="//evil.example">x</a>',
    '<iframe src="https://evil.example"></iframe>',
    '<p style="color:red">x</p>',
    '<p onclick="alert(1)">x</p>',
    "<svg onload=alert(1)></svg>",
    '<style>@import "x";</style>',
  ];
  for (const html of bad) {
    assert.throws(() => assertSafeArticleHtml(html), html);
  }
});

test("parseTags reads names and attributes", () => {
  const [tag] = parseTags('<a href="https://x.test/" rel="noopener">t</a>');
  assert.equal(tag.name, "a");
  assert.equal(tag.attributes.href, "https://x.test/");
  assert.equal(tag.attributes.rel, "noopener");
});
