"use client";
export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="border-border bg-panel rounded-xl border p-6">
      <h1 className="font-display text-navy text-2xl font-bold">
        Admin data unavailable
      </h1>
      <p className="text-muted mt-2">
        The admin area could not load its data. Check the application/database
        service and try again.
      </p>
      <button
        onClick={() => reset()}
        className="bg-navy mt-5 rounded-lg px-4 py-2 font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
