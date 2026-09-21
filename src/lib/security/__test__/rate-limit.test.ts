import assert from "node:assert/strict";
import test from "node:test";
import {
  createRateLimiter,
  type RateLimitRule,
  type RateLimitStore,
} from "../rate-limit";

/** In-memory store standing in for Postgres. */
function memoryStore() {
  const rows: { key: string; at: Date }[] = [];
  const store: RateLimitStore = {
    async record(key, at) {
      rows.push({ key, at });
    },
    async count(key, since) {
      return rows.filter((r) => r.key === key && r.at > since).length;
    },
    async clear(key) {
      for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i].key === key) rows.splice(i, 1);
      }
    },
    async prune(before) {
      for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i].at < before) rows.splice(i, 1);
      }
    },
  };
  return { rows, store };
}

const RULE: RateLimitRule = { name: "test", limit: 3, windowMs: 60_000 };

function setup() {
  const { rows, store } = memoryStore();
  let nowMs = Date.UTC(2026, 8, 21, 0, 0, 0);
  const limiter = createRateLimiter(store, {
    secret: "test-secret",
    now: () => new Date(nowMs),
    random: () => 1, // never prune unless a test asks
  });
  return {
    rows,
    store,
    limiter,
    advance(ms: number) {
      nowMs += ms;
    },
  };
}

test("isLimited only flips once the allowance is used up", async () => {
  const { limiter } = setup();
  assert.equal(await limiter.isLimited(RULE, "a@example.com"), false);
  await limiter.record(RULE, "a@example.com");
  await limiter.record(RULE, "a@example.com");
  assert.equal(await limiter.isLimited(RULE, "a@example.com"), false);
  await limiter.record(RULE, "a@example.com");
  assert.equal(await limiter.isLimited(RULE, "a@example.com"), true);
});

test("counters are per identifier and per rule", async () => {
  const { limiter } = setup();
  for (let i = 0; i < 3; i++) await limiter.record(RULE, "a@example.com");
  assert.equal(await limiter.isLimited(RULE, "a@example.com"), true);
  assert.equal(await limiter.isLimited(RULE, "b@example.com"), false);
  assert.equal(
    await limiter.isLimited({ ...RULE, name: "other" }, "a@example.com"),
    false
  );
});

test("events fall out of the window", async () => {
  const { limiter, advance } = setup();
  for (let i = 0; i < 3; i++) await limiter.record(RULE, "a@example.com");
  assert.equal(await limiter.isLimited(RULE, "a@example.com"), true);
  advance(RULE.windowMs + 1);
  assert.equal(await limiter.isLimited(RULE, "a@example.com"), false);
});

test("consume allows exactly `limit` events then refuses", async () => {
  const { limiter } = setup();
  const results: boolean[] = [];
  for (let i = 0; i < 5; i++) results.push(await limiter.consume(RULE, "ip-1"));
  assert.deepEqual(results, [true, true, true, false, false]);
});

test("clear forgets an identifier", async () => {
  const { limiter } = setup();
  for (let i = 0; i < 3; i++) await limiter.record(RULE, "a@example.com");
  await limiter.clear(RULE, "a@example.com");
  assert.equal(await limiter.isLimited(RULE, "a@example.com"), false);
});

test("stored keys never contain the raw identifier", async () => {
  const { limiter, rows } = setup();
  await limiter.record(RULE, "person@example.com");
  await limiter.record(RULE, "203.0.113.7");
  for (const row of rows) {
    assert.ok(!row.key.includes("person"), row.key);
    assert.ok(!row.key.includes("203.0.113.7"), row.key);
    assert.match(row.key, /^test:[0-9a-f]{32}$/);
  }
});

test("different secrets give different keys for the same identifier", async () => {
  const a = memoryStore();
  const b = memoryStore();
  const la = createRateLimiter(a.store, { secret: "one", random: () => 1 });
  const lb = createRateLimiter(b.store, { secret: "two", random: () => 1 });
  await la.record(RULE, "same");
  await lb.record(RULE, "same");
  assert.notEqual(a.rows[0].key, b.rows[0].key);
});

test("old rows are pruned when the random draw hits", async () => {
  const { rows, store } = memoryStore();
  let nowMs = Date.UTC(2026, 8, 21);
  const limiter = createRateLimiter(store, {
    secret: "s",
    now: () => new Date(nowMs),
    random: () => 0, // always prune
    retentionMs: 1000,
  });
  await limiter.record(RULE, "x");
  nowMs += 5000;
  await limiter.record(RULE, "y");
  assert.equal(rows.length, 1);
});
