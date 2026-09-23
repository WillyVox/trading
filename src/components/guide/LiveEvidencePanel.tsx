import Link from "next/link";
import { Card } from "@/components/ui/Card";

export type EvidenceCell = { value: string; detail?: string };
export type EvidenceRow = {
  label: string;
  href?: string;
  sourceUrl?: string | null;
  verifiedAt?: string | null;
  cells: EvidenceCell[];
};

function reviewed(value?: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function LiveEvidencePanel({
  title,
  description,
  columns,
  rows,
  note,
}: {
  title: string;
  description: string;
  columns: string[];
  rows: EvidenceRow[];
  note: string;
}) {
  if (!rows.length) return null;
  return (
    <Card className="mt-8 overflow-hidden">
      <div className="border-border border-b pb-5">
        <p className="text-gold font-mono text-xs font-semibold tracking-[0.14em] uppercase">
          Live provider evidence
        </p>
        <h2 className="font-display text-navy mt-2 text-xl font-bold">
          {title}
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">{description}</p>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="text-navy px-3 py-3 font-semibold">
                Provider / rule
              </th>
              {columns.map((column) => (
                <th key={column} className="text-navy px-3 py-3 font-semibold">
                  {column}
                </th>
              ))}
              <th className="text-navy px-3 py-3 font-semibold">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${row.label}-${index}`}
                className="border-border border-b last:border-b-0"
              >
                <td className="px-3 py-4 align-top">
                  {row.href ? (
                    <Link
                      href={row.href}
                      className="text-navy decoration-gold-soft font-semibold underline underline-offset-4"
                    >
                      {row.label}
                    </Link>
                  ) : (
                    <span className="text-navy font-semibold">{row.label}</span>
                  )}
                </td>
                {row.cells.map((cell, i) => (
                  <td key={i} className="px-3 py-4 align-top">
                    <div className="text-text font-semibold">{cell.value}</div>
                    {cell.detail ? (
                      <div className="text-muted mt-1 max-w-[220px] text-xs leading-5">
                        {cell.detail}
                      </div>
                    ) : null}
                  </td>
                ))}
                <td className="text-muted px-3 py-4 align-top text-xs leading-5">
                  <div>Verified {reviewed(row.verifiedAt)}</div>
                  {row.sourceUrl ? (
                    <a
                      href={row.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue mt-1 inline-block font-semibold underline"
                    >
                      Official source ↗
                    </a>
                  ) : (
                    <span className="mt-1 block">Source link unavailable</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted mt-5 text-xs leading-5">{note}</p>
    </Card>
  );
}
