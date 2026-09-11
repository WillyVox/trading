import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeArticleContent } from "../sanitize";

test("strips <script> tags entirely, including their contents", () => {
  const out = sanitizeArticleContent('<p>Hello</p><script>alert("x")</script>');
  assert.ok(!out.includes("<script"));
  assert.ok(!out.includes("alert"));
});

test("strips inline event handler attributes", () => {
  const out = sanitizeArticleContent('<p onclick="alert(1)">Click</p>');
  assert.ok(!out.includes("onclick"));
});

test("strips javascript: URLs from links", () => {
  const out = sanitizeArticleContent('<a href="javascript:alert(1)">link</a>');
  assert.ok(!out.includes("javascript:"));
});

test("strips iframes", () => {
  const out = sanitizeArticleContent('<p>Before</p><iframe src="https://evil.example"></iframe><p>After</p>');
  assert.ok(!out.includes("<iframe"));
});

test("strips disallowed class/style attributes", () => {
  const out = sanitizeArticleContent('<p class="hack" style="color:red">Text</p>');
  assert.ok(!out.includes("class="));
  assert.ok(!out.includes("style="));
});

test("keeps allowed structural tags and text", () => {
  const out = sanitizeArticleContent("<h2>Heading</h2><p>Some <strong>bold</strong> text.</p>");
  assert.ok(out.includes("<h2>Heading</h2>"));
  assert.ok(out.includes("<strong>bold</strong>"));
});

test("keeps a plain https link and adds rel=noopener noreferrer", () => {
  const out = sanitizeArticleContent('<a href="https://example.com">Example</a>');
  assert.ok(out.includes('href="https://example.com"'));
  assert.ok(out.includes('rel="noopener noreferrer"'));
});

test("adds target=_blank to an absolute external link", () => {
  const out = sanitizeArticleContent('<a href="https://asic.gov.au/page">ASIC</a>');
  assert.ok(out.includes('target="_blank"'));
});

test("does not add target=_blank to a relative/internal link", () => {
  const out = sanitizeArticleContent('<a href="/crypto/guides/how-to-buy-bitcoin">Guide</a>');
  assert.ok(!out.includes("target="));
  assert.ok(out.includes('rel="noopener noreferrer"'));
});

test("keeps allowed img attributes (src/alt/width/height) but drops class", () => {
  const out = sanitizeArticleContent('<img src="/x.png" alt="desc" width="100" height="50" class="hack">');
  assert.ok(out.includes('src="/x.png"'));
  assert.ok(out.includes('alt="desc"'));
  assert.ok(!out.includes("class="));
});

test("handles empty/undefined input without throwing", () => {
  assert.equal(sanitizeArticleContent(""), "");
});