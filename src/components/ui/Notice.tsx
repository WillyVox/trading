export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-gold-soft bg-panel-secondary text-navy rounded-xl border px-4 py-3.5 text-sm">
      {children}
    </div>
  );
}
