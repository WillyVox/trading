"use client";

import { useState } from "react";
import { PROVIDER_RELATIONSHIPS } from "@/lib/articles/validation";

type Relationship = (typeof PROVIDER_RELATIONSHIPS)[number];
interface Row {
  providerId: string;
  relationship: Relationship;
}
interface ProviderOption {
  id: string;
  name: string;
  slug: string;
}

/**
 * Repeatable provider + relationship rows (Req.md's "link CoinSpot /
 * Kraken / Independent Reserve as COMPARED" workflow). Serializes to one
 * hidden JSON input (`providerRelationshipsJson`) rather than indexed field
 * names — the server action does a single JSON.parse instead of
 * reconstructing an array from `providers[0].id`, `providers[0].relationship`, etc.
 */
export function ProviderRelationshipsPicker({
  providers,
  initialValue,
}: {
  providers: ProviderOption[];
  initialValue: Row[];
}) {
  const [rows, setRows] = useState<Row[]>(initialValue);

  if (providers.length === 0) {
    return (
      <p className="text-muted text-sm">
        No providers exist yet — seed or add one before linking articles to
        them.
      </p>
    );
  }

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r))
    );
  }
  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }
  function addRow() {
    setRows((prev) => [
      ...prev,
      { providerId: providers[0].id, relationship: "MENTIONED" },
    ]);
  }

  return (
    <div className="space-y-2">
      <input
        type="hidden"
        name="providerRelationshipsJson"
        value={JSON.stringify(rows)}
      />
      {rows.map((row, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2">
          <select
            value={row.providerId}
            onChange={(e) => updateRow(i, { providerId: e.target.value })}
            className="border-border bg-panel-secondary text-navy min-w-[200px] rounded-lg border px-3 py-1.5 text-sm"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={row.relationship}
            onChange={(e) =>
              updateRow(i, { relationship: e.target.value as Relationship })
            }
            className="border-border bg-panel-secondary text-navy rounded-lg border px-3 py-1.5 text-sm"
          >
            {PROVIDER_RELATIONSHIPS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="border-border text-navy hover:bg-panel-secondary rounded-full border px-3 py-1 text-xs font-semibold"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="border-border text-navy hover:bg-panel-secondary rounded-full border px-4 py-1.5 text-xs font-semibold"
      >
        + Add provider relationship
      </button>
    </div>
  );
}
