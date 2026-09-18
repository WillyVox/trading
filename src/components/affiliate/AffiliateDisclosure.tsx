export function AffiliateDisclosure() {
  return (
    <p className="text-muted mt-2 text-xs">
      This is a paid/affiliate link. It does not affect our independent
      comparison ranking.
    </p>
  );
}

/**
 * One disclosure for a whole section of affiliate CTAs -- e.g. a
 * comparison table with a "Visit site" button in every column. The
 * per-CTA <AffiliateDisclosure /> above repeated once per column reads as
 * noise (and technically undersells the FTC/Google expectation that the
 * disclosure sit once, prominently, near the links it covers, not
 * scattered many times in small type). Place this once, above the group,
 * not per-card.
 */
export function SectionAffiliateDisclosure() {
  return (
    <div className="border-border bg-panel-secondary text-muted mb-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs">
      <span aria-hidden className="mt-px">
        ℹ
      </span>
      <p>
        Some links on this site are affiliate links. They never affect which
        providers appear here or how they&apos;re ordered.{" "}
        <a href="/how-we-get-paid" className="text-navy underline">
          How we get paid
        </a>
        .
      </p>
    </div>
  );
}
