/**
 * Global non-blocking loading indicator used by the App Router loading boundary.
 *
 * This intentionally represents a user-visible route transition rather than
 * individual Prisma/fetch calls. Background work such as analytics, affiliate
 * logging and type-ahead search should keep its own local pending UI instead of
 * blocking the whole viewport.
 */
export function GlobalRouteLoading() {
  return (
    <div
      className="global-route-loading"
      role="status"
      aria-live="polite"
      aria-label="Loading Trading Guide content"
    >
      <div className="global-route-loading__progress" aria-hidden="true" />
      <div className="global-route-loading__status">
        <span className="global-route-loading__spinner" aria-hidden="true" />
        <span>Loading latest data…</span>
      </div>
      <span className="sr-only">Loading Trading Guide content…</span>
    </div>
  );
}
