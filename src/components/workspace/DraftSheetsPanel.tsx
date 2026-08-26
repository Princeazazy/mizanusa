import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, Eye, EyeOff, FileSpreadsheet, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { deleteSheet, setSheetPublished, type WorkspaceSheet } from "@/lib/workspace/api";

interface Props {
  sheets: WorkspaceSheet[];
  onChanged: () => void;
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
  if (typeof value === "number") return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export const DraftSheetsPanel = ({ sheets, onChanged }: Props) => {
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const drafts = useMemo(() => sheets.filter((s) => !s.is_published), [sheets]);
  const published = useMemo(() => sheets.filter((s) => s.is_published), [sheets]);

  const togglePublish = async (sheet: WorkspaceSheet) => {
    setBusy(sheet.id);
    try {
      await setSheetPublished(sheet.id, !sheet.is_published);
      toast.success(sheet.is_published ? `"${sheet.name}" pulled back to draft` : `"${sheet.name}" published to the client`);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the sheet");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (sheet: WorkspaceSheet) => {
    setBusy(sheet.id);
    try {
      await deleteSheet(sheet.id);
      toast.success(`"${sheet.name}" deleted`);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the sheet");
    } finally {
      setBusy(null);
    }
  };

  const Row = ({ sheet }: { sheet: WorkspaceSheet }) => {
    const columns = sheet.data?.columns ?? [];
    const rows = sheet.data?.rows ?? [];
    const isOpen = open === sheet.id;

    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02]">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2.5">
          <button
            type="button"
            onClick={() => setOpen(isOpen ? null : sheet.id)}
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
          >
            <FileSpreadsheet className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{sheet.name}</span>
            <Badge variant="outline" className="shrink-0 text-[10px] uppercase tracking-wide">
              {TYPE_LABEL[sheet.sheet_type] ?? sheet.sheet_type}
            </Badge>
            {sheet.period && <span className="shrink-0 text-[11px] text-muted-foreground">{sheet.period}</span>}
            <span className="shrink-0 text-[11px] text-muted-foreground">{rows.length} rows</span>
            <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
          </button>

          <Button
            size="sm"
            variant={sheet.is_published ? "outline" : "default"}
            disabled={busy === sheet.id}
            onClick={() => togglePublish(sheet)}
            className="h-8 text-[12px]"
          >
            {sheet.is_published ? (
              <>
                <EyeOff className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Unpublish
              </>
            ) : (
              <>
                <Eye className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Publish
              </>
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Delete ${sheet.name}`}
            disabled={busy === sheet.id}
            onClick={() => remove(sheet)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>

        {isOpen && (
          <div className="max-h-[360px] overflow-auto border-t border-white/10 px-3 py-2">
            {rows.length === 0 ? (
              <p className="py-4 text-center text-[12px] text-muted-foreground">This sheet has no rows yet.</p>
            ) : (
              <table className="w-full border-collapse text-[11.5px]">
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th key={c} className="sticky top-0 bg-background/95 px-2 py-1.5 text-left font-semibold uppercase tracking-wide text-muted-foreground">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 400).map((row, i) => (
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
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Drafts — internal only ({drafts.length})
        </h3>
        {drafts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 px-3 py-6 text-center text-[12px] text-muted-foreground">
            Nothing drafted yet. Attach a statement in the chat and ask for a register, P&amp;L, balance sheet or cash flow.
          </p>
        ) : (
          <div className="space-y-2">
            {drafts.map((s) => (
              <Row key={s.id} sheet={s} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Published to client ({published.length})
        </h3>
        {published.length === 0 ? (
          <p className="text-[12px] text-muted-foreground">Nothing published yet.</p>
        ) : (
          <div className="space-y-2">
            {published.map((s) => (
              <Row key={s.id} sheet={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
