"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { custodyTypeCopy } from "@/lib/share-trading/labels";
import { GLOSSARY, type GlossaryKey } from "@/lib/glossary/terms";
import type { CustodyExplorerRow } from "@/lib/tools/custody/types";
import { custodyFacts } from "@/lib/tools/custody/presentation";

const conceptKeys: GlossaryKey[] = [
  "chess-sponsored",
  "hin",
  "custodial",
  "issuer-sponsored",
  "direct-registration",
  "omnibus",
];

function formatDate(value: string | null) {
  if (!value) return "Not yet verified";
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function CustodyExplorer({ rows }: { rows: CustodyExplorerRow[] }) {
  const [selectedConcept, setSelectedConcept] =
    useState<GlossaryKey>("chess-sponsored");
  const [offeringSlug, setOfferingSlug] = useState(rows[0]?.offeringSlug ?? "");
  const [marketCode, setMarketCode] = useState("");

  const offerings = useMemo(() => {
    const unique = new Map<string, { slug: string; name: string }>();
    for (const row of rows)
      unique.set(row.offeringSlug, {
        slug: row.offeringSlug,
        name: row.offeringName,
      });
    return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [rows]);

  const offeringRows = rows.filter((row) => row.offeringSlug === offeringSlug);
  const markets = offeringRows.map((row) => ({
    code: row.marketCode ?? "ALL",
    name: row.marketName ?? "All markets",
  }));
  const effectiveMarket =
    marketCode && markets.some((market) => market.code === marketCode)
      ? marketCode
      : (markets[0]?.code ?? "");
  const selectedRow =
    offeringRows.find((row) => (row.marketCode ?? "ALL") === effectiveMarket) ??
    null;
  const concept = GLOSSARY[selectedConcept];
  const selectedFacts = selectedRow
    ? custodyFacts(selectedRow.custodyType)
    : [];

  return (
    <div className="space-y-10">
      <section aria-labelledby="ownership-map-title">
        <h2
          id="ownership-map-title"
          className="font-display text-navy text-2xl font-bold"
        >
          Start with the ownership structure
        </h2>
        <p className="text-muted mt-2 max-w-3xl leading-7">
          CHESS sponsorship and custody describe different ways holdings can be
          recorded or held. They are not a good-versus-bad score. Select a
          concept to understand what it means.
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div
            className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1"
            role="list"
            aria-label="Ownership concepts"
          >
            {conceptKeys.map((key) => {
              const item = GLOSSARY[key];
              const active = key === selectedConcept;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedConcept(key)}
                  aria-pressed={active}
                  className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${active ? "border-navy bg-navy text-white" : "border-border bg-panel text-navy hover:border-navy"}`}
                >
                  {item.term}
                </button>
              );
            })}
          </div>
          <Card className="h-full">
            <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
              Concept
            </p>
            <h3 className="font-display text-navy mt-2 text-xl font-bold">
              {concept.term}
            </h3>
            <p className="text-muted mt-3 leading-7">{concept.plainEnglish}</p>
            <h4 className="text-navy mt-5 font-bold">Why it matters</h4>
            <p className="text-muted mt-2 text-sm leading-6">
              {concept.whyItMatters}
            </p>
            {concept.reviewedAt ? (
              <p className="text-muted mt-5 text-xs">
                Glossary wording reviewed {concept.reviewedAt}.
              </p>
            ) : (
              <p className="text-muted mt-5 text-xs">
                Educational wording is still marked as awaiting source review in
                Trading Guide&apos;s glossary.
              </p>
            )}
            {concept.sources.length > 0 && (
              <div className="border-border mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4">
                {concept.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue text-xs font-semibold underline"
                  >
                    {source.label} ↗
                  </a>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>

      <section aria-labelledby="platform-example-title">
        <h2
          id="platform-example-title"
          className="font-display text-navy text-2xl font-bold"
        >
          See the structure recorded for a platform
        </h2>
        <p className="text-muted mt-2 max-w-3xl leading-7">
          This section reads Trading Guide&apos;s structured custody records. A
          row marked unverified is shown as unverified rather than treated as
          confirmed.
        </p>
        {rows.length === 0 ? (
          <Card className="mt-5">
            <p className="text-muted">No custody records are available yet.</p>
          </Card>
        ) : (
          <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <Card>
              <label
                htmlFor="custody-platform"
                className="text-navy block text-sm font-bold"
              >
                Platform
              </label>
              <select
                id="custody-platform"
                value={offeringSlug}
                onChange={(event) => {
                  setOfferingSlug(event.target.value);
                  setMarketCode("");
                }}
                className="border-border bg-panel text-navy mt-2 min-h-12 w-full rounded-xl border px-3"
              >
                {offerings.map((offering) => (
                  <option key={offering.slug} value={offering.slug}>
                    {offering.name}
                  </option>
                ))}
              </select>
              <label
                htmlFor="custody-market"
                className="text-navy mt-5 block text-sm font-bold"
              >
                Market
              </label>
              <select
                id="custody-market"
                value={effectiveMarket}
                onChange={(event) => setMarketCode(event.target.value)}
                className="border-border bg-panel text-navy mt-2 min-h-12 w-full rounded-xl border px-3"
              >
                {markets.map((market) => (
                  <option key={market.code} value={market.code}>
                    {market.name}
                  </option>
                ))}
              </select>
            </Card>

            {selectedRow && (
              <div aria-live="polite">
                <Card>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
                        Recorded structure
                      </p>
                      <h3 className="font-display text-navy mt-2 text-2xl font-bold">
                        {custodyTypeCopy(selectedRow.custodyType).label}
                      </h3>
                      <p className="text-muted mt-1 text-sm">
                        {selectedRow.offeringName} ·{" "}
                        {selectedRow.marketName ?? "All markets"}
                      </p>
                    </div>
                    <VerificationBadge
                      status={selectedRow.verificationStatus}
                    />
                  </div>
                  <p className="text-muted mt-4 leading-7">
                    {custodyTypeCopy(selectedRow.custodyType).explainer}
                  </p>

                  <div
                    className="mt-5 grid gap-3 sm:grid-cols-3"
                    aria-label="What this structure means"
                  >
                    {selectedFacts.map((fact) => (
                      <div
                        key={fact.label}
                        className="border-border rounded-xl border p-3"
                      >
                        <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                          {fact.label}
                        </p>
                        <p className="text-navy mt-1 font-bold">{fact.value}</p>
                        <p className="text-muted mt-2 text-xs leading-5">
                          {fact.detail}
                        </p>
                      </div>
                    ))}
                  </div>

                  <dl className="border-border mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2">
                    <div>
                      <dt className="text-muted text-xs font-semibold tracking-wide uppercase">
                        HIN support
                      </dt>
                      <dd className="text-navy mt-1 font-bold">
                        {selectedRow.hinSupported === true
                          ? "Yes"
                          : selectedRow.hinSupported === false
                            ? "No"
                            : "Not confirmed"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted text-xs font-semibold tracking-wide uppercase">
                        Last verified
                      </dt>
                      <dd className="text-navy mt-1 font-bold">
                        {formatDate(selectedRow.verifiedAt)}
                      </dd>
                    </div>
                    {selectedRow.reviewDueAt && (
                      <div>
                        <dt className="text-muted text-xs font-semibold tracking-wide uppercase">
                          Review due
                        </dt>
                        <dd className="text-navy mt-1 font-bold">
                          {formatDate(selectedRow.reviewDueAt)}
                        </dd>
                      </div>
                    )}
                    {selectedRow.custodianName && (
                      <div>
                        <dt className="text-muted text-xs font-semibold tracking-wide uppercase">
                          Custodian
                        </dt>
                        <dd className="text-navy mt-1 font-bold">
                          {selectedRow.custodianName}
                        </dd>
                      </div>
                    )}
                  </dl>
                  {selectedRow.description && (
                    <div className="border-border mt-5 border-t pt-5">
                      <h4 className="text-navy font-bold">Record notes</h4>
                      <p className="text-muted mt-2 text-sm leading-6">
                        {selectedRow.description}
                      </p>
                    </div>
                  )}
                  <div className="border-border mt-5 border-t pt-5">
                    <h4 className="text-navy font-bold">Evidence</h4>
                    {selectedRow.verificationStatus !== "VERIFIED" && (
                      <p className="text-muted mt-2 text-sm leading-6">
                        This record is not treated as confirmed. Use the linked
                        evidence as a research lead and verify the current
                        provider documentation directly.
                      </p>
                    )}
                    {selectedRow.sourceUrl ? (
                      <a
                        href={selectedRow.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue mt-2 inline-block text-sm font-semibold underline"
                      >
                        View source ↗
                      </a>
                    ) : (
                      <p className="text-muted mt-2 text-sm">
                        No source URL is recorded for this row.
                      </p>
                    )}
                  </div>
                  <div className="mt-5">
                    <Link
                      href={`/share-trading/${selectedRow.offeringSlug}`}
                      className="text-blue text-sm font-semibold underline"
                    >
                      Open platform profile →
                    </Link>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
