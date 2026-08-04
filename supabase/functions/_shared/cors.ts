// Origin-restricted CORS. Wildcard `*` is never returned for these endpoints —
// they act on client financial data, so only our own surfaces may call them.
const ALLOWED_EXACT = new Set([
  "https://www.mizanusa.com",
  "https://mizanusa.com",
  "http://localhost:8080",
  "http://localhost:5173",
]);

/** Lovable preview / published subdomains. */
const ALLOWED_SUFFIXES = [".lovable.app", ".lovableproject.com", ".lovable.dev"];

export const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  if (ALLOWED_EXACT.has(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_SUFFIXES.some((suffix) => host.endsWith(suffix));
  } catch {
    return false;
  }
};

/**
 * Build response headers for a request. When the origin isn't recognised we
 * simply omit Access-Control-Allow-Origin, so the browser blocks the read.
 */
export const buildCorsHeaders = (req: Request): Record<string, string> => {
  const origin = req.headers.get("Origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin!;
  }
  return headers;
};

export const jsonResponse = (
  req: Request,
  body: unknown,
  status = 200,
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...buildCorsHeaders(req), "Content-Type": "application/json" },
  });

/** Coarse caller fingerprint for throttling. Hashed before storage. */
export const clientIp = (req: Request): string =>
  (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
  req.headers.get("cf-connecting-ip") ||
  "unknown";

export const sha256Hex = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

/** Timing-safe string comparison (both values are hex digests of equal length). */
export const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};
