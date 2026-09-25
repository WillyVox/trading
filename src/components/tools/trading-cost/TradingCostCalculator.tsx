"use client";

import { getDefaultMarketCode } from "@/lib/tools/markets/default-market";
import { useState } from "react";
import { ToolPanel, ToolShell } from "@/components/tools/shared/ToolShell";
import { ToolResultPanel } from "@/components/tools/shared/ToolResultPanel";
import {
  calculateBrokerage,
  selectBrokerageRule,
} from "@/lib/tools/brokerage/calculate";
import type {
  BrokerageOfferingOption,
  BrokerageScenario,
} from "@/lib/tools/brokerage/types";
import { calculateFxFee } from "@/lib/tools/fx/calculate";
import type { FxOfferingOption } from "@/lib/tools/fx/types";
import { selectFxRuleForMarket } from "@/lib/tools/fx/selection";
import { combineTradingCosts } from "@/lib/tools/trading-cost/calculate";

function money(amount: number, currency = "AUD") {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function TradingCostCalculator({
  brokerageOfferings,
  fxOfferings,
}: {
  brokerageOfferings: BrokerageOfferingOption[];
  fxOfferings: FxOfferingOption[];
}) {
  const fxBySlug = new Map(fxOfferings.map((o) => [o.slug, o]));

  const supported = brokerageOfferings.filter((o) => o.rules.length > 0);
  const [slug, setSlug] = useState(supported[0]?.slug ?? "");
  const offering = supported.find((o) => o.slug === slug) ?? supported[0];
  const markets = Array.from(
    new Map(
      (offering?.rules ?? []).map((r) => [r.marketCode, r.marketName])
    ).entries()
  );

  const [marketCode, setMarketCode] = useState("");
  const effectiveMarket = markets.some(([code]) => code === marketCode)
    ? marketCode
    : getDefaultMarketCode(markets.map(([code]) => code));
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
  const [plan, setPlan] = useState("");
  const effectivePlan = plans.includes(plan) ? plan : (plans[0] ?? null);
  const [amountText, setAmountText] = useState("5000");
  const [tradeSide, setTradeSide] = useState<"BUY" | "SELL">("BUY");
  const [firstBuy, setFirstBuy] = useState(true);
  const [marginLoan, setMarginLoan] = useState(false);
  const [includeFx, setIncludeFx] = useState(true);
  const amount = Number(amountText);
  const relevant = marketRules.filter(
    (r) => !effectivePlan || !r.pricingPlan || r.pricingPlan === effectivePlan
  );
  const candidates = relevant.filter(
    (r) =>
      (!r.tradeSide || r.tradeSide === "ANY" || r.tradeSide === tradeSide) &&
      (r.minTradeAmount == null || amount >= r.minTradeAmount) &&
      (r.maxTradeAmount == null ||
        (r.maxTradeAmountInclusive
          ? amount <= r.maxTradeAmount
          : amount < r.maxTradeAmount))
  );
  const asksFirstBuy =
    tradeSide === "BUY" &&
    candidates.some((r) => r.firstBuyPerSecurityPerDay != null);
  const asksMargin = candidates.some((r) => r.excludesMarginLoanSettlement);
  const complete =
    (!asksFirstBuy || firstBuy != null) && (!asksMargin || marginLoan != null);
  const scenario: BrokerageScenario = {
    tradeAmount: amount,
    tradeSide,
    firstBuyPerSecurityPerDay: firstBuy ?? false,
    marginLoanSettlement: marginLoan ?? false,
    pricingPlan: effectivePlan,
  };
  const rule = complete ? selectBrokerageRule(relevant, scenario) : undefined;
  const brokerage = rule ? calculateBrokerage(rule, amount) : null;
  const fxOffering = offering ? fxBySlug.get(offering.slug) : undefined;
  const fxRule = fxOffering
    ? selectFxRuleForMarket(fxOffering.rules, effectiveMarket)
    : undefined;
  const fx = includeFx && fxRule ? calculateFxFee(amount, fxRule) : null;
  const combined = combineTradingCosts(brokerage, fx);

  function changePlatform(next: string) {
    setSlug(next);
    setMarketCode("");
    setPlan("");
    setFirstBuy(true);
    setMarginLoan(false);
  }

  return (
    <ToolShell>
      <ToolPanel labelledBy="trading-cost-inputs">
        <h2
          id="trading-cost-inputs"
          className="font-display text-navy text-xl font-bold"
        >
          Hypothetical trade
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Combine calculator-ready brokerage and FX components without treating
          unknown costs as zero.
        </p>
        <div className="mt-6 space-y-5">
          <label className="text-navy block text-sm font-semibold">
            Platform
            <select
              value={offering?.slug ?? ""}
              onChange={(e) => changePlatform(e.target.value)}
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            >
              {supported.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-navy block text-sm font-semibold">
            Market
            <select
              value={effectiveMarket}
              onChange={(e) => {
                setMarketCode(e.target.value);
                setFirstBuy(true);
                setMarginLoan(false);
              }}
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            >
              {markets.map(([code, name]) => (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              ))}
            </select>
          </label>
          {plans.length > 1 && (
            <label className="text-navy block text-sm font-semibold">
              Pricing plan
              <select
                value={effectivePlan ?? ""}
                onChange={(e) => {
                  setPlan(e.target.value);
                  setFirstBuy(true);
                  setMarginLoan(false);
                }}
                className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
              >
                {plans.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
          )}
          <fieldset>
            <legend className="text-navy text-sm font-semibold">Order</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["BUY", "SELL"] as const).map((side) => (
                <button
                  key={side}
                  type="button"
                  aria-pressed={tradeSide === side}
                  onClick={() => {
                    setTradeSide(side);
                    setFirstBuy(true);
                    setMarginLoan(false);
                  }}
                  className={`min-h-11 rounded-lg border px-3 text-sm ${tradeSide === side ? "border-navy bg-navy text-white" : "border-border bg-background text-navy"}`}
                >
                  {side === "BUY" ? "Buy" : "Sell"}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="text-navy block text-sm font-semibold">
            Trade / conversion amount
            <div className="border-border bg-background mt-2 flex min-h-11 items-center rounded-lg border">
              <span className="text-muted pl-3">A$</span>
              <input
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                value={amountText}
                onChange={(e) => setAmountText(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 outline-none"
              />
            </div>
            <span className="text-muted mt-1 block text-xs font-normal">
              Used as the brokerage trade value and, when enabled, the AUD
              amount converted for the FX estimate.
            </span>
          </label>
          {asksFirstBuy && (
            <fieldset>
              <legend className="text-navy text-sm font-semibold">
                First buy of this security today?
              </legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {([true, false] as const).map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    aria-pressed={firstBuy === v}
                    onClick={() => setFirstBuy(v)}
                    className={`min-h-11 rounded-lg border px-3 text-sm ${firstBuy === v ? "border-navy bg-navy text-white" : "border-border bg-background text-navy"}`}
                  >
                    {v ? "Yes" : "No"}
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
                {([false, true] as const).map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    aria-pressed={marginLoan === v}
                    onClick={() => setMarginLoan(v)}
                    className={`min-h-11 rounded-lg border px-3 text-sm ${marginLoan === v ? "border-navy bg-navy text-white" : "border-border bg-background text-navy"}`}
                  >
                    {v ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <label className="border-border flex items-start gap-3 rounded-lg border p-3 text-sm">
            <input
              type="checkbox"
              checked={includeFx}
              disabled={!fxOffering}
              onChange={(e) => setIncludeFx(e.target.checked)}
              className="mt-1"
            />
            <span>
              <strong className="text-navy">
                Include published FX conversion cost
              </strong>
              <span className="text-muted mt-1 block">
                {fxOffering
                  ? "Uses this platform's verified FX rule."
                  : "No calculator-ready FX record is available for this platform."}
              </span>
            </span>
          </label>
        </div>
      </ToolPanel>
      <ToolPanel labelledBy="trading-cost-result" live>
        {!complete ? (
          <ToolResultPanel
            panelId="trading-cost-result"
            eyebrow="Estimate"
            title="Estimated costs covered"
            exclusions={[
              "Exchange-rate movement, taxes other than GST explicitly represented by the brokerage rule, market/regulatory fees, spreads not represented by the selected FX rule, deposit/withdrawal fees and other provider charges.",
            ]}
            sources={[]}
            hideBody
            fallbackTitle="Answer the pricing question to continue"
            fallbackMessage="Answer the conditional pricing question to calculate without guessing."
          />
        ) : (
          <ToolResultPanel
            panelId="trading-cost-result"
            eyebrow="Estimate"
            title="Estimated costs covered"
            value={
              combined.canTotal && combined.totalAmount != null
                ? money(combined.totalAmount, combined.totalCurrency)
                : undefined
            }
            heroCaption="Combined total for this scenario"
            fallbackTitle="Combined total not shown"
            fallbackMessage={combined.message}
            rows={[
              {
                label: "Brokerage",
                value:
                  brokerage?.status === "CALCULATED" && brokerage.amount != null
                    ? money(brokerage.amount, brokerage.currency)
                    : "Not calculatable",
              },
              ...(includeFx
                ? [
                    {
                      label: "FX conversion",
                      value:
                        fx?.status === "CALCULATED" && fx.amount != null
                          ? money(fx.amount, fx.currency)
                          : fxOffering
                            ? "Not calculatable"
                            : "No verified rule",
                    },
                  ]
                : []),
            ]}
            exclusions={[
              "Exchange-rate movement, taxes other than GST explicitly represented by the brokerage rule, market/regulatory fees, spreads not represented by the selected FX rule, deposit/withdrawal fees and other provider charges.",
            ]}
            sources={[
              ...(rule
                ? [
                    {
                      label: "Brokerage",
                      sourceUrl: rule.sourceUrl,
                      verifiedAt: rule.verifiedAt,
                      reviewDueAt: rule.reviewDueAt,
                      status: rule.verificationStatus,
                    },
                  ]
                : []),
              ...(includeFx && fxOffering
                ? [
                    {
                      label: "FX conversion",
                      sourceUrl: fxRule?.sourceUrl ?? null,
                      verifiedAt: fxRule?.verifiedAt ?? null,
                      reviewDueAt: fxRule?.reviewDueAt ?? null,
                      status: fxRule?.verificationStatus ?? "UNVERIFIED",
                    },
                  ]
                : []),
            ]}
          />
        )}
      </ToolPanel>
    </ToolShell>
  );
}
