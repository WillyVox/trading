import { getGlossaryTerm, type GlossaryKey } from "@/lib/glossary/terms";
import { ExplainTip } from "./ExplainTip";

/** "19 Sep 2026" -- same short style used for promo dates on profiles. */
function formatReviewed(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * A small "?" button that shows a plain-English explainer tooltip for one
 * glossary term, anchored to the button.
 *
 * This is a server component: the explanation (and any source links) is
 * rendered into the HTML, so search engines see it even though the tooltip
 * is closed by default. Open/close and positioning live in `ExplainTip`
 * (client) -- hover or focus to peek, click or tap to pin, Esc or an outside
 * tap to dismiss. The tooltip is a native popover in the top layer, so the
 * compare table's horizontal scroll container can't clip it.
 *
 * `scope` keeps element ids unique when the same term appears more than once
 * on a page (e.g. one tooltip per list row). Pass anything stable and unique
 * per place the term appears -- a row id or `${slug}-list` both work.
 */
export function Explain({ term, scope }: { term: GlossaryKey; scope: string }) {
  const entry = getGlossaryTerm(term);
  const id = `explain-${term}-${scope}`.replace(/[^a-zA-Z0-9_-]/g, "-");
  const titleId = `${id}-title`;

  return (
    <ExplainTip
      id={id}
      labelledBy={titleId}
      label={`What does ${entry.term} mean?`}
    >
      <p id={titleId} className="font-display text-base font-bold">
        {entry.term}
      </p>
      <p className="mt-0.5 text-[13.5px] leading-normal">
        {entry.plainEnglish}
      </p>

      <p className="text-gold-soft mt-2.5 text-xs font-semibold">
        Why it matters
      </p>
      <p className="mt-0.5 text-[13.5px] leading-normal">
        {entry.whyItMatters}
      </p>

      {(entry.sources.length > 0 || entry.reviewedAt) && (
        <div className="mt-3 border-t border-white/15 pt-2.5 text-xs text-white/70">
          {entry.sources.length > 0 && (
            <p>
              Sources:{" "}
              {entry.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && ", "}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-soft underline underline-offset-2 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                  >
                    {s.label}
                  </a>
                </span>
              ))}
            </p>
          )}
          {entry.reviewedAt && (
            <p className={entry.sources.length > 0 ? "mt-1" : undefined}>
              Last reviewed {formatReviewed(entry.reviewedAt)}
            </p>
          )}
        </div>
      )}
    </ExplainTip>
  );
}
