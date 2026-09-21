import type { CustodyType, VerificationStatus } from "@prisma/client";

export type CustodyExplorerRow = {
  id: string;
  offeringSlug: string;
  offeringName: string;
  providerName: string;
  marketCode: string | null;
  marketName: string | null;
  custodyType: CustodyType;
  hinSupported: boolean | null;
  custodianName: string | null;
  description: string | null;
  sourceUrl: string | null;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
};
