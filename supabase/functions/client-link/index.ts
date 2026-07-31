// Links an OAuth-authenticated identity to a client company after EIN verification.
// EINs are never sent to the browser — comparison happens here only.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const MAX_ATTEMPTS_PER_HOUR = 5;

/** Strip formatting; a valid EIN is exactly 9 digits. */
const normalizeEin = (value: string) => value.replace(/\D/g, "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    // --- Authenticate the caller (OAuth / password Supabase identity) ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await anon.auth.getUser();
    if (userError || !userData?.user) {
      return json({ error: "Unauthorized" }, 401);
    }
    const user = userData.user;

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { action, ein } = await req.json();

    /** Issue a 24h client portal session for a linked company. */
    const issueSession = async (clientId: string, clientName: string) => {
      const tokenArray = new Uint8Array(32);
      crypto.getRandomValues(tokenArray);
      const sessionToken = Array.from(tokenArray)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error } = await admin.from("client_sessions").insert({
        client_id: clientId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      });
      if (error) throw new Error("Failed to create portal session");

      return {
        sessionToken,
        clientId,
        clientName,
        expiresAt: expiresAt.toISOString(),
      };
    };

    const { data: existingLink } = await admin
      .from("client_identity_links")
      .select("client_id, client_name")
      .eq("user_id", user.id)
      .maybeSingle();

    // --- status: has this identity already been linked? ---
    if (action === "status") {
      if (!existingLink) return json({ linked: false });
      const session = await issueSession(existingLink.client_id, existingLink.client_name);
      return json({ linked: true, ...session });
    }

    // --- link: verify EIN, then permanently bind the identity ---
    if (action === "link") {
      if (existingLink) {
        const session = await issueSession(existingLink.client_id, existingLink.client_name);
        return json({ linked: true, ...session });
      }

      const digits = normalizeEin(typeof ein === "string" ? ein : "");
      if (digits.length !== 9) {
        return json({ error: "Enter a valid EIN in the format XX-XXXXXXX." }, 400);
      }

      // Rate limit: max attempts per identity per rolling hour
      const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await admin
        .from("client_link_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", since);

      if ((count ?? 0) >= MAX_ATTEMPTS_PER_HOUR) {
        return json(
          { error: "Too many attempts. Please try again in an hour or contact your bookkeeper." },
          429,
        );
      }

      const { data: companies } = await admin
        .from("client_credentials")
        .select("client_id, client_name, ein")
        .eq("is_active", true);

      const match = (companies ?? []).find(
        (c) => c.ein && normalizeEin(c.ein) === digits,
      );

      await admin.from("client_link_attempts").insert({
        user_id: user.id,
        email: user.email ?? null,
        success: !!match,
        matched_client_id: match?.client_id ?? null,
      });

      if (!match) {
        console.log("EIN link attempt failed for user", user.id);
        return json(
          { error: "We couldn't match that EIN — contact your bookkeeper." },
          403,
        );
      }

      const { error: linkError } = await admin.from("client_identity_links").insert({
        user_id: user.id,
        client_id: match.client_id,
        client_name: match.client_name,
      });
      if (linkError) {
        console.error("Failed to persist identity link:", linkError);
        throw new Error("Failed to link account");
      }

      const session = await issueSession(match.client_id, match.client_name);
      return json({ linked: true, ...session });
    }

    return json({ error: "Invalid action" }, 400);
  } catch (error) {
    console.error("client-link error:", error);
    return json({ error: "Account linking service error" }, 500);
  }
});
