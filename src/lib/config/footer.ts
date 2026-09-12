export interface FooterLink {
    label: string;
    href: string;
    /** Opens in a new tab (target="_blank") -- used for trust/legal pages so a
     * reader doesn't lose their place on the page they were reading. */
    newTab?: boolean;
  }
  
  /**
   * The definitive footer menu, agreed 2026-09-12 (see docs/CONTENT-GAPS.md).
   * Deliberately short -- Comparison Methodology and Editorial Policy still
   * exist as pages (linked from /methodology) but are not separate footer
   * entries by design.
   */
  export const footerLinks: FooterLink[] = [
    { label: "Compare exchanges", href: "/compare/crypto-exchanges" },
    { label: "Guides", href: "/crypto/guides" },
    { label: "Affiliate disclosure", href: "/affiliate-disclosure", newTab: true },
    { label: "Methodology", href: "/methodology", newTab: true },
    { label: "How we get paid", href: "/how-we-get-paid", newTab: true },
    { label: "Terms of use", href: "/terms", newTab: true },
    { label: "Privacy policy", href: "/privacy", newTab: true },
  ];