"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { hashPassword, isPasswordAcceptable } from "./password";

export type AuthFormState = { error?: string } | undefined;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function loginAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    // Don't distinguish "no such user" from "wrong password" in the
    // message — that distinction just helps an attacker enumerate emails.
    if (err instanceof AuthError) {
      return { error: "Incorrect email or password." };
    }
    throw err;
  }

  redirect("/");
}

export async function registerAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!isPasswordAcceptable(password)) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Same reasoning as login: don't reveal whether the account is a
    // password account or (in future) an OAuth-only one.
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await hashPassword(password);

  // New accounts always land as USER — promotion to ADMIN is a deliberate,
  // out-of-band action (see scripts/promote-admin.ts), never something a
  // registration form can grant itself.
  await prisma.user.create({
    data: { name: name || null, email, passwordHash },
  });

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      // Account was created fine; only the auto-login failed. Send them to
      // sign in manually rather than surfacing this as a failed signup.
      redirect("/login");
    }
    throw err;
  }

  redirect("/");
}

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect("/");
}
