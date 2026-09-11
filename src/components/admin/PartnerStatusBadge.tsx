"use client"

import { Badge } from "@/components/ui/Badge";
import type { AffiliatePartnerStatus } from "@prisma/client";

const TONE: Record<AffiliatePartnerStatus, "muted" | "green" | "red" | "blue" | "gold"> = {
  PROSPECT: "muted",
  APPLIED: "blue",
  APPROVED: "gold",
  ACTIVE: "green",
  PAUSED: "gold",
  REJECTED: "red",
  ENDED: "red",
};

const LABEL: Record<AffiliatePartnerStatus, string> = {
  PROSPECT: "Prospect",
  APPLIED: "Applied",
  APPROVED: "Approved",
  ACTIVE: "Active",
  PAUSED: "Paused",
  REJECTED: "Rejected",
  ENDED: "Ended",
};

export function PartnerStatusBadge({ status }: { status: AffiliatePartnerStatus }) {
  return <Badge tone={TONE[status]}>{LABEL[status]}</Badge>;
}

1