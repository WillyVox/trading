import { Badge } from "@/components/ui/Badge";

export function VerificationBadge({ status }: { status: "VERIFIED" | "UNVERIFIED" | "STALE" }) {
  if (status === "VERIFIED") return <Badge tone="green">Verified</Badge>;
  if (status === "STALE") return <Badge tone="red">Stale</Badge>;
  return <Badge tone="muted">Unverified</Badge>;
}
