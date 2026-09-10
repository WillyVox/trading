"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

type AuthStatusProps = {
  /** "desktop" renders inline in the header bar; "mobile" renders stacked inside the nav drawer. */
  variant: "desktop" | "mobile";
  /** Mobile drawer closes itself on nav — let it close on sign-in/out too. */
  onNavigate?: () => void;
};

export function AuthStatus({ variant, onNavigate }: AuthStatusProps) {
  const { data: session, status } = useSession();
  const user = session?.user as { name?: string | null; email?: string | null; role?: string } | undefined;

  if (status === "loading") {
    // Fixed-size skeleton so there's no layout shift once the real session resolves.
    return (
      <div
        aria-hidden
        className={
          variant === "desktop"
            ? "h-9 w-20 animate-pulse rounded-full bg-panel-secondary"
            : "h-11 w-full animate-pulse rounded-full bg-panel-secondary"
        }
      />
    );
  }

  if (variant === "desktop") {
    if (!user) {
      return (
        <Button href="/login" variant="secondary">
          Sign in
        </Button>
      );
    }
    return (
      <div className="flex items-center gap-3">
        {user.role === "ADMIN" && (
          <Link href="/admin" className="text-sm font-medium text-navy/80 transition-colors hover:text-navy">
            Admin
          </Link>
        )}
        <span className="max-w-[160px] truncate text-sm text-muted" title={user.name ?? user.email ?? undefined}>
          {user.name || user.email}
        </span>
        <Button variant="secondary" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  // Mobile drawer
  if (!user) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className="block w-full rounded-full bg-navy px-4 py-2.5 text-center text-sm font-semibold text-background transition-colors hover:bg-navy-dark"
      >
        Sign in
      </Link>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {user.role === "ADMIN" && (
        <Link
          href="/admin"
          onClick={onNavigate}
          className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-panel-secondary hover:text-navy"
        >
          Admin
        </Link>
      )}
      <div className="truncate px-3 text-sm text-muted" title={user.name ?? user.email ?? undefined}>
        Signed in as {user.name || user.email}
      </div>
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          signOut();
        }}
        className="w-full rounded-full border border-border bg-panel-secondary px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-border"
      >
        Sign out
      </button>
    </div>
  );
}
