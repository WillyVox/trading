import type { Heading } from "@/lib/articles/content";

/**
 * Server component, no client JS. Native <details>/<summary> gives mobile
 * users a real collapsible control; on desktop the summary's pointer
 * events are disabled so it stays open and reads as a sticky sidebar
 * panel instead of a toggle.
 */
export function GuideTableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;

  return (
    <details
      open
      className="rounded-2xl border border-border bg-panel p-4 lg:sticky lg:top-24"
    >
      <summary className="cursor-pointer font-display text-sm font-bold uppercase tracking-wide text-navy marker:text-gold lg:pointer-events-none lg:cursor-default">
        Table of contents
      </summary>
      <ol className="mt-3 space-y-1.5 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "ml-4" : undefined}>
            <a href={`#${h.id}`} className="text-muted hover:text-navy">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
