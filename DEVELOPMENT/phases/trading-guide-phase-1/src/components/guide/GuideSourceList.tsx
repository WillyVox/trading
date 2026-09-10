export function GuideSourceList({ sources }: { sources: { id: string; label: string; url: string }[] }) {
  if (sources.length === 0) return null;

  return (
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="font-display text-lg font-bold text-navy">Sources</h2>
      <ul className="mt-3 space-y-1.5 text-sm">
        {sources.map((s) => (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-blue underline underline-offset-2 hover:text-navy"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
