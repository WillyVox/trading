import { OfferingType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CustodyExplorerRow } from "./types";

/**
 * Returns custody evidence exactly as stored for active share-trading
 * offerings. Unlike a calculator, the explorer may show unverified rows:
 * their status is part of the lesson and is never upgraded by the UI.
 */
export async function getCustodyExplorerRows(): Promise<CustodyExplorerRow[]> {
  const rows = await prisma.offeringCustody.findMany({
    where: {
      offering: { active: true, offeringType: OfferingType.SHARE_TRADING },
    },
    include: {
      market: true,
      offering: { include: { provider: { select: { name: true } } } },
    },
  });

  return rows
    .map((row) => ({
      id: row.id,
      offeringSlug: row.offering.slug,
      offeringName: row.offering.name,
      providerName: row.offering.provider.name,
      marketCode: row.market?.code ?? null,
      marketName: row.market?.name ?? null,
      custodyType: row.custodyType,
      hinSupported: row.hinSupported,
      custodianName: row.custodianName,
      description: row.description,
      sourceUrl: row.sourceUrl,
      verificationStatus: row.verificationStatus,
      verifiedAt: row.verifiedAt?.toISOString() ?? null,
    }))
    .sort(
      (a, b) =>
        a.offeringName.localeCompare(b.offeringName) ||
        (a.marketName ?? "").localeCompare(b.marketName ?? "")
    );
}
