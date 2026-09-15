export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Renders visible on-page FAQ copy. Pair with `faqSchema()` from
 * lib/seo/schema.ts using the SAME array so the structured data never
 * claims more than what's actually on the page (see that file's rule).
 * Native <details>/<summary> — no client JS, works with JS disabled.
 */
export function GuideFAQ({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="font-display text-lg font-bold text-navy">Frequently asked questions</h2>
      <div className="mt-4 space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border border-border bg-panel p-4 open:border-gold-soft"
          >
            <summary className="cursor-pointer list-none font-display text-sm font-semibold text-navy marker:content-none">
              <span className="flex items-center justify-between gap-3">
                {item.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-gold transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
