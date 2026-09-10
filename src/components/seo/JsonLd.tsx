/**
 * Renders a JSON-LD <script> tag from a schema object built in
 * src/lib/seo/schema.ts. Never pass hand-written/unvalidated objects here —
 * structured data must correspond to real, visible page content.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
