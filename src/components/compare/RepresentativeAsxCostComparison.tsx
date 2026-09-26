"use client";

import { useMemo, useState } from "react";
import type { BrokerageOfferingOption } from "@/lib/tools/brokerage/types";
import { compareRepresentativeAsxBrokerage } from "@/lib/tools/brokerage/compare";

const PRESETS = [1000, 5000, 10000] as const;

function money(amount: number, currency: string | null) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency || "AUD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function RepresentativeAsxCostComparison({
  offerings,
}: {
  offerings: BrokerageOfferingOption[];
}) {
  const [tradeAmount, setTradeAmount] = useState(5000);
  const results = useMemo(
    () => compareRepresentativeAsxBrokerage(offerings, tradeAmount),
    [offerings, tradeAmount]
  );

  return (
    <section className="border-border bg-panel mt-10 rounded-2xl border p-5 shadow-sm md:p-6">
      <div className="max-w-3xl">
        <p className="text-gold-dark text-xs font-bold tracking-[0.12em] uppercase">
          Representative cost scenario
        </p>
        <h2 className="font-display text-navy mt-2 text-2xl font-bold">
          Estimated brokerage for an ASX buy
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Compare the same hypothetical online ASX buy across platforms using
          verified calculator-ready pricing rules. This is an estimate of
          brokerage only; taxes, market movement, spreads, subscriptions and
          other costs are excluded unless the applicable brokerage rule
          explicitly includes them.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-2">
        {PRESETS.map((amount) => (
          <button
            key={amount}
            type="button"
            aria-pressed={tradeAmount === amount}
            onClick={() => setTradeAmount(amount)}
            className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${
              tradeAmount === amount
                ? "border-navy bg-navy text-white"
                : "border-border bg-background text-navy"
            }`}
          >
            ${amount.toLocaleString("en-AU")}
          </button>
        ))}
        <label className="text-navy ml-1 text-sm font-semibold">
          Custom amount
          <span className="border-border bg-background ml-2 inline-flex min-h-10 items-center rounded-full border px-3">
            <span className="text-muted" aria-hidden>
              $
            </span>
            <input
              type="number"
              min="1"
              step="1"
              value={tradeAmount}
              onChange={(event) => setTradeAmount(Number(event.target.value))}
              className="w-28 bg-transparent px-1 outline-none"
              aria-label="Custom ASX trade amount"
            />
          </span>
        </label>
      </div>

      <div className="border-border mt-5 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead className="bg-panel-secondary text-left">
            <tr className="border-border border-b">
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Estimated brokerage</th>
              <th className="px-4 py-3">Rule used</th>
              <th className="px-4 py-3">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr
                key={result.offeringSlug}
                className="border-border border-b last:border-0"
              >
                <th
                  scope="row"
                  className="text-navy px-4 py-3 text-left font-semibold"
                >
                  {result.offeringName}
                </th>
                <td className="text-navy px-4 py-3 font-semibold">
                  {result.status === "CALCULATED"
                    ? "Calculated"
                    : "Not calculable"}
                </td>
                <td className="text-navy px-4 py-3 font-semibold">
                  {result.status === "CALCULATED" && result.amount != null
                    ? money(result.amount, result.currency)
                    : "Not calculable"}
                </td>
                <td className="text-muted max-w-[300px] px-4 py-3">
                  {result.ruleLabel ?? result.explanation}
                </td>
                <td className="px-4 py-3">
                  {result.sourceUrl ? (
                    <a
                      href={result.sourceUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-navy underline underline-offset-2"
                    >
                      Source ↗
                    </a>
                  ) : (
                    <span className="text-muted">Source not verified</span>
                  )}
                  {result.verifiedAt && (
                    <span className="text-muted mt-1 block text-xs">
                      Verified{" "}
                      {new Date(result.verifiedAt).toLocaleDateString("en-AU")}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="border-border mt-4 rounded-xl border px-4 py-3">
        <summary className="text-navy cursor-pointer text-sm font-semibold">
          Assumptions and limitations
        </summary>
        <div className="text-muted mt-3 space-y-2 text-sm leading-6">
          <p>
            Scenario: online ASX buy, first eligible buy of that security today,
            no margin-loan settlement. Where a platform publishes named plans,
            the Standard plan is used, or Fixed for Interactive Brokers.
          </p>
          <p>
            CommSec uses its online CDIA/Margin Loan settlement brokerage
            schedule for this representative scenario. CMC&apos;s published
            first-eligible-buy concession is applied only when the entered
            amount and conditions match its verified rule.
          </p>
          <p>
            A platform is shown as “Not calculable” when its verified pricing
            cannot be determined from trade value alone. We do not convert
            variable pricing into an estimate by guessing.
          </p>
        </div>
      </details>
    </section>
  );
}
