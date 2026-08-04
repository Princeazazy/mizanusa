// Client portal password hashing.
//
// Legacy records used a bare, unsalted SHA-256 digest (64 hex chars) — fast to
// brute-force with a GPU. New records use PBKDF2-SHA256 with a random 16-byte
// salt and 210,000 iterations, stored as:
//   pbkdf2$sha256$<iterations>$<saltHex>$<derivedKeyHex>
// Legacy hashes are still verified so existing clients can sign in, then are
// transparently re-hashed to PBKDF2 on their next successful login.
import { sha256Hex, timingSafeEqual } from "./cors.ts";

const ITERATIONS = 210_000;
const KEY_BITS = 256;

const toHex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const fromHex = (hex: string) =>
  new Uint8Array((hex.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16)));

const derive = async (password: string, salt: Uint8Array, iterations: number) => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    KEY_BITS,
  );
  return toHex(bits);
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await derive(password, salt, ITERATIONS);
  return `pbkdf2$sha256$${ITERATIONS}$${toHex(salt.buffer)}$${derived}`;
};

export const isLegacyHash = (stored: string): boolean =>
  !stored.startsWith("pbkdf2$");

/** Constant-time verification against either format. */
export const verifyPassword = async (
  password: string,
  stored: string,
): Promise<boolean> => {
  if (isLegacyHash(stored)) {
    return timingSafeEqual(await sha256Hex(password), stored);
  }
  const [, , iterationsRaw, saltHex, expected] = stored.split("$");
  const iterations = Number(iterationsRaw);
  if (!Number.isFinite(iterations) || !saltHex || !expected) return false;
  const derived = await derive(password, fromHex(saltHex), iterations);
  return timingSafeEqual(derived, expected);
};
