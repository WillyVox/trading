"use client";

import { useMemo, useState } from "react";
import { AssumptionsPanel } from "@/components/tools/shared/AssumptionsPanel";
import { CalculationBreakdown } from "@/components/tools/shared/CalculationBreakdown";
import { CalculationResult } from "@/components/tools/shared/CalculationResult";
import { SourceVerificationPanel } from "@/components/tools/shared/SourceVerificationPanel";
import { ToolPanel, ToolShell } from "@/components/tools/shared/ToolShell";
import { selectBrokerageRule } from "@/lib/tools/brokerage/calculate";
import type {
  BrokerageOfferingOption,
  BrokerageScenario,
} from "@/lib/tools/brokerage/types";
import { calculateRegularInvesting } from "@/lib/tools/regular-investing/calculate";
import type { InvestingFrequency } from "@/lib/tools/regular-investing/types";

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

const FREQUENCIES: { value: InvestingFrequency; label: string }[] = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "FORTNIGHTLY", label: "Fortnightly" },
  { value: "WEEKLY", label: "Weekly" },
];

export function RegularInvestingCalculator({
  offerings,
}: {
  offerings: BrokerageOfferingOption[];
}) {
  const [offeringSlug, setOfferingSlug] = useState(offerings[0]?.slug ?? "");
  const offering =
    offerings.find((item) => item.slug === offeringSlug) ?? offerings[0];
  const markets = useMemo(
    () =>
      Array.from(
        new Map(
          (offering?.rules ?? []).map((r) => [r.marketCode, r.marketName])
        ).entries()
      ),
    [offering]
  );
  const [marketCode, setMarketCode] = useState("");
  const effectiveMarket = markets.some(([code]) => code === marketCode)
    ? marketCode
    : (markets[0]?.[0] ?? "");
  const marketRules = (offering?.rules ?? []).filter(
    (r) => r.marketCode === effectiveMarket
  );
  const plans = Array.from(
    new Set(
      marketRules
        .map((r) => r.pricingPlan)
        .filter((v): v is string => Boolean(v))
    )
  );
  const [pricingPlan, setPricingPlan] = useState("");
  const effectivePlan = plans.includes(pricingPlan)
    ? pricingPlan
    : (plans[0] ?? null);
  const [contributionAmount, setContributionAmount] = useState("500");
  const [frequency, setFrequency] = useState<InvestingFrequency>("MONTHLY");
  const [years, setYears] = useState("1");
  const [firstBuy, setFirstBuy] = useState<boolean | null>(null);
  const [marginLoan, setMarginLoan] = useState<boolean | null>(null);

  const amount = Number(contributionAmount);
  const periodYears = Number(years);
  const relevant = marketRules.filter(
    (r) => !effectivePlan || !r.pricingPlan || r.pricingPlan === effectivePlan
  );
  const conditionCandidates = relevant.filter((r) => {
    const sideMatches =
      !r.tradeSide || r.tradeSide === "ANY" || r.tradeSide === "BUY";
    const minMatches = r.minTradeAmount == null || amount >= r.minTradeAmount;
    const maxMatches =
      r.maxTradeAmount == null ||
      (r.maxTradeAmountInclusive
        ? amount <= r.maxTradeAmount
        : amount < r.maxTradeAmount);
    return sideMatches && minMatches && maxMatches;
  });
  const asksFirstBuy = conditionCandidates.some(
    (r) => r.firstBuyPerSecurityPerDay != null
  );
  const asksMargin = conditionCandidates.some(
    (r) => r.excludesMarginLoanSettlement
  );
  const scenario: BrokerageScenario = {
    tradeAmount: amount,
    tradeSide: "BUY",
    firstBuyPerSecurityPerDay: firstBuy ?? false,
    marginLoanSettlement: marginLoan ?? false,
    pricingPlan: effectivePlan,
  };
  const requiredAnswersComplete =
    (!asksFirstBuy || firstBuy != null) && (!asksMargin || marginLoan != null);
  const rule = requiredAnswersComplete
    ? selectBrokerageRule(relevant, scenario)
    : undefined;
  const result = rule
    ? calculateRegularInvesting(rule, {
        contributionAmount: amount,
        frequency,
        years: periodYears,
      })
    : null;

  function changeOffering(slug: string) {
    setOfferingSlug(slug);
    setMarketCode("");
    setPricingPlan("");
    setFirstBuy(null);
    setMarginLoan(null);
  }

  return (
    <ToolShell>
      <ToolPanel labelledBy="regular-investing-inputs">
        <h2
          id="regular-investing-inputs"
          className="font-display text-navy text-xl font-bold"
        >
          Your hypothetical investing pattern
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Repeat the same contribution and see the brokerage covered by our
          verified pricing rules. This is not an investment-return projection.
        </p>
        <div className="mt-6 space-y-5">
          <label className="text-navy block text-sm font-semibold">
            Platform
            <select
              value={offering?.slug ?? ""}
              onChange={(e) => changeOffering(e.target.value)}
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            >
              {offerings.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          {markets.length > 0 && (
            <label className="text-navy block text-sm font-semibold">
              Market
              <select
                value={effectiveMarket}
                onChange={(e) => setMarketCode(e.target.value)}
                className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
              >
                {markets.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
              </select>
            </label>
          )}
          {plans.length > 1 && (
            <label className="text-navy block text-sm font-semibold">
              Pricing plan
              <select
                value={effectivePlan ?? ""}
                onChange={(e) => setPricingPlan(e.target.value)}
                className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
              >
                {plans.map((plan) => (
                  <option key={plan}>{plan}</option>
                ))}
              </select>
            </label>
          )}
          <label className="text-navy block text-sm font-semibold">
            Amount per investment
            <div className="border-border bg-background mt-2 flex min-h-11 items-center rounded-lg border">
              <span className="text-muted pl-3" aria-hidden>
                $
              </span>
              <input
                inputMode="decimal"
                type="number"
                min="0.01"
                step="0.01"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 outline-none"
              />
            </div>
          </label>
          <label className="text-navy block text-sm font-semibold">
            Frequency
            <select
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as InvestingFrequency)
              }
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            >
              {FREQUENCIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-navy block text-sm font-semibold">
            Period
            <select
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            >
              {[1, 2, 3, 5, 10].map((value) => (
                <option key={value} value={value}>
                  {value} {value === 1 ? "year" : "years"}
                </option>
              ))}
            </select>
          </label>
          {asksFirstBuy && (
            <fieldset>
              <legend className="text-navy text-sm font-semibold">
                Would each contribution be the first buy of this security that
                day?
              </legend>
              <p className="text-muted mt-1 text-xs leading-5">
                This matters only where a published concession has a
                first-buy-per-security-per-day condition.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {([true, false] as const).map((value) => (
                  <button
                    type="button"
                    key={String(value)}
                    aria-pressed={firstBuy === value}
                    onClick={() => setFirstBuy(value)}
                    className={`min-h-11 rounded-lg border px-3 text-sm ${firstBuy === value ? "border-navy bg-navy text-white" : "border-border bg-background text-navy"}`}
                  >
                    {value ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {asksMargin && (
            <fieldset>
              <legend className="text-navy text-sm font-semibold">
                Margin-loan settlement?
              </legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {([false, true] as const).map((value) => (
                  <button
                    type="button"
                    key={String(value)}
                    aria-pressed={marginLoan === value}
                    onClick={() => setMarginLoan(value)}
                    className={`min-h-11 rounded-lg border px-3 text-sm ${marginLoan === value ? "border-navy bg-navy text-white" : "border-border bg-background text-navy"}`}
                  >
                    {value ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      </ToolPanel>
      <ToolPanel labelledBy="regular-investing-result" live>
        <CalculationResult
          title="Estimated brokerage over the period"
          value={
            result?.status === "CALCULATED"
              ? money(result.totalBrokerage ?? 0, result.currency)
              : undefined
          }
          context={
            result?.status === "CALCULATED"
              ? `${result.contributionCount} equal investments totalling ${money(result.totalContributions, result.currency)}.`
              : undefined
          }
        >
          {!requiredAnswersComplete ? (
            <p className="text-muted mt-6 text-sm leading-6">
              Answer the conditional pricing question above to calculate this
              scenario without guessing.
            </p>
          ) : rule && result ? (
            <div className="mt-7 space-y-5 text-sm">
              {result.status === "CALCULATED" && (
                <div className="border-border grid gap-3 rounded-xl border p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-muted text-xs tracking-wide uppercase">
                      Per investment
                    </p>
                    <p className="text-navy mt-1 font-bold">
                      {money(
                        result.brokeragePerContribution ?? 0,
                        result.currency
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted text-xs tracking-wide uppercase">
                      Investments
                    </p>
                    <p className="text-navy mt-1 font-bold">
                      {result.contributionCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted text-xs tracking-wide uppercase">
                      Brokerage / contributions
                    </p>
                    <p className="text-navy mt-1 font-bold">
                      {result.effectiveBrokeragePercent?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              )}
              <CalculationBreakdown
                label={rule.label}
                expression={result.expression}
                explanation={result.explanation}
              />
              <AssumptionsPanel
                assumptions={[
                  `Every investment is assumed to be the same ${money(amount, rule.currency ?? undefined)} trade.`,
                  "The currently verified pricing rule is assumed to remain unchanged for the whole hypothetical period.",
                  ...(asksFirstBuy
                    ? [
                        firstBuy
                          ? "You indicated each contribution is the first buy of this security that day."
                          : "You indicated contributions are not necessarily the first buy of this security that day.",
                      ]
                    : []),
                ]}
                exclusions={[
                  "Investment returns, dividends, taxes, FX costs, spreads, market movement and other provider fees are not included.",
                  "This tool does not forecast future pricing or investment performance.",
                ]}
              />
              <SourceVerificationPanel
                sourceUrl={rule.sourceUrl}
                verifiedAt={rule.verifiedAt}
                reviewDueAt={rule.reviewDueAt}
                status={rule.verificationStatus}
              />
            </div>
          ) : (
            <p className="text-muted mt-6 text-sm leading-6">
              The selected scenario does not match a verified calculator-ready
              brokerage rule.
            </p>
          )}
        </CalculationResult>
      </ToolPanel>
    </ToolShell>
  );
}
