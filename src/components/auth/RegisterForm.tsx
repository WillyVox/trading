'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { registerAction, type AuthFormState } from '@/lib/auth/actions';

const initialState: AuthFormState = undefined;

const FIELD =
  'w-full rounded-lg border border-border bg-panel px-3.5 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold-soft';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-navy text-background hover:bg-navy-dark inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Creating account…' : 'Create account'}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4 text-left">
      {state?.error && (
        <div className="border-red/30 bg-red/10 text-red rounded-lg border px-3.5 py-2.5 text-sm">
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-navy text-sm font-medium">
          Name <span className="text-muted">(optional)</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className={FIELD}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-navy text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={FIELD}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-navy text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={FIELD}
        />
        <p className="text-muted text-xs">At least 8 characters.</p>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-navy text-sm font-medium"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={FIELD}
        />
      </div>

      <SubmitButton />

      <p className="text-muted text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-navy font-semibold hover:underline">
          Sign in
        </Link>
      </p>

      <p className="text-muted text-center text-xs">
        New accounts start as a standard user. Admin access is granted
        separately.
      </p>
    </form>
  );
}
