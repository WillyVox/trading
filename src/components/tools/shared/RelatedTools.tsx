import Link from "next/link";
export function RelatedTools({ offeringSlug }: { offeringSlug?: string }) {
  const links = [
    ...(offeringSlug ? [{ href: `/share-trading/${offeringSlug}`, label: "View this platform" }] : []),
    { href: "/share-trading/compare", label: "Compare trading platforms" },
    { href: "/guides/share-trading-for-beginners", label: "Share trading for beginners" },
    { href: "/tools/fx-fee-calculator", label: "FX fee calculator" },
  ];
  return <section aria-labelledby="related-research" className="mt-10">
    <h2 id="related-research" className="font-display text-navy text-2xl font-bold">Continue your research</h2>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">{links.map((link) => <Link key={link.href} href={link.href} className="border-border bg-panel text-navy hover:border-gold rounded-xl border p-4 font-semibold transition-colors">{link.label} <span aria-hidden="true">→</span></Link>)}</div>
  </section>;
}
