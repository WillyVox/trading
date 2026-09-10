"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction, type AuthFormState } from "@/lib/auth/actions";

const initialState: AuthFormState = undefined;

const FIELD =
  "w-full rounded-lg border border-border bg-panel px-3.5 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold-soft";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4 text-left">
      {state?.error && (
        <div className="rounded-lg border border-red/30 bg-red/10 px-3.5 py-2.5 text-sm text-red">
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-navy">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={FIELD} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-navy">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={FIELD}
        />
      </div>

      <SubmitButton />

      <p className="text-center text-sm text-muted">
        No account?{" "}
        <Link href="/register" className="font-semibold text-navy hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
