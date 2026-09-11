"use client";

import { useState } from "react";
import { SOURCE_TYPES } from "@/lib/articles/validation";

type SourceType = (typeof SOURCE_TYPES)[number];

interface Row {
  label: string;
  url: string;
  sourceType?: SourceType;
}

/**
 * Sources & evidence (Req.md §14 / §7). Kept as its own repeatable-row
 * widget rather than a textarea convention like tags/key-takeaways because
 * a URL needs its own input (no safe delimiter-splitting), and source
 * quality is a visible trust signal for this YMYL content.
 */
export function SourcesEditor({ initialValue }: { initialValue: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initialValue);

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }
  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }
  function addRow() {
    setRows((prev) => [...prev, { label: "", url: "", sourceType: undefined }]);
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="sourcesJson" value={JSON.stringify(rows)} />
      {rows.map((row, i) => (
        <div key={i} className="flex flex-wrap items-end gap-2 rounded-lg border border-border p-3">
          <label className="flex flex-1 min-w-[160px] flex-col text-xs">
            <span className="mb-1 text-muted">Label</span>
            <input
              value={row.label}
              onChange={(e) => updateRow(i, { label: e.target.value })}
              placeholder="ASIC Digital Assets Framework"
              className="rounded-lg border border-border bg-panel-secondary px-3 py-1.5 text-sm text-navy"
            />
          </label>
          <label className="flex flex-[2] min-w-[220px] flex-col text-xs">
            <span className="mb-1 text-muted">URL</span>
            <input
              value={row.url}
              onChange={(e) => updateRow(i, { url: e.target.value })}
              placeholder="https://asic.gov.au/..."
              className="rounded-lg border border-border bg-panel-secondary px-3 py-1.5 text-sm text-navy"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="mb-1 text-muted">Source type</span>
            <select
              value={row.sourceType ?? ""}
              onChange={(e) => updateRow(i, { sourceType: (e.target.value || undefined) as SourceType | undefined })}
              className="rounded-lg border border-border bg-panel-secondary px-3 py-1.5 text-sm text-navy"
            >
              <option value="">Unspecified</option>
              {SOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-panel-secondary"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-navy hover:bg-panel-secondary"
      >
        + Add source
      </button>
    </div>
  );
}