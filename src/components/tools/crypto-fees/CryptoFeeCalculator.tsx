"use client";

import { useState } from "react";
import { ToolPanel, ToolShell } from "@/components/tools/shared/ToolShell";
import { SourceVerificationPanel } from "@/components/tools/shared/SourceVerificationPanel";
import { calculateCryptoFee } from "@/lib/tools/crypto-fees/calculate";
import type { CryptoFeeOffering } from "@/lib/tools/crypto-fees/types";

function money(amount: number, currency = "AUD") {
  try { return new Intl.NumberFormat("en-AU", { style: "currency", currency }).format(amount); }
  catch { return `${currency} ${amount.toFixed(2)}`; }
}

export function CryptoFeeCalculator({ offerings }: { offerings: CryptoFeeOffering[] }) {
  const [slug, setSlug] = useState(offerings[0]?.slug ?? "");
  const offering = offerings.find((o) => o.slug === slug) ?? offerings[0];
  const verifiedRules = (offering?.rules ?? []).filter((r) => r.verificationStatus === "VERIFIED");
  const [feeId, setFeeId] = useState("");
  const rule = verifiedRules.find((r) => r.feeId === feeId) ?? verifiedRules[0] ?? offering?.rules[0];
  const [amountText, setAmountText] = useState("1000");
  const amount = Number(amountText);
  const result = rule ? calculateCryptoFee(rule, amount) : null;

  function changePlatform(next: string) { setSlug(next); setFeeId(""); }

  return <ToolShell>
    <ToolPanel labelledBy="crypto-fee-inputs">
      <h2 id="crypto-fee-inputs" className="font-display text-navy text-xl font-bold">Hypothetical crypto transaction</h2>
      <p className="text-muted mt-2 text-sm leading-6">Choose a published fee record and see what can be calculated without treating variable or tier-dependent costs as zero.</p>
      <div className="mt-6 space-y-5">
        <label className="text-navy block text-sm font-semibold">Platform
          <select value={offering?.slug ?? ""} onChange={(e)=>changePlatform(e.target.value)} className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal">
            {offerings.map((o)=><option key={o.slug} value={o.slug}>{o.name}</option>)}
          </select>
        </label>
        <label className="text-navy block text-sm font-semibold">Fee / transaction type
          <select value={rule?.feeId ?? ""} onChange={(e)=>setFeeId(e.target.value)} className="border-border bg-background mt-2 min-h-11 w-full rounded-lg border px-3 py-2 font-normal">
            {(offering?.rules ?? []).map((r)=><option key={r.feeId} value={r.feeId}>{r.label}{r.verificationStatus !== "VERIFIED" ? ` — ${r.verificationStatus.toLowerCase()}` : ""}</option>)}
          </select>
        </label>
        <label className="text-navy block text-sm font-semibold">Transaction amount
          <div className="border-border bg-background mt-2 flex min-h-11 items-center rounded-lg border"><span className="text-muted pl-3">A$</span><input type="number" inputMode="decimal" min="0.01" step="0.01" value={amountText} onChange={(e)=>setAmountText(e.target.value)} className="min-w-0 flex-1 bg-transparent px-2 py-2 outline-none" /></div>
          <span className="text-muted mt-1 block text-xs font-normal">Used only when the selected fee can be applied to a transaction amount. A provider may charge in another currency or crypto unit.</span>
        </label>
      </div>
    </ToolPanel>
    <ToolPanel labelledBy="crypto-fee-result" live>
      <h2 id="crypto-fee-result" className="font-display text-navy text-xl font-bold">Estimated fee covered</h2>
      {!rule || !result ? <p className="text-muted mt-5 text-sm">No structured fee record is available.</p> : <div className="mt-5 space-y-5">
        <div className="bg-panel-secondary rounded-xl p-5">
          <p className="text-muted text-xs font-semibold tracking-wide uppercase">{rule.label}</p>
          {result.status === "CALCULATED" && result.amount != null ? <p className="text-navy mt-1 text-3xl font-bold">{money(result.amount, result.currency)}</p> : <p className="text-navy mt-1 text-xl font-bold">{result.status === "TIERED_NEEDS_INPUT" ? "Tier-dependent" : result.status === "VARIABLE" ? "Variable" : "Not estimated"}</p>}
          {result.expression && <p className="text-muted mt-2 text-sm">{result.expression}</p>}
          <p className="text-muted mt-3 text-sm leading-6">{result.explanation}</p>
        </div>
        {rule.displayValue && <div className="border-border rounded-xl border p-4"><h3 className="text-navy font-semibold">Published pricing</h3><p className="text-muted mt-2 text-sm leading-6">{rule.displayValue}</p>{rule.notes && <p className="text-muted mt-2 text-sm leading-6">{rule.notes}</p>}</div>}
        <div className="border-border border-t pt-5"><h3 className="text-navy font-semibold">What is not included</h3><p className="text-muted mt-2 text-sm leading-6">Live spread/slippage, price movement, network fees unless explicitly represented by the selected rule, payment-provider charges, taxes, and account-specific discounts or tiers not captured in structured data.</p></div>
        <SourceVerificationPanel sourceUrl={rule.sourceUrl} verifiedAt={rule.verifiedAt} reviewDueAt={rule.reviewDueAt} status={rule.verificationStatus} />
      </div>}
    </ToolPanel>
  </ToolShell>;
}
