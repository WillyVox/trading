import { brokerageEligibility } from "./eligibility";
import { calculateBrokerage, selectBrokerageRule } from "./calculate";
import type { BrokerageOfferingOption, BrokerageRule, BrokerageScenario } from "./types";
import { calculateFxFee } from "../fx/calculate";
import { selectFxRuleForMarket } from "../fx/selection";
import type { FxOfferingOption } from "../fx/types";

export type UsCostComparisonResult = {
  offeringSlug: string;
  offeringName: string;
  providerName: string;
  status: "COMPLETE_COMPONENTS" | "PARTIAL" | "UNAVAILABLE";
  brokerageAmount: number | null;
  brokerageCurrency: string | null;
  brokerageLabel: string | null;
  brokerageExplanation: string;
  brokerageSourceUrl: string | null;
  brokerageVerifiedAt: string | null;
  fxAmount: number | null;
  fxCurrency: string | null;
  fxLabel: string | null;
  fxExplanation: string;
  fxSourceUrl: string | null;
  fxVerifiedAt: string | null;
};

function usRules(offering: BrokerageOfferingOption) {
  const nyse = offering.rules.filter((rule) => rule.marketCode === "NYSE");
  return nyse.length ? nyse : offering.rules.filter((rule) => rule.marketCode === "NASDAQ");
}

function preferredPlan(rules: BrokerageRule[]) {
  const plans = [...new Set(rules.map((rule) => rule.pricingPlan).filter(Boolean))] as string[];
  if (plans.includes("Standard")) return "Standard";
  if (plans.includes("Fixed")) return "Fixed";
  return plans[0] ?? null;
}

export function compareRepresentativeUsCosts(
  brokerageOfferings: BrokerageOfferingOption[],
  fxOfferings: FxOfferingOption[],
  audInvestmentAmount: number,
  now = new Date()
): UsCostComparisonResult[] {
  const fxBySlug = new Map(fxOfferings.map((offering) => [offering.slug, offering]));

  return brokerageOfferings.map((offering) => {
    const rules = usRules(offering);
    const eligible = rules.filter((rule) => brokerageEligibility(rule, now).eligible);
    const scenario: BrokerageScenario = {
      tradeAmount: audInvestmentAmount,
      tradeSide: "BUY",
      firstBuyPerSecurityPerDay: false,
      marginLoanSettlement: false,
      pricingPlan: preferredPlan(eligible),
    };
    const brokerageRule = selectBrokerageRule(eligible, scenario);
    const variableBrokerage = rules.find((rule) => rule.calculationBasis === "VARIES");
    const brokerage = brokerageRule
      ? calculateBrokerage(brokerageRule, audInvestmentAmount)
      : null;

    const fxOffering = fxBySlug.get(offering.slug);
    const fxRule = fxOffering
      ? selectFxRuleForMarket(fxOffering.rules, "NYSE", now)
      : undefined;
    const fx = fxRule ? calculateFxFee(audInvestmentAmount, fxRule) : null;

    const brokerageCalculated = brokerage?.status === "CALCULATED";
    const fxCalculated = fx?.status === "CALCULATED";
    const hasKnownComponent = brokerageCalculated || fxCalculated;

    return {
      offeringSlug: offering.slug,
      offeringName: offering.name,
      providerName: offering.providerName,
      status:
        brokerageCalculated && fxCalculated
          ? "COMPLETE_COMPONENTS"
          : hasKnownComponent
            ? "PARTIAL"
            : "UNAVAILABLE",
      brokerageAmount: brokerageCalculated ? (brokerage.amount ?? null) : null,
      brokerageCurrency: brokerageCalculated
        ? (brokerage.currency ?? brokerageRule?.currency ?? null)
        : (variableBrokerage?.currency ?? brokerageRule?.currency ?? null),
      brokerageLabel: brokerageRule?.label ?? variableBrokerage?.label ?? null,
      brokerageExplanation:
        brokerage?.explanation ??
        variableBrokerage?.displayValue ??
        offering.reason ??
        "No verified calculator-ready US brokerage rule is available.",
      brokerageSourceUrl: brokerageRule?.sourceUrl ?? variableBrokerage?.sourceUrl ?? null,
      brokerageVerifiedAt: brokerageRule?.verifiedAt ?? variableBrokerage?.verifiedAt ?? null,
      fxAmount: fxCalculated ? (fx.amount ?? null) : null,
      fxCurrency: fxCalculated ? (fx.currency ?? "AUD") : (fxRule?.currency ?? null),
      fxLabel: fxRule?.label ?? null,
      fxExplanation:
        fx?.message ??
        fxRule?.displayValue ??
        fxOffering?.reason ??
        "No verified FX rule is available for this scenario.",
      fxSourceUrl: fxRule?.sourceUrl ?? null,
      fxVerifiedAt: fxRule?.verifiedAt ?? null,
    };
  });
}
