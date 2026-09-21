export type CustodyTypeDto =
  | "CHESS_SPONSORED"
  | "ISSUER_SPONSORED"
  | "CUSTODIAL"
  | "DIRECT_REGISTRATION"
  | "OMNIBUS"
  | "MIXED"
  | "OTHER"
  | "UNKNOWN";

export type CustodyVerificationStatus = "VERIFIED" | "UNVERIFIED" | "STALE";

export type CustodyExplorerRow = {
  id: string;
  offeringSlug: string;
  offeringName: string;
  providerName: string;
  marketCode: string | null;
  marketName: string | null;
  custodyType: CustodyTypeDto;
  hinSupported: boolean | null;
  custodianName: string | null;
  description: string | null;
  sourceUrl: string | null;
  verificationStatus: CustodyVerificationStatus;
  verifiedAt: string | null;
  reviewDueAt: string | null;
};
