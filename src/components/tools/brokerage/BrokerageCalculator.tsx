"use client";

import { useMemo, useState } from "react";
import {
  calculateBrokerage,
  selectBrokerageRule,
} from "@/lib/tools/brokerage/calculate";
import type {
  BrokerageOfferingOption,
  BrokerageScenario,
} from "@/lib/tools/brokerage/types";
import { ToolShell, ToolPanel } from "@/components/tools/shared/ToolShell";
import { BrokerageResultCard } from "@/components/tools/brokerage/BrokerageResultCard";

const AVAILABILITY = {
  CALCULATABLE: "",
  NEEDS_INPUT: "",
  STALE: "Pricing needs verification",
  UNAVAILABLE: "Calculation unavailable",
} as const;

export function BrokerageCalculator({
  offerings,
}: {
  offerings: BrokerageOfferingOption[];
}) {
  const [offeringSlug, setOfferingSlug] = useState(offerings[0]?.slug ?? "");
  const offering =
    offerings.find((o) => o.slug === offeringSlug) ?? offerings[0];
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
  const effectiveMarket = markets.some(([c]) => c === marketCode)
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
  const [tradeAmount, setTradeAmount] = useState("2000");
  const [tradeSide, setTradeSide] = useState<"BUY" | "SELL">("BUY");
  const [firstBuy, setFirstBuy] = useState(true);
  const [marginLoan, setMarginLoan] = useState(false);
  const amount = Number(tradeAmount);
  const relevant = marketRules.filter(
    (r) => !effectivePlan || !r.pricingPlan || r.pricingPlan === effectivePlan
  );
  // Only ask conditional questions when they can change the result for the current
  // amount/order. This keeps simple trades simple while exposing CMC-style
  // first-buy conditions exactly when they matter.
  const conditionCandidates = relevant.filter((r) => {
    const sideMatches =
      !r.tradeSide || r.tradeSide === "ANY" || r.tradeSide === tradeSide;
    const minMatches = r.minTradeAmount == null || amount >= r.minTradeAmount;
    const maxMatches =
      r.maxTradeAmount == null ||
      (r.maxTradeAmountInclusive
        ? amount <= r.maxTradeAmount
        : amount < r.maxTradeAmount);
    return sideMatches && minMatches && maxMatches;
  });
  const asksFirstBuy =
    tradeSide === "BUY" &&
    conditionCandidates.some((r) => r.firstBuyPerSecurityPerDay != null);
  const asksMargin = conditionCandidates.some(
    (r) => r.excludesMarginLoanSettlement
  );
  const scenario: BrokerageScenario = {
    tradeAmount: amount,
    tradeSide,
    firstBuyPerSecurityPerDay: firstBuy,
    marginLoanSettlement: marginLoan,
    pricingPlan: effectivePlan,
  };
  const rule = selectBrokerageRule(relevant, scenario);
  const result = rule ? calculateBrokerage(rule, amount) : null;
  const noMatch =
    (offering?.availability === "UNAVAILABLE" ? offering.reason : null) ??
    "The selected scenario does not match a verified calculator-ready pricing rule.";
  function changeOffering(slug: string) {
    setOfferingSlug(slug);
    setMarketCode("");
    setPricingPlan("");
  }
  return (
    <ToolShell>
      <ToolPanel labelledBy="brokerage-inputs">
        <h2
          id="brokerage-inputs"
          className="font-display text-navy text-xl font-bold"
        >
          Your hypothetical trade
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          All relevant platforms stay visible. Where pricing needs more context,
          we ask for it rather than guessing.
        </p>
        <div className="mt-6 space-y-5">
          <label className="text-navy block text-sm font-semibold">
            Platform
            <select
              value={offering?.slug ?? ""}
              onChange={(e) => changeOffering(e.target.value)}
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            >
              {offerings.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.name}
                  {AVAILABILITY[o.availability]
                    ? ` — ${AVAILABILITY[o.availability]}`
                    : ""}
                </option>
              ))}
            </select>
          </label>
          {(offering?.availability === "UNAVAILABLE" ||
            offering?.availability === "STALE") && (
            <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              {offering.reason ?? "Calculation unavailable for this platform."}
            </p>
          )}
          {markets.length > 0 && (
            <label className="text-navy block text-sm font-semibold">
              Market
              <select
                value={effectiveMarket}
                onChange={(e) => setMarketCode(e.target.value)}
                className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
              >
                {markets.map(([c, n]) => (
                  <option key={c} value={c}>
                    {n} ({c})
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
                {plans.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
          )}
          <fieldset>
            <legend className="text-navy text-sm font-semibold">
              Order type
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["BUY", "SELL"] as const).map((side) => (
                <button
                  type="button"
                  key={side}
                  aria-pressed={tradeSide === side}
                  onClick={() => setTradeSide(side)}
                  className={`min-h-11 rounded-lg border px-3 text-sm ${tradeSide === side ? "border-navy bg-navy text-white" : "border-border bg-background text-navy"}`}
                >
                  {side === "BUY" ? "Buy" : "Sell"}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="text-navy block text-sm font-semibold">
            Trade amount
            <div className="border-border bg-background mt-2 flex min-h-11 items-center rounded-lg border">
              <span className="text-muted pl-3" aria-hidden>
                $
              </span>
              <input
                inputMode="decimal"
                type="number"
                min="0.01"
                step="0.01"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 outline-none"
              />
            </div>
          </label>
          {asksFirstBuy && (
            <fieldset>
              <legend className="text-navy text-sm font-semibold">
                Is this the first buy of this security today?
              </legend>
              <p className="text-muted mt-1 text-xs leading-5">
                Some published concessions apply only to the first eligible buy
                of each security per day.
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
              <p className="text-muted mt-1 text-xs leading-5">
                Some published concessions exclude trades settled through a
                margin loan.
              </p>
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
      <ToolPanel labelledBy="brokerage-result" live>
        <BrokerageResultCard
          rule={rule}
          result={result}
          context={
            result?.status === "CALCULATED"
              ? `For this ${tradeSide.toLowerCase()} scenario${effectivePlan ? ` using ${effectivePlan} pricing` : ""}.`
              : undefined
          }
          assumptions={[
            ...(rule?.notes ? [rule.notes] : []),
            ...(asksFirstBuy && tradeSide === "BUY"
              ? [
                  firstBuy
                    ? "You indicated this is the first buy of this security today."
                    : "You indicated this is not the first buy of this security today.",
                ]
              : []),
          ]}
          exclusions={[
            "Taxes, market movement, FX costs and other fees are excluded unless the selected rule explicitly includes them.",
            ...(rule?.gstPercent
              ? [
                  `This estimate includes ${rule.gstPercent}% GST on the published pre-GST brokerage.`,
                ]
              : []),
          ]}
          fallbackMessage={noMatch}
        />
      </ToolPanel>
    </ToolShell>
  );
}
