import { createRateLimiter, type RateLimitRule } from "./rate-limit";
import { prismaRateLimitStore } from "./rate-limit-store";

const MINUTE = 60 * 1000;

/**
 * Failed sign-ins per account and per network address. The per-account rule
 * stops guessing against one email from many addresses; the per-address rule
 * stops one address trying many emails. The trade-off is that someone can
 * deliberately fail attempts against another person's email to lock it for
 * up to the window -- accepted for now because accounts are low-value; the
 * only privileged accounts are admins, who are created out-of-band.
 */
export const LOGIN_FAILURES_BY_EMAIL: RateLimitRule = {
  name: "login-fail-email",
  limit: 5,
  windowMs: 15 * MINUTE,
};

export const LOGIN_FAILURES_BY_IP: RateLimitRule = {
  name: "login-fail-ip",
  limit: 20,
  windowMs: 15 * MINUTE,
};

export const REGISTRATIONS_BY_IP: RateLimitRule = {
  name: "register-ip",
  limit: 5,
  windowMs: 60 * MINUTE,
};

export const LOGIN_LOCKOUT_MESSAGE =
  "Too many failed sign-in attempts. Please wait 15 minutes and try again.";

const limiter = createRateLimiter(prismaRateLimitStore, {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "",
});

export async function isLoginThrottled(
  email: string,
  ip: string | null
): Promise<boolean> {
  if (await limiter.isLimited(LOGIN_FAILURES_BY_EMAIL, email)) return true;
  return ip ? limiter.isLimited(LOGIN_FAILURES_BY_IP, ip) : false;
}

export async function recordLoginFailure(
  email: string,
  ip: string | null
): Promise<void> {
  await limiter.record(LOGIN_FAILURES_BY_EMAIL, email);
  if (ip) await limiter.record(LOGIN_FAILURES_BY_IP, ip);
}

export async function clearLoginFailures(email: string): Promise<void> {
  await limiter.clear(LOGIN_FAILURES_BY_EMAIL, email);
}

/** Counts a sign-up attempt; false means the address is over its allowance. When the address is unknown the per-address limit can't apply, so the attempt is allowed. */
export async function allowRegistration(ip: string | null): Promise<boolean> {
  if (!ip) return true;
  return limiter.consume(REGISTRATIONS_BY_IP, ip);
}
