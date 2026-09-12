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
 * TODO(content-gap): every field below is a known content gap tracked in
 * docs/CONTENT-GAPS.md -- populate with real values (or confirm "not
 * applicable") before production launch.
 */
export interface BusinessIdentity {
    /** Registered legal entity name, if different from the "AusMarket Crypto" trading name. */
    legalName?: string;
    tradingName?: string;
    abn?: string;
    acn?: string;
    /** Only set if AusMarket (or its operator) genuinely holds an AFSL. Do not set based on assumption. */
    afsl?: string;
    /** Only set if operating as an authorised representative of an AFSL holder. */
    authorisedRepresentativeNumber?: string;
    businessAddress?: string;
    supportEmail?: string;
    privacyEmail?: string;
    complaintsEmail?: string;
  }
  
  export const businessIdentity: BusinessIdentity = {};