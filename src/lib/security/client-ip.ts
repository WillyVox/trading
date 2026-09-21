type HeaderReader = { get(name: string): string | null };

/**
 * Best-effort client IP for rate limiting, or null when it can't be
 * determined.
 *
 * x-forwarded-for is only trustworthy when the hosting platform overwrites
 * it (Vercel does). If this app is ever served behind a proxy that appends
 * to a client-supplied value instead, the left-most entry can be spoofed and
 * per-IP limits become bypassable -- the per-account limits still apply.
 *
 * Returns null rather than a placeholder such as "unknown": a shared
 * placeholder would put every unidentifiable visitor into one bucket, and
 * one abuser could then lock everyone out.
 */
export function getClientIp(headers: HeaderReader): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headers.get("x-real-ip")?.trim();
  return real || null;
}
