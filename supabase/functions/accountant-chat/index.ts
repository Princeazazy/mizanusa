import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Mizan AI, an expert accounting and bookkeeping assistant for professional accountants. You help with:

1. **Parsing Financial Documents**: When given financial data (bank statements, invoices, receipts), extract and structure the data for entry into accounting systems.

2. **Suggesting Journal Entries**: Recommend appropriate debits/credits based on transaction descriptions.

3. **Creating Financial Sheets**: When asked, suggest new financial tabs/sheets with appropriate structure (columns, data types).

4. **Answering Questions**: Provide expert guidance on bookkeeping, GAAP, tax implications, reconciliation, and accounting best practices.

5. **Auto-populating Data**: When given statement data, suggest how to categorize and enter transactions.

When suggesting new tabs/sheets, respond with a structured JSON block like:
\`\`\`json
{
  "action": "create_sheet",
  "sheet": {
    "name": "Sheet Name",
    "type": "custom",
    "columns": ["Date", "Description", "Amount", "Category"],
    "data": []
  }
}
\`\`\`

When suggesting transactions to add, use:
\`\`\`json
{
  "action": "add_transactions",
  "sheet": "sheet_name",
  "transactions": [
    {"date": "2025-01-01", "description": "...", "amount": 100.00, "category": "..."}
  ]
}
\`\`\`

Always be professional, precise with numbers, and explain your reasoning for categorizations.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, clientId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Processing chat request for client: ${clientId}`);
    console.log(`Number of messages: ${messages?.length || 0}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
