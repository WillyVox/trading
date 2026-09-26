"use client";

import { useMemo, useState } from "react";
import type { BrokerageOfferingOption } from "@/lib/tools/brokerage/types";
import type { FxOfferingOption } from "@/lib/tools/fx/types";
import { compareRepresentativeUsCosts } from "@/lib/tools/brokerage/us-compare";

const PRESETS = [1000, 5000, 10000] as const;
function money(amount: number, currency: string | null) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency || "AUD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function RepresentativeUsCostComparison({
  offerings,
  fxOfferings,
}: {
  offerings: BrokerageOfferingOption[];
  fxOfferings: FxOfferingOption[];
}) {
  const [amount, setAmount] = useState(5000);
  const results = useMemo(
    () => compareRepresentativeUsCosts(offerings, fxOfferings, amount),
    [offerings, fxOfferings, amount]
  );
  return (
    <section className="border-border bg-panel mt-10 rounded-2xl border p-5 shadow-sm md:p-6">
      <div className="max-w-3xl">
        <p className="text-gold-dark text-xs font-bold tracking-[0.12em] uppercase">
          International cost scenario
        </p>
        <h2 className="font-display text-navy mt-2 text-2xl font-bold">
          Known costs for a US share investment
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Compare verified US brokerage and AUD-to-USD conversion components for
          the same hypothetical investment. Components in different currencies
          are deliberately not added into a fake all-in total without a live
          exchange rate.
        </p>
      </div>
      <div className="mt-5 flex flex-wrap items-end gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            aria-pressed={amount === preset}
            onClick={() => setAmount(preset)}
            className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${amount === preset ? "border-navy bg-navy text-white" : "border-border bg-background text-navy"}`}
          >
            A${preset.toLocaleString("en-AU")}
          </button>
        ))}
        <label className="text-navy ml-1 text-sm font-semibold">
          Custom AUD amount
          <span className="border-border bg-background ml-2 inline-flex min-h-10 items-center rounded-full border px-3">
            <span className="text-muted">A$</span>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-28 bg-transparent px-1 outline-none"
              aria-label="Custom US investment amount in Australian dollars"
            />
          </span>
        </label>
      </div>
      <div className="border-border mt-5 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead className="bg-panel-secondary text-left">
            <tr className="border-border border-b">
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">US brokerage</th>
              <th className="px-4 py-3">Estimated FX cost</th>
              <th className="px-4 py-3">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr
                key={r.offeringSlug}
                className="border-border border-b align-top last:border-0"
              >
                <th
                  scope="row"
                  className="text-navy px-4 py-3 text-left font-semibold"
                >
                  {r.offeringName}
                </th>
                <td className="px-4 py-3">
                  <span className="text-navy font-semibold">
                    {r.status === "COMPLETE_COMPONENTS"
                      ? "Calculated"
                      : r.status === "PARTIAL"
                        ? "Partial"
                        : "Not calculable"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-navy font-semibold">
                    {r.brokerageAmount != null
                      ? money(r.brokerageAmount, r.brokerageCurrency)
                      : "Not calculable"}
                  </span>
                  <span className="text-muted mt-1 block max-w-[260px] text-xs">
                    {r.brokerageLabel ?? r.brokerageExplanation}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-navy font-semibold">
                    {r.fxAmount != null
                      ? money(r.fxAmount, r.fxCurrency)
                      : "Not calculable"}
                  </span>
                  <span className="text-muted mt-1 block max-w-[260px] text-xs">
                    {r.fxLabel ?? r.fxExplanation}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  {r.brokerageSourceUrl && (
                    <a
                      href={r.brokerageSourceUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-navy block underline underline-offset-2"
                    >
                      Brokerage source ↗
                    </a>
                  )}
                  {r.fxSourceUrl && (
                    <a
                      href={r.fxSourceUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-navy mt-1 block underline underline-offset-2"
                    >
                      FX source ↗
                    </a>
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
            Scenario: an Australian investor funds a US share purchase from AUD
            using the platform&apos;s verified standard pricing represented in
            Trading Guide.
          </p>
          <p>
            FX is estimated from the AUD amount using the provider&apos;s
            published percentage where a deterministic rule exists. This is not
            a live currency quote.
          </p>
          <p>
            US brokerage can be denominated in USD while FX cost is shown in
            AUD. We do not add those values together without an exchange rate.
            Per-share or variable brokerage, variable FX, pass-through charges,
            taxes and market movement remain excluded unless the structured rule
            can calculate them safely.
          </p>
        </div>
      </details>
    </section>
  );
}
