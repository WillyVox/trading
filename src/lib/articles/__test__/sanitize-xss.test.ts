import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeArticleContent } from "../sanitize";
import { assertSafeArticleHtml } from "./html-assertions";

/**
 * Adversarial inputs for the one sanitization policy every article write and
 * render goes through (see ../sanitize.ts). The assertions check the
 * resulting tags/attributes/URLs structurally rather than string-matching
 * payloads.
 */
const PAYLOADS: Record<string, string> = {
  "script tag": "<p>a</p><script>alert(1)</script>",
  "nested script": "<div><p><script>alert(1)</script></p></div>",
  "img onerror": "<img src=x onerror=alert(1)>",
  "img onerror quoted": '<img src="x" onerror="alert(document.cookie)">',
  "javascript: href": '<a href="javascript:alert(1)">x</a>',
  "mixed-case javascript: href": '<a href="  JaVaScRiPt:alert(1)">x</a>',
  "entity-obfuscated javascript: href":
    '<a href="jav&#x09;ascript:alert(1)">x</a>',
  "entity-encoded colon": '<a href="javascript&colon;alert(1)">x</a>',
  "data: html href":
    '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">x</a>',
  "vbscript: href": '<a href="vbscript:msgbox(1)">x</a>',
  "protocol-relative href": '<a href="//evil.example/x">x</a>',
  "javascript: img src": '<img src="javascript:alert(1)">',
  "protocol-relative img src": '<img src="//evil.example/x.png">',
  "svg onload": "<svg onload=alert(1)></svg>",
  "svg with script": "<svg><script>alert(1)</script></svg>",
  iframe: '<iframe src="https://evil.example"></iframe>',
  "iframe srcdoc": '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
  object: '<object data="x"></object>',
  embed: '<embed src="x">',
  form: '<form action="https://evil.example"><input name="q"></form>',
  "inline style": '<p style="background:url(javascript:alert(1))">x</p>',
  "event handler on p": '<p onclick="alert(1)">x</p>',
  "style element": "<style>@import 'https://evil.example/x.css';</style>",
  "base element": '<base href="https://evil.example/">',
  "meta refresh":
    '<meta http-equiv="refresh" content="0;url=https://evil.example">',
  "link element": '<link rel="stylesheet" href="https://evil.example/x.css">',
  "mutation-XSS (mglyph)":
    '<math><mtext><table><mglyph><style><!--</style><img title="--&gt;&lt;img src=1 onerror=alert(1)&gt;">',
  "unclosed tag": '<img src="x" onerror="alert(1)"',
  "attribute injection in data-align":
    '<img src="/a.png" data-align="center\' onerror=\'alert(1)">',
  "html comment trick": "<!--><script>alert(1)</script>-->",
};

for (const [name, payload] of Object.entries(PAYLOADS)) {
  test(`neutralises: ${name}`, () => {
    const once = sanitizeArticleContent(payload);
    assertSafeArticleHtml(once, name);
    // Rendering re-sanitizes already-sanitized content, so a second pass must
    // not reintroduce or change anything.
    assert.equal(sanitizeArticleContent(once), once, `${name}: not idempotent`);
  });
}

test("external links open in a new tab with rel=noopener noreferrer", () => {
  const out = sanitizeArticleContent('<a href="https://evil.example/x">x</a>');
  assert.match(out, /rel="noopener noreferrer"/);
  assert.match(out, /target="_blank"/);
});

test("internal links get rel but never a new-tab target, even if one is supplied", () => {
  const out = sanitizeArticleContent(
    '<a href="/guides/x" target="_blank">x</a>'
  );
  assert.match(out, /rel="noopener noreferrer"/);
  assert.doesNotMatch(out, /target=/);
});

test("mailto links survive", () => {
  const out = sanitizeArticleContent(
    '<a href="mailto:hello@example.com">email</a>'
  );
  assert.match(out, /href="mailto:hello@example.com"/);
});

test("ordinary article structure is preserved", () => {
  const html =
    "<h2>Fees</h2><p>Brokerage is the fee for a trade. <strong>Check it.</strong></p>" +
    "<ul><li>One</li><li>Two</li></ul>" +
    "<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>";
  assert.equal(sanitizeArticleContent(html), html);
});

test("image alignment keeps only the three known values", () => {
  assert.match(
    sanitizeArticleContent('<img src="/a.png" alt="a" data-align="center">'),
    /data-align="center"/
  );
  assert.doesNotMatch(
    sanitizeArticleContent('<img src="/a.png" alt="a" data-align="justify">'),
    /data-align/
  );
});

test("embed marker text passes through as inert text", () => {
  const out = sanitizeArticleContent("<p>{{video:youtube:dQw4w9WgXcQ}}</p>");
  assertSafeArticleHtml(out, "embed marker");
  assert.match(out, /\{\{video:youtube:dQw4w9WgXcQ\}\}/);
});
