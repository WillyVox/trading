export function GuideSourceList({
  sources,
}: {
  sources: { id: string; label: string; url: string }[];
}) {
  if (sources.length === 0) return null;

  return (
    <section className="border-border mt-10 border-t pt-6">
      <h2 className="font-display text-navy text-lg font-bold">Sources</h2>
      <ul className="mt-3 space-y-1.5 text-sm">
        {sources.map((s) => (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-blue hover:text-navy underline underline-offset-2"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
