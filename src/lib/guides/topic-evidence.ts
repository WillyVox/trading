import "server-only";
import { OfferingType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCustodyExplorerRows } from "@/lib/tools/custody/service";
import { getCryptoFeeOfferings } from "@/lib/tools/crypto-fees/service";
import type { EvidenceRow } from "@/components/guide/LiveEvidencePanel";

const custodyLabel: Record<string, string> = {
  CHESS_SPONSORED: "CHESS sponsored",
  ISSUER_SPONSORED: "Issuer sponsored",
  CUSTODIAL: "Custodial",
  DIRECT_REGISTRATION: "Direct registration",
  OMNIBUS: "Omnibus",
  MIXED: "Mixed",
  OTHER: "Other",
  UNKNOWN: "Not yet confirmed",
};

const providerHref = (slug: string) => `/share-trading/${slug}`;
const cryptoHref = (slug: string) => `/crypto/exchanges/${slug}`;

export async function custodyEvidenceRows(): Promise<EvidenceRow[]> {
  const rows = await getCustodyExplorerRows();
  return rows
    .filter((row) => row.verificationStatus === "VERIFIED")
    .map((row) => ({
      label: row.offeringName,
      href: providerHref(row.offeringSlug),
      sourceUrl: row.sourceUrl,
      verifiedAt: row.verifiedAt,
      cells: [
        {
          value: row.marketCode ?? "Offering-wide",
          detail: row.marketName ?? undefined,
        },
        {
          value: custodyLabel[row.custodyType] ?? row.custodyType,
          detail: row.description ?? undefined,
        },
        {
          value:
            row.hinSupported === true
              ? "HIN supported"
              : row.hinSupported === false
                ? "No personal HIN"
                : "Not yet confirmed",
          detail: row.custodianName
            ? `Custodian: ${row.custodianName}`
            : undefined,
        },
      ],
    }));
}

export async function hinEvidenceRows(): Promise<EvidenceRow[]> {
  const rows = await getCustodyExplorerRows();
  return rows
    .filter(
      (row) => row.verificationStatus === "VERIFIED" && row.marketCode === "ASX"
    )
    .map((row) => ({
      label: row.offeringName,
      href: providerHref(row.offeringSlug),
      sourceUrl: row.sourceUrl,
      verifiedAt: row.verifiedAt,
      cells: [
        { value: custodyLabel[row.custodyType] ?? row.custodyType },
        {
          value:
            row.hinSupported === true
              ? "Yes"
              : row.hinSupported === false
                ? "No"
                : "Not yet confirmed",
          detail: row.description ?? undefined,
        },
      ],
    }));
}

export async function fractionalEvidenceRows(): Promise<EvidenceRow[]> {
  const facts = await prisma.offeringProsCon.findMany({
    where: {
      offering: { active: true, offeringType: OfferingType.SHARE_TRADING },
    },
    include: { offering: true },
    orderBy: [{ offering: { name: "asc" } }, { position: "asc" }],
  });
  return facts
    .filter(
      (fact) =>
        fact.verificationStatus === "VERIFIED" &&
        `${fact.label} ${fact.detail ?? ""}`
          .toLowerCase()
          .includes("fractional")
    )
    .map((fact) => ({
      label: fact.offering.name,
      href: providerHref(fact.offering.slug),
      sourceUrl: fact.sourceUrl,
      verifiedAt: fact.verifiedAt?.toISOString() ?? null,
      cells: [
        {
          value:
            fact.type === "LIMITATION"
              ? "Documented limitation"
              : "Documented capability",
          detail: fact.label,
        },
        {
          value:
            fact.detail ??
            "See the official source for the current fractional-share terms.",
        },
      ],
    }));
}

function feeValue(
  rule: Awaited<
    ReturnType<typeof getCryptoFeeOfferings>
  >[number]["rules"][number]
) {
  if (rule.calculationBasis === "FREE") return "Free";
  if (rule.calculationBasis === "FLAT" && rule.flatAmount != null)
    return `${rule.currency ?? ""} ${rule.flatAmount.toFixed(2)}`.trim();
  if (rule.calculationBasis === "PERCENTAGE" && rule.percentage != null)
    return `${rule.percentage}%`;
  if (rule.calculationBasis === "VARIES") return rule.displayValue || "Varies";
  if (rule.calculationBasis === "TIERED") return rule.displayValue || "Tiered";
  return rule.displayValue || "See rule";
}

