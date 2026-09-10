/**
 * Pill-shaped eyebrow badge, e.g. "● DOMAIN SPECIALISTS SINCE 1997 · AVAILABLE
 * FOR ACQUISITION" in the reference theme — monospace, wide tracking, small dot.
 */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gold-soft bg-panel px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-navy">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
      {children}
    </div>
  );
}
