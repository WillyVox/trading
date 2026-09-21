"use client";

import { useState } from "react";
import { calculateEducationalFxFee } from "@/lib/tools/fx/calculate";

function aud(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
}

export function FxFeeCalculator() {
  const [amount, setAmount] = useState("5000");
  const [percentage, setPercentage] = useState("0.55");
  const numericAmount = Number(amount);
  const numericPercentage = Number(percentage);
  const result = calculateEducationalFxFee(numericAmount, numericPercentage);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section aria-labelledby="fx-inputs" className="border-border bg-panel rounded-2xl border p-5 md:p-6">
        <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">Educational mode</p>
        <h2 id="fx-inputs" className="font-display text-navy mt-2 text-xl font-bold">Try a percentage FX fee</h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Enter a hypothetical Australian-dollar amount and an FX fee percentage. This mode teaches the arithmetic; it does not use or recommend a provider.
        </p>
        <div className="mt-6 space-y-5">
          <label className="text-navy block text-sm font-semibold">
            Amount
            <div className="border-border bg-background mt-2 flex min-h-11 items-center rounded-lg border focus-within:ring-2 focus-within:ring-blue/30">
              <span className="text-muted pl-3" aria-hidden="true">A$</span>
              <input
                inputMode="decimal"
                type="number"
                min="0.01"
                max="1000000000"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 outline-none"
                aria-describedby="fx-amount-help"
              />
            </div>
            <span id="fx-amount-help" className="text-muted mt-1 block text-xs font-normal">The amount to which the example percentage fee is applied.</span>
          </label>

          <label className="text-navy block text-sm font-semibold">
            FX fee percentage
            <div className="border-border bg-background mt-2 flex min-h-11 items-center rounded-lg border focus-within:ring-2 focus-within:ring-blue/30">
              <input
                inputMode="decimal"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={percentage}
                onChange={(event) => setPercentage(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 outline-none"
                aria-describedby="fx-percentage-help"
              />
              <span className="text-muted pr-3" aria-hidden="true">%</span>
            </div>
            <span id="fx-percentage-help" className="text-muted mt-1 block text-xs font-normal">Use the published percentage from a source you are researching, or experiment with an example rate.</span>
          </label>
        </div>
      </section>

      <section aria-labelledby="fx-result" className="border-border bg-panel rounded-2xl border p-5 md:p-6" aria-live="polite">
        <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">Worked example</p>
        <h2 id="fx-result" className="font-display text-navy mt-2 text-xl font-bold">Estimated percentage fee</h2>

        {result.status === "CALCULATED" ? (
          <>
            <p className="font-display text-navy mt-4 text-4xl font-bold">{aud(result.amount ?? 0)}</p>
            <p className="text-muted mt-2 text-sm">For {aud(numericAmount)} at {numericPercentage}%.</p>
          </>
        ) : (
          <div className="mt-4">
            <p className="text-navy text-lg font-semibold">Check the values entered</p>
            <p className="text-muted mt-2 text-sm leading-6">{result.message}</p>
          </div>
        )}

        {result.status === "CALCULATED" && (
          <div className="mt-7 space-y-5 text-sm">
            <div>
              <h3 className="text-navy font-bold">What was calculated</h3>
              <p className="text-muted mt-1 leading-6">A percentage fee applied once to the hypothetical amount entered above.</p>
            </div>
            <div>
              <h3 className="text-navy font-bold">Calculation</h3>
              <div className="mt-2 space-y-2">
                {result.steps.map((step) => (
                  <div key={step.label} className="bg-panel-secondary rounded-lg px-3 py-2">
                    <p className="text-navy font-semibold">{step.label}</p>
                    <code className="text-muted mt-1 block overflow-x-auto text-xs">{step.expression} = {step.result}</code>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-navy font-bold">Assumptions</h3>
              <ul className="text-muted mt-1 list-disc space-y-1 pl-5 leading-6">
                {result.assumptions.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-navy font-bold">Not included</h3>
              <ul className="text-muted mt-1 list-disc space-y-1 pl-5 leading-6">
                {result.exclusions.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="border-border border-t pt-5">
              <h3 className="text-navy font-bold">Source & verification</h3>
              <p className="text-muted mt-1 leading-6">Not applicable in educational mode. The fee percentage is entered by you and is not presented as a verified provider fee.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
