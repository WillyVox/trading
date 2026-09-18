/**
 * Admin-preview-only notice for an embed marker the renderer couldn't
 * (yet) render — either because the marker type isn't implemented (most
 * embed types are Block 4 — see docs/IMPLEMENTATION-PLAN.md) or because a
 * `video` marker's arguments didn't validate. Never rendered on public
 * pages — renderArticleContent() only passes context: "preview" from the
 * admin preview route, so a malformed or not-yet-supported marker simply
 * renders nothing for visitors (Req.md §23: "never a runtime crash on the
 * public page").
 */
export function EmbedPlaceholder({
  type,
  argsRaw,
  invalid = false,
}: {
  type: string;
  argsRaw: string;
  invalid?: boolean;
}) {
  const marker = `{{${type}${argsRaw ? `:${argsRaw}` : ""}}}`;

  return (
    <div
      className={
        invalid
          ? "border-red/30 bg-red/10 text-navy my-6 rounded-xl border p-4 text-sm"
          : "border-gold-soft bg-panel-secondary text-navy my-6 rounded-xl border border-dashed p-4 text-sm"
      }
    >
      <p className="font-semibold">
        {invalid
          ? "Invalid embed configuration: "
          : "Embed not yet available: "}
        <code className="font-mono">{marker}</code>
      </p>
      <p className="text-muted mt-1">
        {invalid
          ? "This marker's arguments couldn't be validated, so nothing will render here on the public page."
          : "This block type isn't implemented yet. It won't render on the public page until it is."}
      </p>
    </div>
  );
}
