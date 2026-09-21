import type { CustodyExplorerRow, CustodyTypeDto } from "./types";

export type CustodyFact = {
  label: string;
  value: string;
  detail: string;
};

const FACTS: Record<CustodyTypeDto, CustodyFact[]> = {
  CHESS_SPONSORED: [
    {
      label: "Registered holder",
      value: "You / your entity",
      detail: "The holder is registered on the CHESS subregister.",
    },
    {
      label: "Identifier",
      value: "HIN",
      detail:
        "A Holder Identification Number identifies the sponsored holder in CHESS.",
    },
    {
      label: "Market scope",
      value: "Australian CHESS securities",
      detail:
        "CHESS is Australian market infrastructure; do not assume the same structure applies to overseas holdings.",
    },
  ],
  ISSUER_SPONSORED: [
    {
      label: "Registered holder",
      value: "You / your entity",
      detail: "The holding is recorded on the issuer-sponsored subregister.",
    },
    {
      label: "Identifier",
      value: "SRN",
      detail:
        "Issuer-sponsored holdings use a Securityholder Reference Number rather than a broker HIN.",
    },
    {
      label: "Market scope",
      value: "Issuer register",
      detail:
        "The issuer or its registry administers the issuer-sponsored holding.",
    },
  ],
  CUSTODIAL: [
    {
      label: "Registered holder",
      value: "Custodian / nominee",
      detail:
        "The provider or its custodian holds legal title while its records track your beneficial interest.",
    },
    {
      label: "Personal HIN",
      value: "Usually no",
      detail: "A custodial holding is not a personal CHESS-sponsored holding.",
    },
    {
      label: "Transfers",
      value: "Provider rules apply",
      detail:
        "Transfer processes and any fees depend on the provider, custodian and destination.",
    },
  ],
  DIRECT_REGISTRATION: [
    {
      label: "Registered holder",
      value: "You / your entity",
      detail: "The holding is registered directly in the holder's name.",
    },
    {
      label: "Identifier",
      value: "Registry-specific",
      detail:
        "The identifier and transfer process depend on the relevant registry.",
    },
    {
      label: "Transfers",
      value: "Registry process",
      detail:
        "Selling or transferring can follow a different process from broker-sponsored holdings.",
    },
  ],
  OMNIBUS: [
    {
      label: "Registered holder",
      value: "Nominee / custodian",
      detail:
        "Customer holdings are pooled under a nominee or custodian account.",
    },
    {
      label: "Personal HIN",
      value: "No",
      detail:
        "The investor is not individually registered under a personal HIN for that pooled holding.",
    },
    {
      label: "Records",
      value: "Provider ledger",
      detail:
        "The provider's records identify each customer's beneficial interest within the pooled holding.",
    },
  ],
  MIXED: [
    {
      label: "Structure",
      value: "Depends on market",
      detail:
        "More than one ownership structure is used. Inspect the market-specific record rather than applying one label to the whole platform.",
    },
  ],
  OTHER: [
    {
      label: "Structure",
      value: "See evidence",
      detail:
        "The recorded structure does not fit one of the standard categories used by this explorer.",
    },
  ],
  UNKNOWN: [
    {
      label: "Structure",
      value: "Not confirmed",
      detail:
        "Trading Guide has not confirmed the ownership structure against sufficient evidence.",
    },
  ],
};

export function custodyFacts(type: CustodyTypeDto): CustodyFact[] {
  return FACTS[type];
}

export function effectiveCustodyStatus(
  row: Pick<CustodyExplorerRow, "verificationStatus" | "reviewDueAt">,
  nowMs = Date.now()
): CustodyExplorerRow["verificationStatus"] {
  if (row.verificationStatus !== "VERIFIED") return row.verificationStatus;
  if (!row.reviewDueAt) return "VERIFIED";
  return new Date(row.reviewDueAt).getTime() < nowMs ? "STALE" : "VERIFIED";
}
