import assert from "node:assert/strict";

/**
 * Structural checks on sanitized HTML, used by the XSS tests. Rather than
 * matching payload strings (which would flag harmless escaped text such as
 * `title="&lt;img onerror=...&gt;"`), this reads the actual tags and
 * attributes in the output and checks each against what the article policy
 * allows.
 */

const ALLOWED_TAGS = new Set([
  "h2",
  "h3",
  "h4",
  "p",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "figure",
  "figcaption",
  "img",
  "code",
  "pre",
  "hr",
  "br",
]);

const ALLOWED_ATTRIBUTES = new Set([
  "href",
  "title",
  "rel",
  "target",
  "src",
  "alt",
  "width",
  "height",
  "data-align",
]);

const ALLOWED_URL_SCHEMES = new Set(["http", "https", "mailto"]);

const TAG_PATTERN = /<\/?\s*([a-z][a-z0-9-]*)([^>]*)>/gi;
const ATTRIBUTE_PATTERN =
  /([^\s"'<>/=]+)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;

export interface ParsedTag {
  name: string;
  attributes: Record<string, string>;
}

export function parseTags(html: string): ParsedTag[] {
  const tags: ParsedTag[] = [];
  for (const match of html.matchAll(TAG_PATTERN)) {
    const attributes: Record<string, string> = {};
    for (const attr of match[2].matchAll(ATTRIBUTE_PATTERN)) {
      const raw = attr[2] ?? "";
      attributes[attr[1].toLowerCase()] = raw.replace(/^["']|["']$/g, "");
    }
    tags.push({ name: match[1].toLowerCase(), attributes });
  }
  return tags;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);?/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&colon;/gi, ":")
    .replace(/&tab;|&newline;/gi, "")
    .replace(/&amp;/gi, "&");
}

/** Throws (via assert) if the HTML contains anything the article policy should have removed. */
export function assertSafeArticleHtml(html: string, label = "output"): void {
  for (const tag of parseTags(html)) {
    assert.ok(
      ALLOWED_TAGS.has(tag.name),
      `${label}: disallowed tag <${tag.name}> in ${html}`
    );

    for (const [name, value] of Object.entries(tag.attributes)) {
      assert.ok(
        ALLOWED_ATTRIBUTES.has(name),
        `${label}: disallowed attribute "${name}" on <${tag.name}> in ${html}`
      );
      if (name === "href" || name === "src") {
        const decoded = decodeEntities(value).replace(/[\u0000-\u0020]/g, "");
        assert.ok(
          !decoded.startsWith("//"),
          `${label}: protocol-relative URL in ${html}`
        );
        const scheme = /^([a-z][a-z0-9+.-]*):/i
          .exec(decoded)?.[1]
          ?.toLowerCase();
        if (scheme) {
          assert.ok(
            ALLOWED_URL_SCHEMES.has(scheme),
            `${label}: disallowed URL scheme "${scheme}" in ${html}`
          );
        }
      }
    }
  }
}
