import { test } from "node:test";
import assert from "node:assert/strict";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { renderArticleContent } from "../renderer";

function toHtml(node: unknown): string {
  return renderToStaticMarkup(node as ReactElement);
}

test("re-sanitizes on render even though content should already be sanitized at write time", () => {
  const { content } = renderArticleContent('<p>Hi</p><script>alert(1)</script><p onclick="x()">Click</p>');
  const html = toHtml(content);
  assert.ok(!html.includes("<script"));
  assert.ok(!html.includes("alert"));
  assert.ok(!html.includes("onclick"));
});

test("injects stable heading ids and returns a matching headings array", () => {
  const { content, headings } = renderArticleContent("<h2>Our Top Exchanges</h2><p>Text</p>");
  const html = toHtml(content);
  assert.equal(headings.length, 1);
  assert.equal(headings[0].text, "Our Top Exchanges");
  assert.ok(html.includes(`id="${headings[0].id}"`));
});

test("wraps tables in a horizontally-scrollable container", () => {
  const { content } = renderArticleContent("<table><tbody><tr><td>A</td></tr></tbody></table>");
  const html = toHtml(content);
  assert.match(html, /class="article-table-wrap overflow-x-auto"[^>]*>\s*<table/);
});

test("estimates reading time from real word count, never a fixed number", () => {
  const short = renderArticleContent("<p>Hi</p>");
  const longHtml = `<p>${"word ".repeat(400)}</p>`;
  const long = renderArticleContent(longHtml);
  assert.ok(long.readingMinutes > short.readingMinutes);
});

test("renders a valid youtube video embed marker as our own iframe wrapper", () => {
  const { content } = renderArticleContent("<p>Watch:</p>\n\n{{video:youtube:dQw4w9WgXcQ:How it works}}");
  const html = toHtml(content);
  assert.ok(html.includes("youtube-nocookie.com/embed/dQw4w9WgXcQ"));
  assert.ok(html.includes("How it works"));
});

test("renders a valid vimeo video embed marker without a caption", () => {
  const { content } = renderArticleContent("{{video:vimeo:76979871}}");
  const html = toHtml(content);
  assert.ok(html.includes("player.vimeo.com/video/76979871"));
});

test("an unsupported video provider renders nothing on public pages", () => {
  const { content } = renderArticleContent("<p>Before</p>{{video:dailymotion:abc123}}<p>After</p>");
  const html = toHtml(content);
  assert.ok(!html.includes("dailymotion"));
  assert.ok(html.includes("Before"));
  assert.ok(html.includes("After"));
});

test("an unsupported video provider shows an invalid-embed notice in preview context", () => {
  const { content } = renderArticleContent("{{video:dailymotion:abc123}}", { context: "preview" });
  const html = toHtml(content);
  assert.ok(html.includes("Invalid embed configuration"));
  assert.ok(html.includes("dailymotion"));
});

test("unknown embed markers (future Block 4 types) render nothing on public pages", () => {
  const { content } = renderArticleContent(
    "<p>Before</p>{{provider-comparison:coinspot,kraken}}<p>After</p>",
    { context: "public" }
  );
  const html = toHtml(content);
  assert.ok(!html.includes("provider-comparison"));
  assert.ok(html.includes("Before"));
  assert.ok(html.includes("After"));
});

test("unknown embed markers show a 'not yet available' placeholder in preview context", () => {
  const { content } = renderArticleContent("{{provider-comparison:coinspot,kraken}}", { context: "preview" });
  const html = toHtml(content);
  assert.ok(html.includes("Embed not yet available"));
  assert.ok(html.includes("provider-comparison:coinspot,kraken"));
});

test("adds target=_blank + rel to external links but leaves internal links same-tab", () => {
  const { content } = renderArticleContent(
    '<p><a href="https://asic.gov.au/page">ASIC</a> and <a href="/crypto/guides/x">Guide</a></p>'
  );
  const html = toHtml(content);

  const externalTag = html.match(/<a[^>]*href="https:\/\/asic\.gov\.au\/page"[^>]*>/)?.[0] ?? "";
  const internalTag = html.match(/<a[^>]*href="\/crypto\/guides\/x"[^>]*>/)?.[0] ?? "";

  assert.ok(externalTag.includes('target="_blank"'), "external link should open in a new tab");
  assert.ok(externalTag.includes('rel="noopener noreferrer"'));
  assert.ok(!internalTag.includes("target="), "internal link should not open in a new tab");
  assert.ok(internalTag.includes('rel="noopener noreferrer"'));
});

test("public vs preview context render identically for ordinary sanitized HTML (no embeds involved)", () => {
  const html = "<h2>Fees explained</h2><p>Some <strong>bold</strong> text.</p>";
  const pub = toHtml(renderArticleContent(html, { context: "public" }).content);
  const preview = toHtml(renderArticleContent(html, { context: "preview" }).content);
  assert.equal(pub, preview);
});

test("handles empty content without throwing", () => {
  const { content, headings, readingMinutes } = renderArticleContent("");
  assert.equal(toHtml(content), "");
  assert.deepEqual(headings, []);
  assert.equal(readingMinutes, 0);
});