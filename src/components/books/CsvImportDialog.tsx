import { useMemo, useRef, useState } from "react";
import { FileUp, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { guessMapping, mapRows, parseCsv } from "@/lib/books/csv";
import { importTransactions, fetchImportProfile, saveImportProfile } from "@/lib/books/api";
import { DEMO_CSV } from "@/lib/books/clients";
import type { ColumnMapping } from "@/lib/books/types";
import { cn } from "@/lib/utils";

interface CsvImportDialogProps {
  clientId: string;
  isDemo?: boolean;
  onImported: () => void;
}

const NONE = "__none__";

export const CsvImportDialog = ({ clientId, isDemo, onImported }: CsvImportDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<ColumnMapping | null>(null);
  const [source, setSource] = useState<"bank" | "cc">("bank");
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(() => {
    if (!mapping || headers.length === 0) return null;
    return mapRows(headers, rows, mapping);
  }, [mapping, headers, rows]);

  const loadCsv = async (text: string, name: string) => {
    const parsed = parseCsv(text);
    if (parsed.length < 2) {
      toast({ title: "Nothing to import", description: "That file has no data rows.", variant: "destructive" });
      return;
    }
    const [head, ...body] = parsed;
    setHeaders(head);
    setRows(body);
    setFileName(name);
    const saved = await fetchImportProfile(clientId).catch(() => null);
    const usable = saved && head.includes(saved.date) && head.includes(saved.description);
    setMapping(usable ? saved! : guessMapping(head));
    if (usable) {
      toast({ title: "Column layout remembered", description: "Reusing this client's saved bank format." });
    }
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    await loadCsv(text, file.name);
  };

  const reset = () => {
    setHeaders([]);
    setRows([]);
    setMapping(null);
    setFileName("");
  };

  const handleImport = async () => {
    if (!mapping || !preview) return;
    setImporting(true);
    try {
      const result = await importTransactions(clientId, source, preview.rows, !!isDemo);
      await saveImportProfile(clientId, mapping).catch(() => null);
      toast({
        title: `Imported ${result.inserted} transaction${result.inserted === 1 ? "" : "s"}`,
        description: [
          result.duplicates ? `${result.duplicates} duplicate(s) skipped` : null,
          preview.skipped ? `${preview.skipped} unparseable row(s) skipped` : null,
        ]
          .filter(Boolean)
          .join(" · ") || "All rows staged as pending for the agent.",
      });
      setOpen(false);
      reset();
      onImported();
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Could not import that file.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const columnSelect = (
    key: keyof ColumnMapping,
    label: string,
    optional = false,
  ) => (
    <div className="space-y-1.5">
      <Label className="text-[11.5px] uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Select
        value={(mapping?.[key] as string) || (optional ? NONE : "")}
        onValueChange={(v) =>
          setMapping((m) => (m ? { ...m, [key]: v === NONE ? undefined : v } : m))
        }
      >
        <SelectTrigger className="h-8 text-[12px]">
          <SelectValue placeholder="Select column" />
        </SelectTrigger>
        <SelectContent>
          {optional && <SelectItem value={NONE}>— none —</SelectItem>}
          {headers.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <Button variant="outline" size="sm" className="gap-2" onClick={() => setOpen(true)}>
        <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
        Import CSV
      </Button>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import statement</DialogTitle>
          <DialogDescription>
            Drop a bank or credit-card CSV. Rows are staged as <span className="text-foreground">pending</span> — nothing
            is categorized until you run the agent.
          </DialogDescription>
        </DialogHeader>

        {headers.length === 0 ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) void handleFile(file);
            }}
            className={cn(
              "rounded-2xl border border-dashed border-border/70 p-10 text-center transition",
              dragging && "border-primary bg-primary/[0.04]",
            )}
          >
            <FileUp className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 text-[13px] text-muted-foreground">Drag a .csv file here, or</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                Choose file
              </Button>
              {isDemo && (
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => void loadCsv(DEMO_CSV, "DEMO_statement.csv")}>
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Load DEMO statement
                </Button>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
                e.target.value = "";
              }}
            />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-muted-foreground">
              <span className="truncate">
                <span className="text-foreground">{fileName}</span> · {rows.length} rows
              </span>
              <Button variant="ghost" size="sm" onClick={reset}>
                Choose a different file
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {columnSelect("date", "Date")}
              {columnSelect("description", "Description")}
              {columnSelect("payee", "Payee", true)}
              {columnSelect("amount", "Amount", true)}
              {columnSelect("debit", "Debit / out", true)}
              {columnSelect("credit", "Credit / in", true)}
              <div className="space-y-1.5">
                <Label className="text-[11.5px] uppercase tracking-wide text-muted-foreground">Source</Label>
                <Select value={source} onValueChange={(v) => setSource(v as "bank" | "cc")}>
                  <SelectTrigger className="h-8 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="cc">Credit card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!mapping?.debit && !mapping?.credit && (
                <div className="space-y-1.5">
                  <Label className="text-[11.5px] uppercase tracking-wide text-muted-foreground">
                    Positive amount means
                  </Label>
                  <Select
                    value={mapping?.positiveIsIn === false ? "out" : "in"}
                    onValueChange={(v) => setMapping((m) => (m ? { ...m, positiveIsIn: v === "in" } : m))}
                  >
                    <SelectTrigger className="h-8 text-[12px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Money in</SelectItem>
                      <SelectItem value="out">Money out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="surface-panel-flat overflow-hidden rounded-xl p-0">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-border/60 text-left text-[10.5px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Description</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2">Dir</th>
                  </tr>
                </thead>
                <tbody>
                  {(preview?.rows ?? []).slice(0, 5).map((r, i) => (
                    <tr key={i} className="border-b border-border/40 last:border-0">
                      <td className="tabular px-3 py-1.5">{r.txn_date}</td>
                      <td className="max-w-[280px] truncate px-3 py-1.5">{r.description}</td>
                      <td className="tabular px-3 py-1.5 text-right">${r.amount.toLocaleString()}</td>
                      <td className="px-3 py-1.5">{r.direction === "in" ? "In" : "Out"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11.5px] text-muted-foreground">
              {preview?.rows.length ?? 0} row(s) ready
              {preview?.skipped ? ` · ${preview.skipped} row(s) will be skipped (unreadable date or amount)` : ""}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!preview || preview.rows.length === 0 || importing}
            className="gap-2"
          >
            {importing && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
            Import {preview?.rows.length ? `${preview.rows.length} rows` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
