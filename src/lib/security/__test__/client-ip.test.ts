import assert from "node:assert/strict";
import test from "node:test";
import { getClientIp } from "../client-ip";

const headers = (values: Record<string, string>) => ({
  get: (name: string) => values[name.toLowerCase()] ?? null,
});

test("uses the first x-forwarded-for entry", () => {
  assert.equal(
    getClientIp(headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" })),
    "203.0.113.7"
  );
});

test("falls back to x-real-ip", () => {
  assert.equal(
    getClientIp(headers({ "x-real-ip": "198.51.100.4" })),
    "198.51.100.4"
  );
});

test("returns null, not a shared placeholder, when nothing identifies the client", () => {
  assert.equal(getClientIp(headers({})), null);
  assert.equal(getClientIp(headers({ "x-forwarded-for": " , " })), null);
});
