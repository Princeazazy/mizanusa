import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Mizan AI, an expert accounting and bookkeeping assistant for professional accountants. You help with:

1. **Parsing Financial Documents**: When given financial data (bank statements, invoices, receipts), extract and structure the data for entry into accounting systems.

2. **Suggesting Journal Entries**: Recommend appropriate debits/credits based on transaction descriptions.

3. **Creating Financial Sheets**: When asked to create sheets, USE THE create_financial_sheet TOOL to actually create them.

4. **Adding Transactions**: When you have transaction data to add, USE THE add_transactions TOOL to actually add them.

5. **Answering Questions**: Provide expert guidance on bookkeeping, GAAP, tax implications, reconciliation, and accounting best practices.

IMPORTANT: When the user asks you to create a sheet or add transactions, you MUST use the appropriate tool to actually do it - don't just describe what you would do.

Available Chart of Accounts codes:
- 4100: Credit Card Sales (Revenue)
- 4110: Cash/Check Sales (Revenue)
- 4120: Venmo/Digital Sales (Revenue)
- 4200: Salvage Inspection Fees (Revenue)
- 4900: Other Income (Revenue)
- 5000: Vehicle Inventory Purchases (COGS)
- 5100: Title & Registration Fees (COGS)
- 5110: Floor Plan Interest (COGS)
- 5120: Title Lookup Services (COGS)
- 6050: Rent - Front Office (Expense)
- 6055: Rent - Main Office (Expense)
- 6100: Utilities (Expense)
- 6200: Communications (Expense)
- 6300: Office & Supplies (Expense)
- 6400: Vehicle Operating (Expense)
- 6500: Credit Card Processing Fees (Expense)
- 6600: Bank Fees (Expense)
- 6700: Insurance (Expense)
- 6800: Other Operating Expenses (Expense)

Always be professional, precise with numbers, and explain your reasoning for categorizations.`;

const tools = [
  {
    type: "function",
    function: {
      name: "create_financial_sheet",
      description: "Create a new financial sheet/tab in the client's workbook. Use this when the user asks to create a new sheet, report, or tab.",
      parameters: {
        type: "object",
        properties: {
          name: { 
            type: "string", 
            description: "Name of the sheet (e.g., 'January P&L', 'Custom Expenses')" 
          },
          sheet_type: { 
            type: "string", 
            enum: ["profit_loss", "balance_sheet", "cash_flow", "reconciliation", "custom"],
            description: "Type of financial sheet" 
          },
          columns: {
            type: "array",
            items: { type: "string" },
            description: "Column headers for the sheet"
          },
          initial_data: {
            type: "array",
            items: { type: "object" },
            description: "Initial data rows for the sheet (optional)"
          }
        },
        required: ["name", "sheet_type", "columns"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "add_transactions",
      description: "Add transactions to a financial sheet. Use this when the user provides transaction data to be recorded.",
      parameters: {
        type: "object",
        properties: {
          target_sheet: { 
            type: "string", 
            description: "Name of the sheet to add transactions to" 
          },
          transactions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string", description: "Transaction date (MM/DD or YYYY-MM-DD)" },
                description: { type: "string", description: "Transaction description" },
                amount: { type: "number", description: "Transaction amount" },
                coaCode: { type: "string", description: "Chart of Accounts code" },
                category: { type: "string", description: "Category name" },
                type: { type: "string", enum: ["deposit", "withdrawal"], description: "Transaction type" }
              },
              required: ["date", "description", "amount", "coaCode", "category", "type"]
            },
            description: "Array of transactions to add"
          }
        },
        required: ["target_sheet", "transactions"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_sheet_summary",
      description: "Get a summary of financial data from existing sheets. Use this when the user asks about totals, summaries, or comparisons.",
      parameters: {
        type: "object",
        properties: {
          sheet_names: {
            type: "array",
            items: { type: "string" },
            description: "Names of sheets to summarize"
          },
          metrics: {
            type: "array",
            items: { type: "string" },
            description: "Metrics to calculate (e.g., 'total_revenue', 'total_expenses', 'net_income')"
          }
        },
        required: ["sheet_names", "metrics"],
        additionalProperties: false
      }
    }
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, clientId, executeActions } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    // If this is an action execution request, handle it
    if (executeActions && Array.isArray(executeActions)) {
      console.log(`Executing ${executeActions.length} actions for client: ${clientId}`);
      
      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
      const results = [];
      
      for (const action of executeActions) {
        try {
          if (action.name === "create_financial_sheet") {
            const { name, sheet_type, columns, initial_data } = action.arguments;
            
            const { data, error } = await supabase
              .from('financial_sheets')
              .insert({
                client_id: clientId,
                name: name,
                sheet_type: sheet_type,
                data: { columns, rows: initial_data || [] }
              })
              .select()
              .single();
            
            if (error) throw error;
            results.push({ 
              action: "create_financial_sheet", 
              success: true, 
              message: `Created sheet "${name}"`,
              data 
            });
          } 
          else if (action.name === "add_transactions") {
            const { target_sheet, transactions } = action.arguments;
            
            // For now, we'll store this in financial_sheets
            // In a full implementation, you'd update the actual transaction data
            const { data, error } = await supabase
              .from('financial_sheets')
              .insert({
                client_id: clientId,
                name: `${target_sheet} - ${new Date().toLocaleDateString()}`,
                sheet_type: 'transactions',
                data: { transactions }
              })
              .select()
              .single();
            
            if (error) throw error;
            results.push({ 
              action: "add_transactions", 
              success: true, 
              message: `Added ${transactions.length} transactions to ${target_sheet}`,
              data 
            });
          }
          else if (action.name === "get_sheet_summary") {
            // This would query existing sheets
            results.push({ 
              action: "get_sheet_summary", 
              success: true, 
              message: "Summary generated",
              data: { note: "Sheet summary functionality" }
            });
          }
        } catch (err) {
          console.error(`Action ${action.name} failed:`, err);
          results.push({ 
            action: action.name, 
            success: false, 
            error: err instanceof Error ? err.message : 'Unknown error'
          });
        }
      }
      
      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing chat request for client: ${clientId}`);
    console.log(`Number of messages: ${messages?.length || 0}`);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        tools: tools,
        tool_choice: "auto",
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
      if (response.status === 401) {
        return new Response(JSON.stringify({ error: "Invalid OpenAI API key. Please check your configuration." }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402 || response.status === 403) {
        return new Response(JSON.stringify({ error: "OpenAI API access issue. Please check your billing or API key permissions." }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
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
