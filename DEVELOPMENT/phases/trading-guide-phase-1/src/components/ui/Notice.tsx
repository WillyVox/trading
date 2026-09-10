export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gold-soft bg-panel-secondary px-4 py-3.5 text-sm text-navy">
      {children}
    </div>
  );
}
