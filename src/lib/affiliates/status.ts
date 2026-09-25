import type { AffiliatePartnerStatus } from "@prisma/client";

/**
 * Only these partnership statuses represent a genuine, live commercial
 * agreement. This is the single rule for "may a link go live":
 *  - the seed script refuses to seed an active link against anything else,
 *  - the admin can't create/activate a link against anything else,
 *  - /go/[offering] and every public lookup ignore links whose partnership
 *    isn't in this list, even if the link row itself says active.
 * Keeping the check at read time as well means a partnership that is later
 * PAUSED or ENDED stops monetising immediately, without anyone having to
 * remember to switch its links off.
 */
export const LIVE_PARTNERSHIP_STATUSES: readonly AffiliatePartnerStatus[] = [
  "APPROVED",
  "ACTIVE",
];

export function isLivePartnershipStatus(
  status: AffiliatePartnerStatus
): boolean {
  return LIVE_PARTNERSHIP_STATUSES.includes(status);
}
