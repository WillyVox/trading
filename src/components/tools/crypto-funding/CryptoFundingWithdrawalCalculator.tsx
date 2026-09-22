"use client";

import { useState } from "react";
import { ToolPanel, ToolShell } from "@/components/tools/shared/ToolShell";
import { ToolResultPanel } from "@/components/tools/shared/ToolResultPanel";
import { calculateCryptoFee } from "@/lib/tools/crypto-fees/calculate";
import type { CryptoFeeOffering } from "@/lib/tools/crypto-fees/types";

const FUNDING = new Set([
  "FIAT_DEPOSIT",
  "FIAT_WITHDRAWAL",
  "CRYPTO_WITHDRAWAL",
]);
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

export function CryptoFundingWithdrawalCalculator({
  offerings,
}: {
  offerings: CryptoFeeOffering[];
}) {
  const available = offerings
    .map((o) => ({
      ...o,
      rules: o.rules.filter((r) => FUNDING.has(r.category)),
    }))
    .filter((o) => o.rules.length > 0);
  const [slug, setSlug] = useState(available[0]?.slug ?? "");
  const offering = available.find((o) => o.slug === slug) ?? available[0];
  const [feeId, setFeeId] = useState("");
  const rule =
    offering?.rules.find((r) => r.feeId === feeId) ?? offering?.rules[0];
  const [amountText, setAmountText] = useState("1000");
  const result = rule ? calculateCryptoFee(rule, Number(amountText)) : null;

  return (
    <ToolShell>
      <ToolPanel labelledBy="crypto-funding-inputs">
        <h2
          id="crypto-funding-inputs"
          className="font-display text-navy text-xl font-bold"
        >
          Funding or withdrawal scenario
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Explore source-linked deposit and withdrawal fees without treating
          network-dependent or unknown costs as zero.
        </p>
        <div className="mt-6 space-y-5">
          <label className="text-navy block text-sm font-semibold">
            Platform
            <select
              value={offering?.slug ?? ""}
              onChange={(e) => {
                setSlug(e.target.value);
                setFeeId("");
              }}
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            >
              {available.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-navy block text-sm font-semibold">
            Funding / withdrawal method
            <select
              value={rule?.feeId ?? ""}
              onChange={(e) => setFeeId(e.target.value)}
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            >
              {(offering?.rules ?? []).map((r) => (
                <option key={r.feeId} value={r.feeId}>
                  {r.label}
                  {r.verificationStatus !== "VERIFIED"
                    ? ` — ${r.verificationStatus.toLowerCase()}`
                    : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="text-navy block text-sm font-semibold">
            Amount
            <input
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal"
            />
            <span className="text-muted mt-1 block text-xs font-normal">
              Used only when the selected published rule depends on an amount.
              Flat crypto-unit and variable network fees are kept in their
              published form.
            </span>
          </label>
        </div>
      </ToolPanel>
      <ToolPanel labelledBy="crypto-funding-result" live>
        {!rule || !result ? (
          <ToolResultPanel
            panelId="crypto-funding-result"
            eyebrow="Estimate"
            title="Estimated fee covered"
            exclusions={[
              "Network-dependent miner or validator fees, live exchange rates and third-party payment-provider charges are not estimated unless the selected verified rule explicitly represents them.",
            ]}
            sources={[]}
            hideBody
            fallbackTitle="No structured fee record"
            fallbackMessage="No structured funding or withdrawal fee is available."
          />
        ) : (
          <ToolResultPanel
            panelId="crypto-funding-result"
            eyebrow="Estimate"
            title="Estimated fee covered"
            value={
              result.status === "CALCULATED" && result.amount != null
                ? money(result.amount, result.currency)
                : undefined
            }
            heroCaption={rule.label}
            fallbackTitle={
              result.status === "VARIABLE" ? "Variable" : "Not estimated"
            }
            rows={
              result.expression
                ? [{ label: "Calculation", value: result.expression }]
                : undefined
            }
            explanation={result.explanation}
            extra={
              rule.displayValue ? (
                <div className="border-border rounded-xl border p-4">
                  <h3 className="text-navy font-semibold">Published pricing</h3>
                  <p className="text-muted mt-2 text-sm leading-6">
                    {rule.displayValue}
                  </p>
                  {rule.notes && (
                    <p className="text-muted mt-2 text-sm leading-6">
                      {rule.notes}
                    </p>
                  )}
                </div>
              ) : undefined
            }
            exclusions={[
              "Network-dependent miner or validator fees, live exchange rates and third-party payment-provider charges are not estimated unless the selected verified rule explicitly represents them.",
            ]}
            sources={[
              {
                sourceUrl: rule.sourceUrl,
                verifiedAt: rule.verifiedAt,
                reviewDueAt: rule.reviewDueAt,
                status: rule.verificationStatus,
              },
            ]}
          />
        )}
      </ToolPanel>
    </ToolShell>
  );
}
