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
    <section className="border-border mt-10 border-t pt-6">
      <h2 className="font-display text-navy text-lg font-bold">
        Frequently asked questions
      </h2>
      <div className="mt-4 space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group border-border bg-panel open:border-gold-soft rounded-xl border p-4"
          >
            <summary className="font-display text-navy cursor-pointer list-none text-sm font-semibold marker:content-none">
              <span className="flex items-center justify-between gap-3">
                {item.question}
                <span
                  aria-hidden="true"
                  className="text-gold shrink-0 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="text-muted mt-2.5 text-sm leading-relaxed">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
