import {
  LiveEvidencePanel,
  type EvidenceRow,
} from "@/components/guide/LiveEvidencePanel";

export function CustodyEvidence({ rows }: { rows: EvidenceRow[] }) {
  return (
    <LiveEvidencePanel
      title="How supported platforms record ownership"
      description="Verified provider records show that ownership can differ by platform and market. This is evidence, not a ranking."
      columns={["Market", "Ownership structure", "HIN"]}
      rows={rows}
      note="Only VERIFIED custody records are shown. A missing row means Trading Guide does not currently have a verified custody record for that provider/market; it does not mean the feature is absent."
    />
  );
}

export function HinEvidence({ rows }: { rows: EvidenceRow[] }) {
  return (
    <LiveEvidencePanel
      title="ASX custody and HIN evidence"
      description="Verified ASX custody records show whether Trading Guide has evidence that a personal HIN is supported for the Australian-market offering."
      columns={["ASX ownership", "Personal HIN"]}
      rows={rows}
      note="HIN evidence is market-specific. International holdings and fractional interests can use a different structure even when a provider supports CHESS for ASX holdings."
    />
  );
}

export function FractionalEvidence({ rows }: { rows: EvidenceRow[] }) {
  return (
    <LiveEvidencePanel
      title="Verified fractional-share disclosures in provider research"
      description="These rows are pulled from source-linked provider research where the current dataset explicitly mentions fractional shares."
      columns={["Evidence type", "What the record says"]}
      rows={rows}
      note="This is intentionally not a complete yes/no fractional-share comparison. Providers without a verified fractional-share research record are omitted rather than shown as 'No'."
    />
  );
}

export function CryptoFundingEvidence({ rows }: { rows: EvidenceRow[] }) {
  return (
    <LiveEvidencePanel
      title="Verified funding and withdrawal rules"
      description="Funding, fiat withdrawal and crypto withdrawal are kept as separate fee stages so a free bank deposit cannot be mistaken for an entirely fee-free journey."
      columns={["Stage", "Published rule"]}
      rows={rows}
      note="Only VERIFIED structured fee records are shown. Network-dependent or variable charges remain variable; they are never converted to $0."
    />
  );
}

export function TradingCostCoverageEvidence({ rows }: { rows: EvidenceRow[] }) {
  return (
    <LiveEvidencePanel
      title="Which cost stages currently have verified structured evidence?"
      description="This map shows the cost components Trading Guide can currently support with verified structured provider records. It is a coverage map, not a cost ranking."
      columns={["Primary transaction cost", "Secondary cost evidence"]}
      rows={rows}
      note="A missing component means it is not currently represented by verified structured data. It must not be interpreted as a zero fee. Use the calculators for scenario-specific calculations."
    />
  );
}
