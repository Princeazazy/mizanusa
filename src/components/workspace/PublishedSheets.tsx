import { useCallback, useEffect, useState } from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";

interface PublishedSheet {
  id: string;
  name: string;
  sheet_type: string;
  period: string | null;
  published_at: string | null;
  data: { columns?: string[]; rows?: Record<string, unknown>[]; notes?: string } | null;
}

const TYPE_LABEL: Record<string, string> = {
  profit_loss: "Profit & Loss",
  balance_sheet: "Balance Sheet",
  cash_flow: "Cash Flow",
  transactions: "Transactions",
  reconciliation: "Reconciliation",
  custom: "Custom",
};

const cell = (value: unknown) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

/** Client-facing view of the sheets Mizan has explicitly published. */
export const PublishedSheets = ({ sessionToken }: { sessionToken: string }) => {
  const [sheets, setSheets] = useState<PublishedSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fnError } = await supabase.functions.invoke("client-sheets", {
      body: { sessionToken },
    });
    if (fnError || (data as { error?: string })?.error) {
      setError((data as { error?: string })?.error ?? "Could not load your reports.");
      setSheets([]);
    } else {
      setSheets(((data as { sheets?: PublishedSheet[] })?.sheets ?? []) as PublishedSheet[]);
    }
    setLoading(false);
  }, [sessionToken]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-8 text-[13px] text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading your reports…
      </div>
    );
  }

  if (error) return <p className="p-6 text-[13px] text-destructive">{error}</p>;

  if (sheets.length === 0) {
    return (
      <EmptyState
        icon={FileSpreadsheet}
        title="No new reports yet"
        description="When your bookkeeper publishes a new statement or schedule, it will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      {sheets.map((sheet) => {
        const columns = sheet.data?.columns ?? [];
        const rows = sheet.data?.rows ?? [];
        return (
          <section key={sheet.id} className="glass-panel overflow-hidden rounded-2xl">
            <header className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-3">
              <h3 className="text-[14px] font-semibold">{sheet.name}</h3>
              <Badge variant="outline" className="text-[10.5px] uppercase tracking-wide">
                {TYPE_LABEL[sheet.sheet_type] ?? sheet.sheet_type}
              </Badge>
              {sheet.period && <span className="text-[11.5px] text-muted-foreground">{sheet.period}</span>}
              {sheet.published_at && (
                <span className="ml-auto text-[11px] text-muted-foreground">
                  Published {new Date(sheet.published_at).toLocaleDateString()}
                </span>
              )}
            </header>
            <div className="max-h-[520px] overflow-auto px-4 py-3">
              {rows.length === 0 ? (
                <p className="py-4 text-[12.5px] text-muted-foreground">This report has no rows.</p>
              ) : (
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr>
                      {columns.map((c) => (
                        <th
                          key={c}
                          className="sticky top-0 bg-background/95 px-2 py-2 text-left font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className="border-t border-white/5">
                        {columns.map((c) => (
                          <td key={c} className="px-2 py-1.5 tabular-nums">
                            {cell(row[c])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {sheet.data?.notes && <p className="mt-3 text-[11.5px] text-muted-foreground">{sheet.data.notes}</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
};
