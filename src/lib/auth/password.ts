import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  type ScryptOptions,
} from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions
) => Promise<Buffer>;

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

/**
 * Cost parameters for new hashes: N=2^16 (64 MiB), r=8, p=2. That is one of
 * the equivalent scrypt configurations in the OWASP Password Storage Cheat
 * Sheet (its minimum is N=2^17, r=8, p=1); it is used instead because it
 * needs half the memory per sign-in, which matters on serverless hosting.
 * Raise these together with a new format version if guidance changes --
 * hashes made with older parameters keep verifying and are upgraded on the
 * user's next successful sign-in (see passwordNeedsRehash).
 */
const CURRENT = { N: 2 ** 16, r: 8, p: 2 } as const;

/** Node's scrypt defaults, which is what every hash before the versioned format used. */
const LEGACY = { N: 16384, r: 8, p: 1 } as const;

// Bounds applied to parameters read back from storage, so a corrupted or
// tampered row can't make verification allocate unbounded memory.
const MIN_N = 2 ** 14;
const MAX_N = 2 ** 17;
const MAX_R = 8;
const MAX_P = 4;

// scrypt needs roughly 128 * N * r bytes; the largest accepted parameters
// (N=2^17, r=8) need 128 MiB, so 256 MiB leaves headroom.
const MAX_MEMORY = 256 * 1024 * 1024;

const HEX = /^[0-9a-f]+$/i;

type ScryptParams = { N: number; r: number; p: number };
type ParsedHash = ScryptParams & { salt: Buffer; hash: Buffer };

function isPowerOfTwo(value: number): boolean {
  return Number.isInteger(value) && value > 0 && (value & (value - 1)) === 0;
}

function withinBounds({ N, r, p }: ScryptParams): boolean {
  return (
    isPowerOfTwo(N) &&
    N >= MIN_N &&
    N <= MAX_N &&
    Number.isInteger(r) &&
    r >= 1 &&
    r <= MAX_R &&
    Number.isInteger(p) &&
    p >= 1 &&
    p <= MAX_P
  );
}

function parseHex(value: string, minBytes: number): Buffer | null {
  if (value.length % 2 !== 0 || !HEX.test(value)) return null;
  const bytes = Buffer.from(value, "hex");
  return bytes.length >= minBytes ? bytes : null;
}

/**
 * Two stored formats are understood:
 *   current: "scrypt$N$r$p$saltHex$hashHex"   (parameters travel with the hash)
 *   legacy:  "saltHex:hashHex"                 (Node's default scrypt parameters)
 */
function parseStoredHash(stored: string): ParsedHash | null {
  if (stored.startsWith("scrypt$")) {
    const parts = stored.split("$");
    if (parts.length !== 6) return null;
    const params = {
      N: Number(parts[1]),
      r: Number(parts[2]),
      p: Number(parts[3]),
    };
    if (!withinBounds(params)) return null;
    const salt = parseHex(parts[4], 8);
    const hash = parseHex(parts[5], 16);
    return salt && hash ? { ...params, salt, hash } : null;
  }

  const parts = stored.split(":");
  if (parts.length !== 2) return null;
  const salt = parseHex(parts[0], 8);
  const hash = parseHex(parts[1], 16);
  return salt && hash ? { ...LEGACY, salt, hash } : null;
}

function derive(
  password: string,
  salt: Buffer,
  keyLength: number,
  { N, r, p }: ScryptParams
) {
  return scrypt(password, salt, keyLength, { N, r, p, maxmem: MAX_MEMORY });
}

/**
 * Hash a plaintext password for storage in User.passwordHash, in the
 * versioned format above: a random per-password salt, with the cost
 * parameters stored alongside so they can be raised later.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = await derive(password, salt, KEY_LENGTH, CURRENT);
  return [
    "scrypt",
    CURRENT.N,
    CURRENT.r,
    CURRENT.p,
    salt.toString("hex"),
    derivedKey.toString("hex"),
  ].join("$");
}

/**
 * Verify a plaintext password against a stored hash in either format, using
 * a constant-time comparison. A malformed stored value verifies as false
 * rather than throwing.
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const parsed = parseStoredHash(stored);
  if (!parsed) return false;

  const derivedKey = await derive(
    password,
    parsed.salt,
    parsed.hash.length,
    parsed
  );
  return (
    parsed.hash.length === derivedKey.length &&
    timingSafeEqual(parsed.hash, derivedKey)
  );
}

/** True when a stored hash uses the legacy format or weaker parameters than CURRENT -- re-hash it while the plaintext is at hand (right after a successful sign-in). */
export function passwordNeedsRehash(stored: string): boolean {
  const parsed = parseStoredHash(stored);
  if (!parsed) return false;
  return (
    !stored.startsWith("scrypt$") ||
    parsed.N !== CURRENT.N ||
    parsed.r !== CURRENT.r ||
    parsed.p !== CURRENT.p
  );
}

const MIN_PASSWORD_LENGTH = 8;
/** Upper bound so an oversized request body can't be pushed through the hasher. */
export const MAX_PASSWORD_LENGTH = 128;

export const PASSWORD_POLICY_MESSAGE = `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`;

/**
 * Minimum password policy shared by register + admin-promote scripts. Length
 * only: there is no breached-password or strength check yet -- see
 * docs/SECURITY.md.
 */
export function isPasswordAcceptable(password: string): boolean {
  return (
    typeof password === "string" &&
    password.length >= MIN_PASSWORD_LENGTH &&
    password.length <= MAX_PASSWORD_LENGTH
  );
}