export async function cryptoFundingEvidenceRows(): Promise<EvidenceRow[]> {
  const offerings = await getCryptoFeeOfferings();
  return offerings.flatMap((offering) =>
    offering.rules
      .filter(
        (rule) =>
          rule.verificationStatus === "VERIFIED" &&
          ["FIAT_DEPOSIT", "FIAT_WITHDRAWAL", "CRYPTO_WITHDRAWAL"].includes(
            rule.category
          )
      )
      .map((rule) => ({
        label: `${offering.name} — ${rule.label}`,
        href: cryptoHref(offering.slug),
        sourceUrl: rule.sourceUrl,
        verifiedAt: rule.verifiedAt,
        cells: [
          { value: rule.category.replaceAll("_", " ").toLowerCase() },
          {
            value: feeValue(rule),
            detail: rule.notes ?? rule.displayValue ?? undefined,
          },
        ],
      }))
  );
}

export async function tradingCostCoverageRows(): Promise<EvidenceRow[]> {
  const shareFees = await prisma.offeringFee.findMany({
    where: {
      isPromotional: false,
      verificationStatus: "VERIFIED",
      offering: { active: true, offeringType: OfferingType.SHARE_TRADING },
      feeCategory: { in: ["BROKERAGE", "FX_CONVERSION"] },
    },
    include: { offering: true },
    orderBy: [{ offering: { name: "asc" } }],
  });
  const byOffering = new Map<string, typeof shareFees>();
  for (const fee of shareFees)
    byOffering.set(fee.offeringId, [
      ...(byOffering.get(fee.offeringId) ?? []),
      fee,
    ]);
  const shareRows: EvidenceRow[] = [...byOffering.values()].map((fees) => {
    const first = fees[0];
    const brokerage = fees.some((fee) => fee.feeCategory === "BROKERAGE");
    const fx = fees.some((fee) => fee.feeCategory === "FX_CONVERSION");
    const source = fees.find((fee) => fee.sourceUrl) ?? first;
    const latest = fees
      .map((fee) => fee.verifiedAt)
      .filter(Boolean)
      .sort((a, b) => b!.getTime() - a!.getTime())[0];
    return {
      label: first.offering.name,
      href: providerHref(first.offering.slug),
      sourceUrl: source.sourceUrl,
      verifiedAt: latest?.toISOString() ?? null,
      cells: [
        { value: brokerage ? "Brokerage evidence" : "—" },
        { value: fx ? "FX evidence" : "Not currently verified" },
      ],
    };
  });

  const cryptoOfferings = await getCryptoFeeOfferings();
  const cryptoRows: EvidenceRow[] = cryptoOfferings.flatMap((offering) => {
    const verified = offering.rules.filter(
      (rule) => rule.verificationStatus === "VERIFIED"
    );
    if (!verified.length) return [];
    const trading = verified.some((rule) =>
      ["CRYPTO_TRADING", "MAKER", "TAKER", "INSTANT_BUY"].includes(
        rule.category
      )
    );
    const funding = verified.some((rule) =>
      ["FIAT_DEPOSIT", "FIAT_WITHDRAWAL", "CRYPTO_WITHDRAWAL"].includes(
        rule.category
      )
    );
    const source = verified.find((rule) => rule.sourceUrl) ?? verified[0];
    return [
      {
        label: offering.name,
        href: cryptoHref(offering.slug),
        sourceUrl: source.sourceUrl,
        verifiedAt: source.verifiedAt,
        cells: [
          {
            value: trading ? "Trading-fee evidence" : "Not currently verified",
          },
          {
            value: funding
              ? "Funding/withdrawal evidence"
              : "Not currently verified",
          },
        ],
      },
    ];
  });
  return [...shareRows, ...cryptoRows];
}
