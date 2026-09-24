"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { isDatabaseUnavailableError } from "@/lib/data/database-errors";
import { AUTH_SERVICE_UNAVAILABLE_MESSAGE } from "./service-unavailable";
import { getClientIp } from "@/lib/security/client-ip";
import {
  allowRegistration,
  isLoginThrottled,
  LOGIN_LOCKOUT_MESSAGE,
} from "@/lib/security/auth-throttle";
import {
  hashPassword,
  isPasswordAcceptable,
  PASSWORD_POLICY_MESSAGE,
} from "./password";

export type AuthFormState = { error?: string } | undefined;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Read-only pre-check so a locked-out visitor sees why, instead of the
  // generic "incorrect password" message. The counting itself happens in
  // the credentials provider's authorize().
  try {
    if (await isLoginThrottled(email, getClientIp(await headers()))) {
      return { error: LOGIN_LOCKOUT_MESSAGE };
    }
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return { error: AUTH_SERVICE_UNAVAILABLE_MESSAGE };
    }
    throw error;
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

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  // Counted before any validation or database work so scripted sign-ups
  // can't be used to probe emails or fill the users table.
  try {
    if (!(await allowRegistration(getClientIp(await headers())))) {
      return {
        error: "Too many sign-up attempts from this network. Try again later.",
      };
    }
  } catch (error) {
    // Registration is security-sensitive: if the durable limiter cannot be
    // consulted, fail closed rather than bypassing throttling.
    if (isDatabaseUnavailableError(error)) {
      return { error: AUTH_SERVICE_UNAVAILABLE_MESSAGE };
    }
    throw error;
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!isPasswordAcceptable(password)) {
    return { error: PASSWORD_POLICY_MESSAGE };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  let existing;
  try {
    existing = await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return { error: AUTH_SERVICE_UNAVAILABLE_MESSAGE };
    }
    throw error;
  }
  if (existing) {
    // Do not reveal whether this email already has an account. Keep the
    // response deliberately generic so registration cannot be used for
    // account enumeration.
    return { error: "Unable to create an account with those details." };
  }

  const passwordHash = await hashPassword(password);

  // New accounts always land as USER — promotion to ADMIN is a deliberate,
  // out-of-band action (see scripts/promote-admin.ts), never something a
  // registration form can grant itself.
  try {
    await prisma.user.create({
      data: { name: name || null, email, passwordHash },
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return { error: AUTH_SERVICE_UNAVAILABLE_MESSAGE };
    }
    throw error;
  }

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

  redirect("/?signup=success");
}

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect("/");
}
