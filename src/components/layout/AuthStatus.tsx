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
  const user = session?.user as
    { name?: string | null; email?: string | null; role?: string } | undefined;

  if (status === "loading") {
    // Fixed-size skeleton so there's no layout shift once the real session resolves.
    return (
      <div
        aria-hidden
        className={
          variant === "desktop"
            ? "bg-panel-secondary h-9 w-20 animate-pulse rounded-full"
            : "bg-panel-secondary h-11 w-full animate-pulse rounded-full"
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
          <Link
            href="/admin"
            className="text-navy/80 hover:text-navy text-sm font-medium transition-colors"
          >
            Admin
          </Link>
        )}
        <span
          className="text-muted max-w-[160px] truncate text-sm"
          title={user.name ?? user.email ?? undefined}
        >
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
        className="bg-navy text-background hover:bg-navy-dark block w-full rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-colors"
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
          className="text-muted hover:bg-panel-secondary hover:text-navy rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
        >
          Admin
        </Link>
      )}
      <div
        className="text-muted truncate px-3 text-sm"
        title={user.name ?? user.email ?? undefined}
      >
        Signed in as {user.name || user.email}
      </div>
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          signOut();
        }}
        className="border-border bg-panel-secondary text-navy hover:bg-border w-full rounded-full border px-4 py-2.5 text-sm font-medium transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
