// Read-only delivery of PUBLISHED workspace sheets to a portal client.
//
// Portal clients authenticate with an opaque client_sessions token (they have no
// Supabase JWT), so authorization is enforced here and the query is hard-scoped
// to the session's own client_id and to is_published = true. Drafts never leave
// the practice side.
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildCorsHeaders, jsonResponse } from "../_shared/cors.ts";

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: buildCorsHeaders(req) });
  if (req.method !== "POST") return jsonResponse(req, { error: "Method not allowed" }, 405);

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) throw new Error("Missing Supabase configuration");

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return jsonResponse(req, { error: "Invalid request" }, 400);

    const sessionToken = str(body.sessionToken, 128);
    if (!sessionToken) return jsonResponse(req, { error: "Not authorized" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: session } = await admin
      .from("client_sessions")
      .select("client_id, expires_at")
      .eq("session_token", sessionToken)
      .maybeSingle();

    if (!session || new Date(session.expires_at).getTime() <= Date.now()) {
      return jsonResponse(req, { error: "Not authorized" }, 401);
    }

    const { data, error } = await admin
      .from("financial_sheets")
      .select("id, name, sheet_type, period, data, published_at, updated_at")
      .eq("client_id", session.client_id)
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;

    return jsonResponse(req, { sheets: data ?? [] });
  } catch (error) {
    console.error("client-sheets error:", error instanceof Error ? error.message : String(error));
    return jsonResponse(req, { error: "Could not load your reports. Please try again." }, 500);
  }
});
