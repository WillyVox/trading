import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

/**
 * Hash a plaintext password for storage in User.passwordHash.
 *
 * Uses scrypt (Node's built-in, no extra dependency like bcrypt) with a
 * random per-password salt. Stored format: "salt:hash", both hex-encoded,
 * so verifyPassword() doesn't need a separate salt column.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a plaintext password against a stored "salt:hash" value.
 * Uses a constant-time comparison to avoid leaking timing information.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, "hex");
  const storedHash = Buffer.from(hashHex, "hex");
  const derivedKey = await scrypt(password, salt, storedHash.length);

  return storedHash.length === derivedKey.length && timingSafeEqual(storedHash, derivedKey);
}

/**
 * Minimum password policy shared by register + admin-promote scripts.
 * Kept deliberately simple (length only) — swap in a stronger policy
 * (zxcvbn, breach list, etc.) before this goes to production.
 */
export function isPasswordAcceptable(password: string): boolean {
  return typeof password === "string" && password.length >= 8;
}
