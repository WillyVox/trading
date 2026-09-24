import type { VerificationStatus } from "@prisma/client";

/** Presentation-only model consumed by shared comparison UI components. */
export type CompareSubject = {
  id: string;
  slug: string;
  name: string;
  verificationStatus: VerificationStatus;
  profileHref: string;
  logo: string | null;
  cta: {
    href: string;
    isAffiliate: boolean;
    destinationType: "affiliate" | "official";
    providerSlug: string;
    placement: string;
  } | null;
};

export type CompareRow = {
  key: string;
  label: string;
  values: (string | null)[];
};

export type CompareSection = {
  title: string;
  rows: CompareRow[];
};
