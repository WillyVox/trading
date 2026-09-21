/**
 * Renders a JSON-LD <script> tag from a schema object built in
 * src/lib/seo/schema.ts. Never pass hand-written/unvalidated objects here —
 * structured data must correspond to real, visible page content.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // JSON.stringify does not escape "<", so a string field containing
  // "</script>" (e.g. an article title) would close this tag early and let the
  // rest of the value be parsed as HTML. Escaping "<" as \u003c keeps the
  // output valid JSON with the same meaning, but can never end the script.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
