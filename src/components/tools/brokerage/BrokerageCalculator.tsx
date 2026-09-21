"use client";

import { useMemo, useState } from "react";
import { calculateBrokerage } from "@/lib/tools/brokerage/calculate";
import type { BrokerageRule } from "@/lib/tools/brokerage/types";
import { ToolShell, ToolPanel } from "@/components/tools/shared/ToolShell";
import { CalculationResult } from "@/components/tools/shared/CalculationResult";
import { CalculationBreakdown } from "@/components/tools/shared/CalculationBreakdown";
import { AssumptionsPanel } from "@/components/tools/shared/AssumptionsPanel";
import { SourceVerificationPanel } from "@/components/tools/shared/SourceVerificationPanel";

const CHANNEL_LABELS: Record<string, string> = {
  ONLINE_STANDARD_SETTLEMENT: "Online — CDIA / Margin Loan settlement",
  ONLINE_OWN_BANK_SETTLEMENT: "Online — own bank account settlement",
  PHONE_OR_ESTATE: "Phone / deceased estate",
  THIRD_PARTY_SETTLEMENT: "Third-party settlement",
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

export function BrokerageCalculator({ rules }: { rules: BrokerageRule[] }) {
  const offerings = useMemo(
    () =>
      Array.from(
        new Map(rules.map((r) => [r.offeringSlug, r.offeringName])).entries()
      ),
    [rules]
  );
  const [offeringSlug, setOfferingSlug] = useState(offerings[0]?.[0] ?? "");
  const offeringRules = rules.filter((r) => r.offeringSlug === offeringSlug);
  const markets = Array.from(
    new Map(offeringRules.map((r) => [r.marketCode, r.marketName])).entries()
  );
  const [marketCode, setMarketCode] = useState(markets[0]?.[0] ?? "");
  const marketRules = offeringRules.filter((r) => r.marketCode === marketCode);
  const [feeId, setFeeId] = useState(marketRules[0]?.feeId ?? "");
  const [tradeAmount, setTradeAmount] = useState("2000");

  const effectiveMarket = markets.some(([code]) => code === marketCode)
    ? marketCode
    : (markets[0]?.[0] ?? "");
  const effectiveRules = offeringRules.filter(
    (r) => r.marketCode === effectiveMarket
  );
  const rule =
    effectiveRules.find((r) => r.feeId === feeId) ?? effectiveRules[0];
  const amount = Number(tradeAmount);
  const result = rule ? calculateBrokerage(rule, amount) : null;

  function changeOffering(next: string) {
    setOfferingSlug(next);
    const nextRules = rules.filter((r) => r.offeringSlug === next);
    setMarketCode(nextRules[0]?.marketCode ?? "");
    setFeeId(nextRules[0]?.feeId ?? "");
  }

  function changeMarket(next: string) {
    setMarketCode(next);
    const nextRule = offeringRules.find((r) => r.marketCode === next);
    setFeeId(nextRule?.feeId ?? "");
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
          Choose a platform, market and supported pricing rule. The calculator
          uses verified structured fee data; it does not choose a platform for
          you.
        </p>
        <div className="mt-6 space-y-5">
          <label className="text-navy block text-sm font-semibold">
            Platform
            <select
              value={offeringSlug}
              onChange={(e) => changeOffering(e.target.value)}
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            >
              {offerings.map(([slug, name]) => (
                <option key={slug} value={slug}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-navy block text-sm font-semibold">
            Market
            <select
              value={effectiveMarket}
              onChange={(e) => changeMarket(e.target.value)}
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            >
              {markets.map(([code, name]) => (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              ))}
            </select>
          </label>
          {effectiveRules.length > 1 && (
            <label className="text-navy block text-sm font-semibold">
              Pricing / settlement method
              <select
                value={rule?.feeId ?? ""}
                onChange={(e) => setFeeId(e.target.value)}
                className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
              >
                {effectiveRules.map((r) => (
                  <option key={r.feeId} value={r.feeId}>
                    {r.channel
                      ? (CHANNEL_LABELS[r.channel] ?? r.label)
                      : r.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="text-navy block text-sm font-semibold">
            Trade amount
            <div className="border-border bg-background focus-within:ring-blue/30 mt-2 flex min-h-11 items-center rounded-lg border focus-within:ring-2">
              <span className="text-muted pl-3" aria-hidden="true">
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
                aria-describedby="trade-amount-help"
              />
            </div>
            <span
              id="trade-amount-help"
              className="text-muted mt-1 block text-xs font-normal"
            >
              Trade value, not the amount of cash in your account.
            </span>
          </label>
        </div>
      </ToolPanel>

      <ToolPanel labelledBy="brokerage-result" live>
        <CalculationResult
          title="Estimated brokerage"
          value={result?.status === "CALCULATED" ? money(result.amount ?? 0, result.currency) : undefined}
          context={result?.status === "CALCULATED" ? `For a ${Number.isFinite(amount) ? money(amount, rule?.currency ?? undefined) : "—"} hypothetical trade.` : undefined}
        >
          {rule && result && (
            <div className="mt-7 space-y-5 text-sm">
              <CalculationBreakdown label={rule.label} expression={result.expression} explanation={result.explanation} />
              <AssumptionsPanel
                assumptions={rule.notes ? [rule.notes] : []}
                exclusions={["Taxes, market movement, FX costs and other fees are not included unless they are part of the selected brokerage rule."]}
              />
              <SourceVerificationPanel sourceUrl={rule.sourceUrl} verifiedAt={rule.verifiedAt} status={rule.verificationStatus} />
            </div>
          )}
        </CalculationResult>
      </ToolPanel>
    </ToolShell>
  );
}
