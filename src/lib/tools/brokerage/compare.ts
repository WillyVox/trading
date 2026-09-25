import { brokerageEligibility } from "./eligibility";
import { calculateBrokerage, selectBrokerageRule } from "./calculate";
import type {
  BrokerageOfferingOption,
  BrokerageRule,
  BrokerageScenario,
} from "./types";

export type BrokerageComparisonResult = {
  offeringSlug: string;
  offeringName: string;
  providerName: string;
  status: "CALCULATED" | "UNAVAILABLE";
  amount: number | null;
  currency: string | null;
  ruleLabel: string | null;
  explanation: string;
  sourceUrl: string | null;
  verifiedAt: string | null;
};

/**
 * The comparison scenario deliberately models one common retail case rather
 * than silently choosing provider-specific options that are not equivalent.
 *
 * ASX assumptions:
 * - online order
 * - buy order
 * - first eligible buy of the security that day
 * - no margin-loan settlement
 * - Standard plan where a provider names one; Fixed for IBKR
 * - CommSec uses its online CDIA/Margin Loan schedule as the explicit standard
 *   settlement scenario (while marginLoanSettlement=false prevents rules that
 *   exclude margin settlement from being selected elsewhere)
 */
export function representativeAsxScenario(
  tradeAmount: number,
  pricingPlan?: string | null
): BrokerageScenario {
  return {
    tradeAmount,
    tradeSide: "BUY",
    firstBuyPerSecurityPerDay: true,
    marginLoanSettlement: false,
    pricingPlan: pricingPlan ?? null,
  };
}

function preferredPlan(rules: BrokerageRule[]) {
  const plans = [...new Set(rules.map((rule) => rule.pricingPlan).filter(Boolean))] as string[];
  if (plans.includes("Standard")) return "Standard";
  if (plans.includes("Fixed")) return "Fixed";
  return plans[0] ?? null;
}

function asxRules(offering: BrokerageOfferingOption) {
  const rules = offering.rules.filter((rule) => rule.marketCode === "ASX");
  const standardSettlement = rules.filter(
    (rule) =>
      rule.channel == null || rule.channel === "ONLINE_STANDARD_SETTLEMENT"
  );
  return standardSettlement.length > 0 ? standardSettlement : rules;
}

export function compareRepresentativeAsxBrokerage(
  offerings: BrokerageOfferingOption[],
  tradeAmount: number,
  now = new Date()
): BrokerageComparisonResult[] {
  return offerings.map((offering) => {
    const rules = asxRules(offering);
    const eligibleRules = rules.filter(
      (rule) => brokerageEligibility(rule, now).eligible
    );
    const scenario = representativeAsxScenario(
      tradeAmount,
      preferredPlan(eligibleRules)
    );
    const rule = selectBrokerageRule(eligibleRules, scenario);

    if (!rule) {
      const variableRule = rules.find(
        (candidate) => candidate.calculationBasis === "VARIES"
      );
      return {
        offeringSlug: offering.slug,
        offeringName: offering.name,
        providerName: offering.providerName,
        status: "UNAVAILABLE",
        amount: null,
        currency: variableRule?.currency ?? null,
        ruleLabel: variableRule?.label ?? null,
        explanation:
          variableRule?.displayValue ??
          offering.reason ??
          "No verified calculator-ready ASX brokerage rule matches this representative scenario.",
        sourceUrl: variableRule?.sourceUrl ?? null,
        verifiedAt: variableRule?.verifiedAt ?? null,
      };
    }

    const calculation = calculateBrokerage(rule, tradeAmount);
    if (calculation.status !== "CALCULATED") {
      return {
        offeringSlug: offering.slug,
        offeringName: offering.name,
        providerName: offering.providerName,
        status: "UNAVAILABLE",
        amount: null,
        currency: rule.currency,
        ruleLabel: rule.label,
        explanation: calculation.explanation,
        sourceUrl: rule.sourceUrl,
        verifiedAt: rule.verifiedAt,
      };
    }

    return {
      offeringSlug: offering.slug,
      offeringName: offering.name,
      providerName: offering.providerName,
      status: "CALCULATED",
      amount: calculation.amount ?? null,
      currency: calculation.currency ?? rule.currency,
      ruleLabel: rule.label,
      explanation: calculation.explanation,
      sourceUrl: rule.sourceUrl,
      verifiedAt: rule.verifiedAt,
    };
  });
}
