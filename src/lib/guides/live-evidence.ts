import "server-only";
import {
  calculateBrokerage,
  selectBrokerageRule,
} from "@/lib/tools/brokerage/calculate";
import { getBrokerageOfferings } from "@/lib/tools/brokerage/service";
import { calculateCryptoFee } from "@/lib/tools/crypto-fees/calculate";
import { getCryptoFeeOfferings } from "@/lib/tools/crypto-fees/service";
import type { EvidenceRow } from "@/components/guide/LiveEvidencePanel";

const money = (amount: number | undefined, currency?: string) =>
  amount == null ? "—" : `${currency ?? ""} ${amount.toFixed(2)}`.trim();

export async function brokerageWorkedExamples(): Promise<EvidenceRow[]> {
  const offerings = await getBrokerageOfferings();
  const amounts = [500, 1000, 5000];
  return offerings.flatMap((offering) => {
    const asx = offering.rules.filter(
      (rule) =>
        rule.marketCode === "ASX" && rule.verificationStatus === "VERIFIED"
    );
    if (!asx.length) return [];
    const cells = amounts.map((tradeAmount) => {
      const scenario = {
        tradeAmount,
        tradeSide: "BUY" as const,
        firstBuyPerSecurityPerDay: false,
        marginLoanSettlement: false,
      };
      const rule = selectBrokerageRule(asx, scenario);
      if (!rule)
        return {
          value: "Not modelled",
          detail: "No verified rule matches this standard buy scenario.",
        };
      const result = calculateBrokerage(rule, tradeAmount);
      return result.status === "CALCULATED"
        ? {
            value: money(result.amount, result.currency),
            detail: result.expression,
          }
        : {
            value: result.status === "VARIABLE" ? "Variable" : "Not calculated",
            detail: result.explanation,
          };
    });
    const sourceRule = asx.find((rule) => rule.sourceUrl) ?? asx[0];
    return [
      {
        label: offering.name,
        href: `/share-trading/${offering.slug}`,
        sourceUrl: sourceRule.sourceUrl,
        verifiedAt: sourceRule.verifiedAt,
        cells,
      },
    ];
  });
}

export async function cryptoWorkedExamples(): Promise<EvidenceRow[]> {
  const offerings = await getCryptoFeeOfferings();
  const preferred = ["INSTANT_BUY", "CRYPTO_TRADING", "TAKER", "MAKER"];
  const rows: EvidenceRow[] = [];
  for (const offering of offerings) {
    const verified = offering.rules.filter(
      (rule) =>
        rule.verificationStatus === "VERIFIED" &&
        preferred.includes(rule.category)
    );
    // Keep distinct execution paths visible. At most two rows/provider prevents a large fee schedule overwhelming the guide.
    const selected = [...verified]
      .sort(
        (a, b) => preferred.indexOf(a.category) - preferred.indexOf(b.category)
      )
      .slice(0, 2);
    for (const rule of selected) {
      const result = calculateCryptoFee(rule, {
        amount: 1000,
        rolling30DayVolume: 0,
        assetsOnPlatform: 0,
      });
      const value =
        result.status === "CALCULATED"
          ? money(result.amount, result.currency)
          : result.status === "VARIABLE"
            ? "Variable"
            : "Needs more input";
      rows.push({
        label: `${offering.name} — ${rule.label}`,
        href: `/crypto/exchanges/${offering.slug === "etoro-crypto" ? "etoro" : offering.slug.replace(/-exchange$/, "")}`,
        sourceUrl: rule.sourceUrl,
        verifiedAt: rule.verifiedAt,
        cells: [
          { value, detail: result.expression ?? result.explanation },
          {
            value: rule.category.replaceAll("_", " ").toLowerCase(),
            detail: rule.displayValue ?? undefined,
          },
        ],
      });
    }
  }
  return rows;
}
