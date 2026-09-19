import type { AvailabilityStatus } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { formatAvailability } from "@/lib/share-trading/labels";

/**
 * CONDITIONAL/LIMITED must never collapse to a plain "Yes" — see the
 * master prompt's data-quality rule distinguishing UNKNOWN from
 * UNAVAILABLE, and CONDITIONAL from an unqualified YES. Mirrors
 * VerificationBadge's tone mapping so the two badge families read
 * consistently on the same page.
 */
export function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const label = formatAvailability(status);
  if (status === "AVAILABLE") return <Badge tone="green">{label}</Badge>;
  if (status === "UNAVAILABLE") return <Badge tone="red">{label}</Badge>;
  if (status === "CONDITIONAL" || status === "LIMITED")
    return <Badge tone="gold">{label}</Badge>;
  return <Badge tone="muted">{label}</Badge>;
}
