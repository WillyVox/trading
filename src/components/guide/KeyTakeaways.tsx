export function KeyTakeaways({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="border-gold-soft bg-panel-secondary mt-8 rounded-2xl border p-5">
      <p className="font-display text-navy text-sm font-bold tracking-wide uppercase">
        Key takeaways
      </p>
      <ul className="text-navy mt-3 space-y-2 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden="true" className="text-gold">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
