export function KeyTakeaways({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-gold-soft bg-panel-secondary p-5">
      <p className="font-display text-sm font-bold uppercase tracking-wide text-navy">Key takeaways</p>
      <ul className="mt-3 space-y-2 text-sm text-navy">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden="true" className="text-gold">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
