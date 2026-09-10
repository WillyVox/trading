import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-navy">Sign in</h1>
      <p className="mt-2 text-muted">No auth provider is wired up yet — add one in src/lib/auth/config.ts.</p>
    </div>
  );
}
