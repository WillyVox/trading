import type { ReactNode } from "react";

export function ToolShell({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">{children}</div>;
}

export function ToolPanel({ children, labelledBy, live = false }: { children: ReactNode; labelledBy: string; live?: boolean }) {
  return <section aria-labelledby={labelledBy} aria-live={live ? "polite" : undefined} className="border-border bg-panel min-w-0 rounded-2xl border p-5 md:p-6">{children}</section>;
}
