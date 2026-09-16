/**
 * Pill-shaped eyebrow badge, e.g. "● DOMAIN SPECIALISTS SINCE 1997 · AVAILABLE
 * FOR ACQUISITION" in the reference theme — monospace, wide tracking, small dot.
 */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-gold-soft bg-panel text-navy inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs font-medium tracking-[0.08em] uppercase">
      <span
        className="bg-gold h-1.5 w-1.5 shrink-0 rounded-full"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
