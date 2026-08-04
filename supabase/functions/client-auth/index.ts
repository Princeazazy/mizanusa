// Client portal authentication (username/password + opaque session tokens).
//
// Hardening notes:
//   * origin-restricted CORS (no wildcard)
//   * per-username AND per-IP brute-force throttling
//   * PBKDF2 password hashing, with transparent upgrade of legacy SHA-256 rows
//   * timing-safe comparisons, uniform error text (no account enumeration)
//   * exact username matching (the previous `ilike` treated %/_ as wildcards)
//   * never selects or returns the EIN
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildCorsHeaders, clientIp, jsonResponse, sha256Hex } from "../_shared/cors.ts";
import { hashPassword, isLegacyHash, verifyPassword } from "../_shared/password.ts";

const MAX_FAILS_PER_USER_PER_15MIN = 5;
const MAX_FAILS_PER_IP_PER_15MIN = 20;
const WINDOW_MS = 15 * 60 * 1000;
const SESSION_HOURS = 24;

/** Identical text for every failure, so nothing reveals whether a user exists. */
const INVALID = "Invalid username or password";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: buildCorsHeaders(req) });
  }
  if (req.method !== "POST") {
    return jsonResponse(req, { error: "Method not allowed" }, 405);
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) throw new Error("Missing Supabase configuration");

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return jsonResponse(req, { error: "Invalid request" }, 400);
    }
    const { action, username, password, sessionToken } = body as Record<string, unknown>;

    // ------------------------------------------------------------------
    if (action === "login") {
      if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
        return jsonResponse(req, { error: "Username and password are required" }, 400);
      }
      if (username.length > 120 || password.length > 200) {
        return jsonResponse(req, { error: INVALID }, 401);
      }

      const normalizedUsername = username.trim().toLowerCase();
      const ipHash = await sha256Hex(clientIp(req));
      const since = new Date(Date.now() - WINDOW_MS).toISOString();

      const logAttempt = (success: boolean) =>
        supabase
          .from("client_login_attempts")
          .insert({ username: normalizedUsername, ip_hash: ipHash, success });

      const [{ count: userFails }, { count: ipFails }] = await Promise.all([
        supabase
          .from("client_login_attempts")
          .select("id", { count: "exact", head: true })
          .eq("username", normalizedUsername)
          .eq("success", false)
          .gte("created_at", since),
        supabase
          .from("client_login_attempts")
          .select("id", { count: "exact", head: true })
          .eq("ip_hash", ipHash)
          .eq("success", false)
          .gte("created_at", since),
      ]);

      if (
        (userFails ?? 0) >= MAX_FAILS_PER_USER_PER_15MIN ||
        (ipFails ?? 0) >= MAX_FAILS_PER_IP_PER_15MIN
      ) {
        console.log("client-auth: throttled login");
        return jsonResponse(
          req,
          { error: "Too many failed attempts. Please try again in 15 minutes." },
          429,
        );
      }

      // Exact, case-insensitive match — no LIKE wildcards.
      const { data: credentials } = await supabase
        .from("client_credentials")
        .select("id, client_id, client_name, password_hash, is_active")
        .eq("is_active", true)
        .filter("username", "ilike", normalizedUsername.replace(/[%_\\]/g, "\\$&"))
        .maybeSingle();

      // Always run a hash comparison so timing doesn't leak account existence.
      const storedHash = credentials?.password_hash ??
        "pbkdf2$sha256$210000$00000000000000000000000000000000$" + "0".repeat(64);
      const passwordOk = await verifyPassword(password, storedHash);

      if (!credentials || !passwordOk) {
        await logAttempt(false);
        return jsonResponse(req, { error: INVALID }, 401);
      }

      // Transparently migrate legacy unsalted SHA-256 rows to PBKDF2.
      if (isLegacyHash(storedHash)) {
        const upgraded = await hashPassword(password);
        await supabase
          .from("client_credentials")
          .update({ password_hash: upgraded })
          .eq("id", credentials.id);
        console.log("client-auth: upgraded legacy password hash for", credentials.client_id);
      }

      const tokenArray = new Uint8Array(32);
      crypto.getRandomValues(tokenArray);
      const newSessionToken = Array.from(tokenArray)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + SESSION_HOURS);

      const { error: sessionError } = await supabase.from("client_sessions").insert({
        client_id: credentials.client_id,
        session_token: newSessionToken,
        expires_at: expiresAt.toISOString(),
      });
      if (sessionError) {
        console.error("Failed to create session:", sessionError.message);
        throw new Error("Failed to create session");
      }

      await logAttempt(true);
      console.log("client-auth: login successful for", credentials.client_id);

      return jsonResponse(req, {
        success: true,
        sessionToken: newSessionToken,
        clientId: credentials.client_id,
        clientName: credentials.client_name,
        expiresAt: expiresAt.toISOString(),
      });
    }

    // ------------------------------------------------------------------
    if (action === "validate") {
      if (typeof sessionToken !== "string" || !/^[0-9a-f]{64}$/.test(sessionToken)) {
        return jsonResponse(req, { valid: false, error: "Invalid session" }, 401);
      }

      const { data: session } = await supabase
        .from("client_sessions")
        .select("id, client_id, expires_at, client_credentials(client_name, is_active)")
        .eq("session_token", sessionToken)
        .maybeSingle();

      if (!session || session.client_credentials?.is_active === false) {
        return jsonResponse(req, { valid: false, error: "Invalid session" }, 401);
      }

      if (new Date(session.expires_at) < new Date()) {
        await supabase.from("client_sessions").delete().eq("id", session.id);
        return jsonResponse(req, { valid: false, error: "Session expired" }, 401);
      }

      return jsonResponse(req, {
        valid: true,
        clientId: session.client_id,
        clientName: session.client_credentials?.client_name,
        expiresAt: session.expires_at,
      });
    }

    // ------------------------------------------------------------------
    if (action === "logout") {
      if (typeof sessionToken === "string" && /^[0-9a-f]{64}$/.test(sessionToken)) {
        await supabase.from("client_sessions").delete().eq("session_token", sessionToken);
      }
      return jsonResponse(req, { success: true });
    }

    return jsonResponse(req, { error: "Invalid action" }, 400);
  } catch (error) {
    console.error("Client auth error:", error);
    return jsonResponse(req, { error: "Authentication service error" }, 500);
  }
});
