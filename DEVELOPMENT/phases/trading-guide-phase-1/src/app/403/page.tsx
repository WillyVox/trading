import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 — Forbidden",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-navy">403 — Forbidden</h1>
      <p className="mt-2 text-muted">You don&apos;t have permission to view this page.</p>
    </div>
  );
}
