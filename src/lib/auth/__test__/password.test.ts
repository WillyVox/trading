import assert from "node:assert/strict";
import { randomBytes, scrypt } from "node:crypto";
import test from "node:test";
import { promisify } from "node:util";
import {
  hashPassword,
  isPasswordAcceptable,
  passwordNeedsRehash,
  verifyPassword,
} from "../password";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

/** A hash exactly as the pre-versioning code produced it ("salt:hash", Node defaults). */
async function legacyHash(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, 64);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

test("new hashes use the versioned format and verify", async () => {
  const stored = await hashPassword("correct horse battery");
  assert.match(stored, /^scrypt\$65536\$8\$2\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
  assert.equal(await verifyPassword("correct horse battery", stored), true);
  assert.equal(await verifyPassword("wrong password", stored), false);
  assert.equal(passwordNeedsRehash(stored), false);
});

test("the same password hashes differently each time (random salt)", async () => {
  const a = await hashPassword("same password");
  const b = await hashPassword("same password");
  assert.notEqual(a, b);
});

test("legacy hashes still verify and are flagged for upgrade", async () => {
  const stored = await legacyHash("old account password");
  assert.equal(await verifyPassword("old account password", stored), true);
  assert.equal(await verifyPassword("nope", stored), false);
  assert.equal(passwordNeedsRehash(stored), true);
});

test("malformed or out-of-bounds stored values fail closed without throwing", async () => {
  const salt = "aa".repeat(16);
  const hash = "bb".repeat(64);
  const bad = [
    "",
    "not-a-hash",
    "a:b",
    `zz:${hash}`,
    `${salt}:${hash}:extra`,
    `scrypt$65536$8$2$${salt}`,
    `scrypt$65535$8$2$${salt}$${hash}`, // N not a power of two
    `scrypt$1073741824$8$2$${salt}$${hash}`, // N far above the accepted maximum
    `scrypt$65536$64$2$${salt}$${hash}`, // r above the accepted maximum
    `scrypt$65536$8$99$${salt}$${hash}`, // p above the accepted maximum
    `scrypt$65536$8$2$xyz$${hash}`,
  ];
  for (const stored of bad) {
    assert.equal(await verifyPassword("anything", stored), false, stored);
    assert.equal(passwordNeedsRehash(stored), false, stored);
  }
});

test("password policy enforces both a minimum and a maximum length", () => {
  assert.equal(isPasswordAcceptable("short"), false);
  assert.equal(isPasswordAcceptable("12345678"), true);
  assert.equal(isPasswordAcceptable("x".repeat(128)), true);
  assert.equal(isPasswordAcceptable("x".repeat(129)), false);
});
