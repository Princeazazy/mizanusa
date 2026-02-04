import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, username, password, sessionToken } = await req.json();
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (action === "login") {
      // Validate input
      if (!username || !password) {
        return new Response(
          JSON.stringify({ error: "Username and password are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Hash the provided password to compare
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

      // Look up credentials (case-insensitive username)
      const { data: credentials, error: credError } = await supabase
        .from("client_credentials")
        .select("*")
        .ilike("username", username)
        .eq("is_active", true)
        .single();

      if (credError || !credentials) {
        console.log("Login failed: user not found", username);
        return new Response(
          JSON.stringify({ error: "Invalid username or password" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify password
      if (credentials.password_hash !== passwordHash) {
        console.log("Login failed: password mismatch for", username);
        return new Response(
          JSON.stringify({ error: "Invalid username or password" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate session token
      const tokenArray = new Uint8Array(32);
      crypto.getRandomValues(tokenArray);
      const newSessionToken = Array.from(tokenArray).map(b => b.toString(16).padStart(2, "0")).join("");

      // Session expires in 24 hours
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Create session
      const { error: sessionError } = await supabase
        .from("client_sessions")
        .insert({
          client_id: credentials.client_id,
          session_token: newSessionToken,
          expires_at: expiresAt.toISOString(),
        });

      if (sessionError) {
        console.error("Failed to create session:", sessionError);
        throw new Error("Failed to create session");
      }

      console.log("Login successful for client:", credentials.client_name);

      return new Response(
        JSON.stringify({
          success: true,
          sessionToken: newSessionToken,
          clientId: credentials.client_id,
          clientName: credentials.client_name,
          expiresAt: expiresAt.toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "validate") {
      if (!sessionToken) {
        return new Response(
          JSON.stringify({ valid: false, error: "No session token provided" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Look up session
      const { data: session, error: sessionError } = await supabase
        .from("client_sessions")
        .select("*, client_credentials(client_name)")
        .eq("session_token", sessionToken)
        .single();

      if (sessionError || !session) {
        return new Response(
          JSON.stringify({ valid: false, error: "Invalid session" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if expired
      if (new Date(session.expires_at) < new Date()) {
        // Clean up expired session
        await supabase.from("client_sessions").delete().eq("id", session.id);
        return new Response(
          JSON.stringify({ valid: false, error: "Session expired" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          valid: true,
          clientId: session.client_id,
          clientName: session.client_credentials?.client_name,
          expiresAt: session.expires_at,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "logout") {
      if (!sessionToken) {
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await supabase.from("client_sessions").delete().eq("session_token", sessionToken);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Client auth error:", error);
    return new Response(
      JSON.stringify({ error: "Authentication service error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
