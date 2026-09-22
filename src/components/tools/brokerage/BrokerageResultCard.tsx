import type {
  BrokerageCalculation,
  BrokerageRule,
} from "@/lib/tools/brokerage/types";
import {
  ToolResultPanel,
  PRICING_STATUS_LABEL,
} from "@/components/tools/shared/ToolResultPanel";

const BASIS_LABEL: Record<BrokerageRule["calculationBasis"], string> = {
  FLAT: "Flat brokerage",
  PERCENTAGE: "Percentage of trade value",
  GREATER_OF: "Greater of minimum or percentage",
  TIERED: "Published tier",
  FREE: "Free (eligible scenario)",
  VARIES: "Varies",
};

function money(amount: number, currency?: string) {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currency || "AUD",
    }).format(amount);
  } catch {
    return `${currency ?? ""} ${amount.toFixed(2)}`.trim();
  }
}

export function BrokerageResultCard({
  rule,
  result,
  context,
  assumptions,
  exclusions,
  fallbackMessage,
}: {
  rule: BrokerageRule | undefined;
  result: BrokerageCalculation | null;
  context?: string;
  assumptions: string[];
  exclusions: string[];
  fallbackMessage: string;
}) {
  const calculated = result?.status === "CALCULATED";
  const value =
    calculated && result
      ? money(result.amount ?? 0, result.currency)
      : undefined;

  if (!rule || !result || !calculated || !value) {
    return (
      <ToolResultPanel
        panelId="brokerage-result"
        eyebrow="Estimate brokerage"
        title="Estimated brokerage"
        exclusions={exclusions}
        sources={[]}
        hideBody
        fallbackMessage={fallbackMessage}
      />
    );
  }

  return (
    <ToolResultPanel
      panelId="brokerage-result"
      eyebrow="Estimate brokerage"
      title="Estimated brokerage"
      value={value}
      heroCaption="Estimated brokerage for this scenario"
      context={context}
      rows={[
        { label: "Applicable rule", value: rule.label },
        {
          label: "Calculation",
          value: `${BASIS_LABEL[rule.calculationBasis] ?? "Published rule"} → ${value}`,
        },
        {
          label: "Pricing status",
          value: PRICING_STATUS_LABEL[rule.verificationStatus],
        },
      ]}
      explanation={result.explanation}
      assumptions={assumptions}
      exclusions={exclusions}
      sources={[
        {
          sourceUrl: rule.sourceUrl,
          verifiedAt: rule.verifiedAt,
          reviewDueAt: rule.reviewDueAt,
          status: rule.verificationStatus,
        },
      ]}
    />
  );
}
