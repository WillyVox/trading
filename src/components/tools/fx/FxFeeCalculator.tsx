"use client";

import { useState } from "react";
import { calculateFxFee } from "@/lib/tools/fx/calculate";
import type { FxOfferingOption } from "@/lib/tools/fx/types";
import { fxEligibility } from "@/lib/tools/fx/eligibility";
import { preferredFxRule } from "@/lib/tools/fx/selection";
import { ToolPanel, ToolShell } from "@/components/tools/shared/ToolShell";
import { ToolResultPanel } from "@/components/tools/shared/ToolResultPanel";

const money = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(
    n
  );

export function FxFeeCalculator({
  offerings,
  initialSlug,
}: {
  offerings: FxOfferingOption[];
  initialSlug?: string;
}) {
  const requested = initialSlug
    ? offerings.find((o) => o.slug === initialSlug)
    : undefined;
  const first =
    requested ??
    offerings.find((o) => o.availability === "CALCULATABLE") ??
    offerings[0];
  const [slug, setSlug] = useState(first?.slug ?? "");
  const [ruleId, setRuleId] = useState("");
  const [amount, setAmount] = useState("5000");
  const selected = offerings.find((o) => o.slug === slug) ?? first;
  if (!selected)
    return (
      <p className="text-muted">No FX pricing records are available yet.</p>
    );
  const selectedRule =
    selected.rules.find((rule) => rule.feeId === ruleId) ??
    preferredFxRule(selected.rules);
  if (!selectedRule)
    return <p className="text-muted">No FX pricing rule is available.</p>;
  const selectedAvailability = fxEligibility(selectedRule, new Date());
  const numericAmount = Number(amount);
  const result = calculateFxFee(numericAmount, selectedRule);
  const isCalculated = result.status === "CALCULATED";

  return (
    <ToolShell>
      <ToolPanel labelledBy="fx-inputs">
        <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
          Hypothetical conversion
        </p>
        <h2
          id="fx-inputs"
          className="font-display text-navy mt-2 text-2xl font-bold"
        >
          Your currency conversion
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Choose a platform and enter an AUD amount. We use its verified
          published FX pricing where the rule can be represented without
          guessing.
        </p>
        <div className="mt-6 space-y-5">
          <label className="text-navy block text-sm font-semibold">
            Platform
            <select
              value={selected.slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setRuleId("");
              }}
              className="border-border bg-background mt-2 min-h-12 w-full rounded-lg border px-3 py-2"
            >
              {offerings.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
          {selected.rules.length > 1 && (
            <label className="text-navy block text-sm font-semibold">
              FX pricing scenario
              <select
                value={selectedRule.feeId}
                onChange={(e) => setRuleId(e.target.value)}
                className="border-border bg-background mt-2 min-h-12 w-full rounded-lg border px-3 py-2 font-normal"
              >
                {selected.rules.map((rule) => (
                  <option key={rule.feeId} value={rule.feeId}>
                    {rule.label}
                    {rule.marketCode ? ` — ${rule.marketCode}` : ""}
                  </option>
                ))}
              </select>
              <span className="text-muted mt-1 block text-xs font-normal">
                This platform publishes more than one FX rule. Choose the
                scenario that matches your transaction.
              </span>
            </label>
          )}
          <label className="text-navy block text-sm font-semibold">
            Amount to convert
            <div className="border-border bg-background focus-within:ring-blue/30 mt-2 flex min-h-12 items-center rounded-lg border focus-within:ring-2">
              <span className="text-muted pl-3">A$</span>
              <input
                inputMode="decimal"
                type="number"
                min="0.01"
                max="1000000000"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 outline-none"
              />
            </div>
          </label>
          {selectedRule.percentage != null && (
            <div className="bg-panel-secondary rounded-xl p-4">
              <p className="text-muted text-xs font-bold tracking-wide uppercase">
                Published FX pricing used
              </p>
              <p className="text-navy mt-1 text-lg font-bold">
                {selectedRule.percentage}%
              </p>
              <p className="text-muted mt-1 text-sm leading-6">
                {selectedRule.label}
              </p>
            </div>
          )}
          {selectedAvailability.status === "VARIABLE" && (
            <div className="border-gold bg-gold/5 rounded-xl border p-4">
              <p className="text-navy font-semibold">
                A fixed estimate is not available
              </p>
              <p className="text-muted mt-1 text-sm leading-6">
                {selectedAvailability.reason}
              </p>
            </div>
          )}
        </div>
      </ToolPanel>

      <ToolPanel labelledBy="fx-result" live>
        {isCalculated ? (
          <ToolResultPanel
            panelId="fx-result"
            eyebrow="Estimate"
            title="Estimated FX cost"
            value={money(result.amount!)}
            heroCaption="Estimated FX cost for this scenario"
            context={`For converting ${money(numericAmount)} using the selected published pricing.`}
            rows={[
              ...(result.applicableRule
                ? [
                    {
                      label: "Applicable rule",
                      value: result.applicableRule.label,
                    },
                  ]
                : []),
              ...result.steps
                .filter((s) => s.result)
                .map((s) => ({ label: s.label, value: s.result as string })),
            ]}
            explanation={result.applicableRule?.description}
            assumptions={result.assumptions}
            exclusions={result.exclusions}
            sources={[
              {
                sourceUrl: selectedRule.sourceUrl,
                verifiedAt: selectedRule.verifiedAt,
                reviewDueAt: selectedRule.reviewDueAt,
                status: selectedRule.verificationStatus,
              },
            ]}
            links={[
              {
                label: `View ${selected.name} →`,
                href: `/share-trading/${selected.slug}`,
              },
              {
                label: "Compare platforms →",
                href: "/compare/trading-platforms",
              },
            ]}
          />
        ) : (
          <ToolResultPanel
            panelId="fx-result"
            eyebrow="Estimate"
            title="Estimated FX cost"
            fallbackTitle={
              result.status === "VARIABLE"
                ? "Published pricing varies"
                : "Unable to calculate this scenario"
            }
            fallbackMessage={result.message}
            extra={
              selectedRule.displayValue ? (
                <p className="bg-panel-secondary text-navy rounded-lg p-3 font-semibold">
                  {selectedRule.displayValue}
                </p>
              ) : undefined
            }
            exclusions={result.exclusions}
            sources={[
              {
                sourceUrl: selectedRule.sourceUrl,
                verifiedAt: selectedRule.verifiedAt,
                reviewDueAt: selectedRule.reviewDueAt,
                status: selectedRule.verificationStatus,
              },
            ]}
          />
        )}
      </ToolPanel>
    </ToolShell>
  );
}
