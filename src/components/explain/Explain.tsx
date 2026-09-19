import { getGlossaryTerm, type GlossaryKey } from "@/lib/glossary/terms";

/** "19 Sep 2026" -- same short style used for promo dates on profiles. */
function formatReviewed(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * A small "?" button that opens a plain-English explainer card for one
 * glossary term.
 *
 * Built on the browser's native Popover API (`popover` + `popovertarget`),
 * so it needs no client JavaScript: Esc and clicking outside close it, it
 * renders in the top layer (so the compare table's horizontal scroll
 * container can't clip it), and the explanation stays in the server-rendered
 * HTML for search engines. The card is centred on desktop and becomes a
 * bottom sheet on phones -- see `.explainer-card` in globals.css.
 *
 * `scope` keeps element ids unique when the same term appears more than once
 * on a page (e.g. one card per list row). Pass anything stable and unique
 * per place the term appears -- a row id or `${slug}-list` both work.
 *
 * Do not add a `display` utility (flex, grid, block...) to the popover
 * element itself: an author `display` beats the browser's built-in
 * `display: none` for a closed popover and the card would always be
 * visible. Layout lives on the inner wrapper instead.
 */
export function Explain({ term, scope }: { term: GlossaryKey; scope: string }) {
  const entry = getGlossaryTerm(term);
  const id = `explain-${term}-${scope}`.replace(/[^a-zA-Z0-9_-]/g, "-");
  const titleId = `${id}-title`;

  return (
    <>
      <button
        type="button"
        popoverTarget={id}
        aria-label={`What does ${entry.term} mean?`}
        className="border-gold bg-panel text-gold hover:bg-gold hover:text-panel focus-visible:outline-navy relative ml-1.5 inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border align-middle text-[11px] leading-none font-semibold transition-colors before:absolute before:-inset-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        ?
      </button>

      <div
        id={id}
        popover="auto"
        aria-labelledby={titleId}
        className="explainer-card border-border bg-panel text-text backdrop:bg-navy/40 max-h-[80vh] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border p-5 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <p
            id={titleId}
            className="font-display text-navy text-base font-bold"
          >
            {entry.term}
          </p>
          <button
            type="button"
            popoverTarget={id}
            popoverTargetAction="hide"
            aria-label="Close"
            className="border-border text-muted hover:text-navy focus-visible:outline-navy -mt-1 -mr-1 inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border text-base leading-none focus-visible:outline-2"
          >
            {"\u00d7"}
          </button>
        </div>

        {/* <p className="text-navy mt-3 text-xs font-semibold">In plain English</p> */}
        <p className="mt-0.5 text-sm">{entry.plainEnglish}</p>

        <p className="text-navy mt-3 text-xs font-semibold">Why it matters</p>
        <p className="mt-0.5 text-sm">{entry.whyItMatters}</p>

        {entry.reviewedAt && (
          <p className="text-muted border-border mt-4 border-t pt-3 text-xs">
            Last reviewed {formatReviewed(entry.reviewedAt)}
          </p>
        )}
      </div>
    </>
  );
}
