/**
 * Beginner glossary -- the single source of plain-English wording for the
 * jargon that appears on platform profiles, list cards and comparisons.
 *
 * Step 3a of the beginner-explanations work covers ownership/custody terms
 * only (the terms `CustodyType` already models, plus HIN). Fee, access,
 * account and trust-badge terms arrive in 3b/3c with the UI that uses them,
 * so every entry here is actually rendered somewhere and reviewed together
 * with the place it appears.
 *
 * Rules for wording (please keep when editing):
 *  - General information only. Describe what a thing is and what follows
 *    from it; never tell the reader what they should do.
 *  - `plainEnglish` explains the term. `whyItMatters` says what it changes
 *    for a beginner. Neither should need another glossary term to make sense.
 *  - `reviewedAt` stays null until a person has checked the wording against
 *    an official source (ASX, ASIC MoneySmart, the broker's own terms). The
 *    card only shows a "Last reviewed" line when this is set, so a draft
 *    never claims a review that hasn't happened.
 *  - `sources` is for those official sources. Only add real URLs.
 */

export type GlossaryKey =
  | "chess-sponsored"
  | "issuer-sponsored"
  | "custodial"
  | "direct-registration"
  | "omnibus"
  | "hin";

export type GlossarySource = { label: string; url: string };

export type GlossaryTerm = {
  key: GlossaryKey;
  /** Heading shown on the explainer card, exactly as a reader sees it. */
  term: string;
  plainEnglish: string;
  whyItMatters: string;
  /** ISO date (YYYY-MM-DD) of the last human check, or null while draft. */
  reviewedAt: string | null;
  sources: GlossarySource[];
};

export const GLOSSARY: Record<GlossaryKey, GlossaryTerm> = {
  "chess-sponsored": {
    key: "chess-sponsored",
    term: "CHESS-sponsored",
    plainEnglish:
      "Your shares are registered directly in your name on the ASX under your own Holder Identification Number (HIN), rather than being held by the broker on your behalf.",
    whyItMatters:
      "Because the holding is in your name, you can usually move it to another broker without selling first. Transfer fees may apply.",
    reviewedAt: null,
    sources: [],
  },
  "issuer-sponsored": {
    key: "issuer-sponsored",
    term: "Issuer-sponsored",
    plainEnglish:
      "Your holding is registered directly with the company's share registry under a Security Reference Number (SRN), not through a broker's HIN.",
    whyItMatters:
      "Selling or moving these shares to a broker usually needs your SRN, and can take longer than selling a CHESS-sponsored holding.",
    reviewedAt: null,
    sources: [],
  },
  custodial: {
    key: "custodial",
    term: "Custodial",
    plainEnglish:
      "The broker, or a custodian it uses, holds the legal title to these shares on your behalf. You keep the benefits of owning them, but the holding isn't registered in your own name and has no personal HIN.",
    whyItMatters:
      "Moving to another broker can be harder than with a CHESS-sponsored holding, so it's worth checking the provider's transfer rules.",
    reviewedAt: null,
    sources: [],
  },
  "direct-registration": {
    key: "direct-registration",
    term: "Direct registration",
    plainEnglish:
      "Your holding is registered directly in your own name, on the company's own register.",
    whyItMatters:
      "The broker isn't the registered holder, so selling or transferring the shares works differently from a broker-held account.",
    reviewedAt: null,
    sources: [],
  },
  omnibus: {
    key: "omnibus",
    term: "Omnibus (pooled)",
    plainEnglish:
      "Your holding is pooled with other customers' holdings under one nominee account, rather than being registered individually.",
    whyItMatters:
      "Your ownership is tracked in the broker's own records rather than on a register in your name.",
    reviewedAt: null,
    sources: [],
  },
  hin: {
    key: "hin",
    term: "HIN (Holder Identification Number)",
    plainEnglish:
      "A personal number that identifies you as the owner of shares held on the ASX's CHESS register.",
    whyItMatters:
      "If a platform gives you a HIN, your shares there are CHESS-sponsored. If it doesn't, they are usually held custodially.",
    reviewedAt: null,
    sources: [],
  },
};

export function getGlossaryTerm(key: GlossaryKey): GlossaryTerm {
  return GLOSSARY[key];
}
