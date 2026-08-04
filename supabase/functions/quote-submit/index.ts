// Public lead intake for the marketing quote form.
//
// This is deliberately the ONLY write path into quote_requests — the table has
// no anonymous grant, so bots cannot POST straight at the Data API. Protections:
//   * honeypot field ("company_website") — must be empty
//   * per-IP throttle (6 accepted / hour, 20 attempts / hour)
//   * minimum time-on-form check to defeat instant-fill bots
//   * strict length + shape validation mirroring the DB constraints
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildCorsHeaders, clientIp, jsonResponse, sha256Hex } from "../_shared/cors.ts";

const MAX_ACCEPTED_PER_HOUR = 6;
const MAX_ATTEMPTS_PER_HOUR = 20;
const MIN_FILL_MS = 2_000;

const str = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
const within = (value: string, min: number, max: number) =>
  value.length >= min && value.length <= max;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

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

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const ipHash = await sha256Hex(clientIp(req));
    const since = new Date(Date.now() - 3_600_000).toISOString();

    // Throttle before doing any work.
    const { count: attempts } = await admin
      .from("quote_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);

    const { count: accepted } = await admin
      .from("quote_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .eq("accepted", true)
      .gte("created_at", since);

    if ((attempts ?? 0) >= MAX_ATTEMPTS_PER_HOUR || (accepted ?? 0) >= MAX_ACCEPTED_PER_HOUR) {
      return jsonResponse(
        req,
        { error: "You've sent several requests already. Please email us directly." },
        429,
      );
    }

    const record = async (ok: boolean) => {
      await admin.from("quote_attempts").insert({ ip_hash: ipHash, accepted: ok });
    };

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      await record(false);
      return jsonResponse(req, { error: "Invalid request." }, 400);
    }

    // Honeypot: real users never see this field, so any value means a bot.
    // Respond 200 so the bot believes it succeeded and doesn't retry.
    if (str((body as Record<string, unknown>).company_website)) {
      await record(false);
      console.log("quote-submit: honeypot triggered");
      return jsonResponse(req, { success: true });
    }

    const elapsed = Number((body as Record<string, unknown>).elapsed_ms);
    if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) {
      await record(false);
      console.log("quote-submit: submitted too fast");
      return jsonResponse(req, { success: true });
    }

    const b = body as Record<string, unknown>;
    const name = str(b.name);
    const email = str(b.email);
    const industry = str(b.industry);
    const businessName = str(b.business_name);
    const phone = str(b.phone);
    const situation = str(b.situation);
    const message = str(b.message);

    if (
      !within(name, 1, 120) ||
      !within(email, 5, 255) ||
      !EMAIL_RE.test(email) ||
      !within(industry, 1, 80) ||
      businessName.length > 160 ||
      phone.length > 40 ||
      situation.length > 120 ||
      message.length > 4000
    ) {
      await record(false);
      return jsonResponse(req, { error: "Please check the form and try again." }, 400);
    }

    const { error } = await admin.from("quote_requests").insert({
      name,
      email,
      industry,
      business_name: businessName || null,
      phone: phone || null,
      situation: situation || null,
      message: message || null,
      status: "new",
    });

    if (error) {
      await record(false);
      console.error("quote-submit: insert failed", error.message);
      return jsonResponse(req, { error: "We couldn't save that. Please try again." }, 500);
    }

    await record(true);
    return jsonResponse(req, { success: true });
  } catch (error) {
    console.error("quote-submit error:", error);
    return jsonResponse(req, { error: "Submission service error" }, 500);
  }
});
