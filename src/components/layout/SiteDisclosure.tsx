import Link from "next/link";

/**
 * Site-wide general-information disclosure.
 *
 * Keep this focused on statements that apply across the whole public site.
 * Feature-specific assumptions, data-quality messages and risk warnings belong
 * next to the feature they qualify rather than being absorbed into this block.
 */
export function SiteDisclosure() {
  return (
    <aside
      className="border-gold-soft/70 border-t bg-slate-50"
      aria-labelledby="site-disclosure-title"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-5 sm:gap-4 sm:py-6">
        <span
          aria-hidden="true"
          className="border-gold text-gold-dark mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border font-serif text-sm font-bold"
        >
          i
        </span>
        <div className="min-w-0">
          <h2
            id="site-disclosure-title"
            className="text-navy text-sm font-bold"
          >
            Important information
          </h2>
          <p className="text-muted mt-2 text-xs leading-5">
            Trading Guide provides general information and educational content
            only. It is not personal financial advice and does not execute
            trades or recommend a particular platform. Research, comparisons and
            calculator estimates may not include every feature, fee or cost that
            could apply. Trading Guide does not hold an Australian Financial
            Services Licence (AFSL), and does not compare all available
            providers in Australia.
          </p>
          <p className="text-muted mt-2 text-xs leading-5">
            Learn more in our{" "}
            <Link href="/methodology" className="text-blue underline">
              methodology
            </Link>{" "}
            and{" "}
            <Link href="/how-we-get-paid" className="text-blue underline">
              how we get paid
            </Link>{" "}
            disclosure.
          </p>
        </div>
      </div>
    </aside>
  );
}
