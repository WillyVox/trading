import { createHmac } from "crypto";

/**
 * Sliding-window rate limiter. The storage is injected, so the logic here is
 * unit-testable without a database; the Postgres-backed store lives in
 * rate-limit-store.ts.
 *
 * Identifiers (emails, IPs) are never stored raw: they are HMAC-hashed with a
 * server secret before becoming part of a key, so the table holds no
 * personal data and can't be reversed by guessing.
 */

export interface RateLimitStore {
  record(key: string, at: Date): Promise<void>;
  count(key: string, since: Date): Promise<number>;
  clear(key: string): Promise<void>;
  prune(before: Date): Promise<void>;
}

export interface RateLimitRule {
  /** Namespace for the counter, e.g. "login-fail-email". */
  name: string;
  /** Maximum events allowed inside the window. */
  limit: number;
  windowMs: number;
}

export interface RateLimiterOptions {
  /** Secret for hashing identifiers. */
  secret?: string;
  now?: () => Date;
  random?: () => number;
  /** How long rows are kept before pruning. Must exceed the longest rule window. */
  retentionMs?: number;
  /** Chance (0-1) that a write also prunes old rows. */
  pruneProbability?: number;
}

const DEFAULT_RETENTION_MS = 24 * 60 * 60 * 1000;

export function createRateLimiter(
  store: RateLimitStore,
  options: RateLimiterOptions = {}
) {
  const secret = options.secret ?? "";
  const now = options.now ?? (() => new Date());
  const random = options.random ?? Math.random;
  const retentionMs = options.retentionMs ?? DEFAULT_RETENTION_MS;
  const pruneProbability = options.pruneProbability ?? 0.02;

  function keyFor(rule: RateLimitRule, identifier: string): string {
    const digest = createHmac("sha256", secret)
      .update(identifier)
      .digest("hex")
      .slice(0, 32);
    return `${rule.name}:${digest}`;
  }

  async function countInWindow(key: string, rule: RateLimitRule) {
    return store.count(key, new Date(now().getTime() - rule.windowMs));
  }

  async function maybePrune() {
    if (random() < pruneProbability) {
      await store.prune(new Date(now().getTime() - retentionMs));
    }
  }

  return {
    /** True once the identifier has used up the rule's allowance. Read-only. */
    async isLimited(rule: RateLimitRule, identifier: string) {
      const used = await countInWindow(keyFor(rule, identifier), rule);
      return used >= rule.limit;
    },

    /** Counts one event without checking it (e.g. a failed login). */
    async record(rule: RateLimitRule, identifier: string) {
      await store.record(keyFor(rule, identifier), now());
      await maybePrune();
    },

    /** Counts one event and reports whether it was within the allowance. */
    async consume(rule: RateLimitRule, identifier: string) {
      const key = keyFor(rule, identifier);
      await store.record(key, now());
      const used = await countInWindow(key, rule);
      await maybePrune();
      return used <= rule.limit;
    },

    /** Forgets an identifier's events (e.g. after a successful login). */
    async clear(rule: RateLimitRule, identifier: string) {
      await store.clear(keyFor(rule, identifier));
    },
  };
}

export type RateLimiter = ReturnType<typeof createRateLimiter>;
