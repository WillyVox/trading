"use client";

import { useState } from "react";
import { ToolPanel, ToolShell } from "@/components/tools/shared/ToolShell";
import { SourceVerificationPanel } from "@/components/tools/shared/SourceVerificationPanel";
import { calculateCryptoFee } from "@/lib/tools/crypto-fees/calculate";
import type {
  CryptoFeeOffering,
  CryptoFeeRule,
} from "@/lib/tools/crypto-fees/types";
import { combineCryptoCosts } from "@/lib/tools/crypto-cost/calculate";

const DEPOSIT = new Set(["FIAT_DEPOSIT"]);
const TRADE = new Set(["CRYPTO_TRADING", "MAKER", "TAKER", "INSTANT_BUY"]);
const WITHDRAW = new Set(["FIAT_WITHDRAWAL", "CRYPTO_WITHDRAWAL"]);
function money(amount: number, currency = "AUD") {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(8).replace(/0+$/, "").replace(/\.$/, "")}`;
  }
}
function firstRule(rules: CryptoFeeRule[], ids: Set<string>) {
  return rules.find((r) => ids.has(r.category));
}

export function CryptoCostCalculator({
  offerings,
}: {
  offerings: CryptoFeeOffering[];
}) {
  const supported = offerings.filter((o) =>
    o.rules.some((r) => TRADE.has(r.category))
  );
  const [slug, setSlug] = useState(supported[0]?.slug ?? "");
  const offering = supported.find((o) => o.slug === slug) ?? supported[0];
  const rules = offering?.rules ?? [];
  const deposits = rules.filter((r) => DEPOSIT.has(r.category));
  const trades = rules.filter((r) => TRADE.has(r.category));
  const withdrawals = rules.filter((r) => WITHDRAW.has(r.category));
  const [depositId, setDepositId] = useState("");
  const [tradeId, setTradeId] = useState("");
  const [withdrawalId, setWithdrawalId] = useState("");
  const [includeDeposit, setIncludeDeposit] = useState(true);
  const [includeWithdrawal, setIncludeWithdrawal] = useState(false);
  const [amountText, setAmountText] = useState("1000");
  const [volumeText, setVolumeText] = useState("");
  const [assetsText, setAssetsText] = useState("");
  const amount = Number(amountText);
  const depositRule =
    deposits.find((r) => r.feeId === depositId) ?? firstRule(rules, DEPOSIT);
  const tradeRule =
    trades.find((r) => r.feeId === tradeId) ?? firstRule(rules, TRADE);
  const withdrawalRule =
    withdrawals.find((r) => r.feeId === withdrawalId) ??
    firstRule(rules, WITHDRAW);
  const trade = tradeRule
    ? calculateCryptoFee(tradeRule, {
        amount,
        rolling30DayVolume: volumeText === "" ? null : Number(volumeText),
        assetsOnPlatform: assetsText === "" ? null : Number(assetsText),
      })
    : null;
  const deposit =
    includeDeposit && depositRule
      ? calculateCryptoFee(depositRule, amount)
      : null;
  const withdrawal =
    includeWithdrawal && withdrawalRule
      ? calculateCryptoFee(withdrawalRule, amount)
      : null;
  const combined = combineCryptoCosts([
    { label: "Deposit", calculation: deposit },
    { label: "Trading", calculation: trade },
    { label: "Withdrawal", calculation: withdrawal },
  ]);
  const asksVolume = Boolean(
    tradeRule?.calculationBasis === "TIERED" &&
    tradeRule.tiers.some((t) => t.minRolling30DayVolume != null)
  );
  const asksAssets = Boolean(
    tradeRule?.calculationBasis === "TIERED" &&
    tradeRule.tiers.some((t) => t.minAssetsOnPlatform != null)
  );
  const reset = (next: string) => {
    setSlug(next);
    setDepositId("");
    setTradeId("");
    setWithdrawalId("");
    setVolumeText("");
    setAssetsText("");
  };

  return (
    <ToolShell>
      <ToolPanel labelledBy="crypto-cost-inputs">
        <h2
          id="crypto-cost-inputs"
          className="font-display text-navy text-xl font-bold"
        >
          Hypothetical crypto journey
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Combine only the source-backed cost components that can be calculated
          for a deposit, purchase/trade and optional withdrawal.
        </p>
        <div className="mt-6 space-y-5">
          <label className="text-navy block text-sm font-semibold">
            Platform
            <select
              value={offering?.slug ?? ""}
              onChange={(e) => reset(e.target.value)}
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
            Scenario amount
            <input
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            />
          </label>
          {deposits.length > 0 && (
            <div className="border-border rounded-lg border p-3">
              <label className="flex gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={includeDeposit}
                  onChange={(e) => setIncludeDeposit(e.target.checked)}
                />
                <span>
                  <strong className="text-navy">Include fiat deposit</strong>
                </span>
              </label>
              {includeDeposit && (
                <select
                  value={depositRule?.feeId ?? ""}
                  onChange={(e) => setDepositId(e.target.value)}
                  className="border-border bg-background mt-3 min-h-11 w-full rounded-lg border px-3 py-2"
                >
                  {deposits.map((r) => (
                    <option key={r.feeId} value={r.feeId}>
                      {r.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          <label className="text-navy block text-sm font-semibold">
            Trading method
            <select
              value={tradeRule?.feeId ?? ""}
              onChange={(e) => {
                setTradeId(e.target.value);
                setVolumeText("");
                setAssetsText("");
              }}
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            >
              {trades.map((r) => (
                <option key={r.feeId} value={r.feeId}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          {asksVolume && (
            <label className="text-navy block text-sm font-semibold">
              Rolling 30-day trading volume
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={volumeText}
                onChange={(e) => setVolumeText(e.target.value)}
                className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
              />
            </label>
          )}
          {asksAssets && (
            <label className="text-navy block text-sm font-semibold">
              Assets on platform
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={assetsText}
                onChange={(e) => setAssetsText(e.target.value)}
                className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
              />
            </label>
          )}
          {withdrawals.length > 0 && (
            <div className="border-border rounded-lg border p-3">
              <label className="flex gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={includeWithdrawal}
                  onChange={(e) => setIncludeWithdrawal(e.target.checked)}
                />
                <span>
                  <strong className="text-navy">Include withdrawal</strong>
                </span>
              </label>
              {includeWithdrawal && (
                <select
                  value={withdrawalRule?.feeId ?? ""}
                  onChange={(e) => setWithdrawalId(e.target.value)}
                  className="border-border bg-background mt-3 min-h-11 w-full rounded-lg border px-3 py-2"
                >
                  {withdrawals.map((r) => (
                    <option key={r.feeId} value={r.feeId}>
                      {r.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      </ToolPanel>
      <ToolPanel labelledBy="crypto-cost-result" live>
        <h2
          id="crypto-cost-result"
          className="font-display text-navy text-xl font-bold"
        >
          Estimated costs covered
        </h2>
        <div className="mt-5 space-y-4">
          {combined.components
            .filter((c) => c.calculation)
            .map((component) => (
              <div
                key={component.label}
                className="border-border rounded-xl border p-4"
              >
                <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                  {component.label}
                </p>
                <p className="text-navy mt-1 text-2xl font-bold">
                  {component.calculation?.status === "CALCULATED" &&
                  component.calculation.amount != null
                    ? money(
                        component.calculation.amount,
                        component.calculation.currency
                      )
                    : component.calculation?.status === "VARIABLE"
                      ? "Variable"
                      : component.calculation?.status === "TIERED_NEEDS_INPUT"
                        ? "Needs tier input"
                        : "Not estimated"}
                </p>
                <p className="text-muted mt-2 text-sm leading-6">
                  {component.calculation?.explanation}
                </p>
              </div>
            ))}
          <div className="bg-panel-secondary rounded-xl p-5">
            <p className="text-muted text-xs font-semibold tracking-wide uppercase">
              Combined total
            </p>
            {combined.canTotal && combined.totalAmount != null ? (
              <p className="text-navy mt-1 text-3xl font-bold">
                {money(combined.totalAmount, combined.totalCurrency)}
              </p>
            ) : (
              <>
                <p className="text-navy mt-1 font-bold">Not shown</p>
                <p className="text-muted mt-2 text-sm leading-6">
                  {combined.message}
                </p>
              </>
            )}
          </div>
          <div className="border-border border-t pt-5">
            <h3 className="text-navy font-semibold">What is not included</h3>
            <p className="text-muted mt-2 text-sm leading-6">
              Live spread/slippage, price movement, network fees unless
              represented by the selected verified withdrawal rule, taxes,
              exchange-rate conversion between unlike currencies, and
              third-party payment-provider charges not captured by the selected
              records.
            </p>
          </div>
          {includeDeposit && depositRule && (
            <SourceVerificationPanel
              sourceUrl={depositRule.sourceUrl}
              verifiedAt={depositRule.verifiedAt}
              reviewDueAt={depositRule.reviewDueAt}
              status={depositRule.verificationStatus}
            />
          )}
          {tradeRule && (
            <SourceVerificationPanel
              sourceUrl={tradeRule.sourceUrl}
              verifiedAt={tradeRule.verifiedAt}
              reviewDueAt={tradeRule.reviewDueAt}
              status={tradeRule.verificationStatus}
            />
          )}
          {includeWithdrawal && withdrawalRule && (
            <SourceVerificationPanel
              sourceUrl={withdrawalRule.sourceUrl}
              verifiedAt={withdrawalRule.verifiedAt}
              reviewDueAt={withdrawalRule.reviewDueAt}
              status={withdrawalRule.verificationStatus}
            />
          )}
        </div>
      </ToolPanel>
    </ToolShell>
  );
}
