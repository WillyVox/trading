/**
 * Single source of truth for optional legal/business identity details used
 * in the footer and legal pages (Terms, Privacy, copyright line, etc.).
 *
 * CRITICAL: every field starts unset. Do not fabricate a legal name, ABN,
 * ACN, AFSL, authorised-representative number, or address -- displaying an
 * invented value is worse than displaying nothing. Consuming components
 * must treat every field as optional and render nothing for an unset field
 * (see Footer.tsx) rather than substituting a placeholder that could be
 * mistaken for a real one.
 *
 * legalName/abn/businessAddress/support+privacy+complaints emails confirmed
 * by the business owner 2026-09-21 (see docs/CONTENT-GAPS.md). acn/afsl/
 * authorisedRepresentativeNumber remain unset -- not confirmed, do not
 * assume. supportEmail/privacyEmail/complaintsEmail currently all point at
 * the same inbox by the owner's instruction; split them if/when dedicated
 * addresses exist.
 */
export interface BusinessIdentity {
  /** Registered legal entity name, if different from the "Trading Guide" trading name. */
  legalName?: string;
  tradingName?: string;
  web?: string;
  abn?: string;
  acn?: string;
  /** Only set if Trading Guide (or its operator) genuinely holds an AFSL. Do not set based on assumption. */
  afsl?: string;
  /** Only set if operating as an authorised representative of an AFSL holder. */
  authorisedRepresentativeNumber?: string;
  businessAddress?: string;
  supportEmail?: string;
  privacyEmail?: string;
  complaintsEmail?: string;
}

export const businessIdentity: BusinessIdentity = {
  legalName: "Le T",
  tradingName: "Trading Guide",
  web: "TradingGuide.com.au",
  abn: "54347400601",
  businessAddress: "254B North Rocks Rd, North Rocks, NSW 2151",
  supportEmail: "tradingguide@outlook.com.au",
  privacyEmail: "tradingguide@outlook.com.au",
  complaintsEmail: "tradingguide@outlook.com.au",
};
