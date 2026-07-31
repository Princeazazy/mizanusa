import { ReactNode, useCallback, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ClipboardCopy, Download, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { CardHeaderActions, CardLabel, HeroFigure } from "./CardChrome";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export interface ChartExportData {
  columns: string[];
  rows: (string | number)[][];
}

interface ChartFrameProps {
  eyebrow?: string;
  title: string;
  /** Explicit reporting period, e.g. "Jan – Mar 2026". */
  period?: string;
  /** Accounting basis / source note, e.g. "Cash basis · Bank statements". */
  basis?: string;
  value?: string;
  /** Period-over-period change, in percent. */
  delta?: number | null;
  /** When true a negative delta is the good outcome (e.g. expenses). */
  invertDelta?: boolean;
  meta?: ReactNode;
  footer?: ReactNode;
  /** Gradient-border + bloom treatment. Use on one or two cards per view. */
  featured?: boolean;
  /** Controls rendered under the header (segmented range, text tabs). */
  controls?: ReactNode;
  /** Replaces the default ghost icon buttons. */
  actions?: ReactNode;
  /** Underlying series, enabling the "Copy figures" menu action. */
  exportData?: ChartExportData;
  children: ReactNode;
  className?: string;
}

export const DeltaBadge = ({
  value,
  invert = false,
}: {
  value: number;
  invert?: boolean;
}) => {
  const up = value >= 0;
  const good = invert ? !up : up;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular",
        good ? "bg-income/10 text-income" : "bg-expense/10 text-expense",
      )}
      title={`${up ? "Up" : "Down"} ${Math.abs(value).toFixed(1)}% versus the start of the period`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Origin-style chart container: small-caps label with working ghost controls,
 * a hero figure with coloured delta, then the visualisation. `featured` adds
 * the cyan→blue→violet gradient border and outer bloom.
 */
export const ChartFrame = ({
  eyebrow,
  title,
  period,
  basis,
  value,
  delta,
  invertDelta,
  meta,
  footer,
  featured = false,
  controls,
  actions,
  exportData,
  children,
  className = "",
}: ChartFrameProps) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const fileBase = `${slugify(title)}${period ? `-${slugify(period)}` : ""}`;

  const downloadPng = useCallback(async () => {
    const node = cardRef.current;
    if (!node) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        backgroundColor: "#0A0B0F",
        filter: (el) =>
          !(el instanceof HTMLElement && el.dataset.exportHide === "true"),
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${fileBase}.png`;
      a.click();
      toast({ title: "Image downloaded", description: `${fileBase}.png` });
    } catch {
      toast({ title: "Could not export image", variant: "destructive" });
    }
  }, [fileBase]);

  const copyFigures = useCallback(async () => {
    if (!exportData) return;
    const tsv = [exportData.columns, ...exportData.rows]
      .map((r) => r.join("\t"))
      .join("\n");
    try {
      await navigator.clipboard.writeText(tsv);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = tsv;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    toast({
      title: "Figures copied",
      description: `${exportData.rows.length} rows ready to paste into Excel.`,
    });
  }, [exportData]);

  const printCard = useCallback(() => {
    const node = cardRef.current;
    if (!node) return;
    const win = window.open("", "_blank", "width=1100,height=850");
    if (!win) {
      toast({
        title: "Allow pop-ups to print",
        description: "Your browser blocked the print window.",
        variant: "destructive",
      });
      return;
    }
    win.document.write(
      `<!doctype html><html><head><title>${title}${period ? ` · ${period}` : ""}</title>${document.head.innerHTML}</head><body style="background:#0A0B0F;margin:0;padding:24px"><div style="max-width:1000px;margin:0 auto">${node.outerHTML}</div></body></html>`,
    );
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 600);
  }, [title, period]);

  const menu = (
    <>
      <DropdownMenuItem onSelect={() => void downloadPng()}>
        <Download className="mr-2 h-4 w-4" aria-hidden="true" />
        Download PNG
      </DropdownMenuItem>
      {exportData && exportData.rows.length > 0 && (
        <DropdownMenuItem onSelect={() => void copyFigures()}>
          <ClipboardCopy className="mr-2 h-4 w-4" aria-hidden="true" />
          Copy figures
        </DropdownMenuItem>
      )}
      <DropdownMenuItem onSelect={() => printCard()}>
        <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
        Print
      </DropdownMenuItem>
    </>
  );

  const header = (
    <figcaption className="px-6 pt-7 sm:px-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <CardLabel>{title}</CardLabel>
          {(eyebrow || period || basis) && (
            <p className="mt-1.5 truncate text-[11px] tracking-[0.02em] text-muted-foreground/70">
              {[eyebrow, period, basis].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        {actions ?? (
          <span data-export-hide="true">
            <CardHeaderActions onExpand={() => setExpanded(true)} menu={menu} />
          </span>
        )}
      </div>

      {value && (
        <HeroFigure
          className="mt-5"
          value={value}
          delta={typeof delta === "number" ? delta : undefined}
          invertDelta={invertDelta}
          contextLabel={period}
        />
      )}
      {meta && <div className="mt-2 text-xs text-muted-foreground tabular">{meta}</div>}
      {controls && <div className="mt-5">{controls}</div>}
    </figcaption>
  );

  return (
    <>
      <figure
        ref={cardRef}
        className={cn(
          "surface-panel flex flex-col overflow-hidden print:border print:border-neutral-300 print:bg-white print:shadow-none",
          featured && "halo-card",
          className,
        )}
      >
        {header}
        <div className="mt-6 h-px w-full bg-white/[0.055]" />
        <div className="flex-1 px-2 pb-6 pt-6">{children}</div>
        {footer && (
          <div className="border-t border-white/[0.05] px-6 py-3.5 text-[11px] text-muted-foreground sm:px-7">
            {footer}
          </div>
        )}
      </figure>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="halo-card max-h-[90vh] w-[95vw] max-w-[95vw] overflow-y-auto overflow-x-hidden rounded-[24px] border-0 bg-[hsl(var(--card))] p-0 sm:max-w-[95vw]">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {[eyebrow, period, basis].filter(Boolean).join(" · ") || "Expanded chart view"}
          </DialogDescription>
          <div className="flex flex-col">
            {header}
            <div className="mt-6 h-px w-full bg-white/[0.055]" />
            <div className="min-w-0 flex-1 overflow-x-hidden px-2 pb-8 pt-8">
              {expanded ? children : null}
            </div>
            {footer && (
              <div className="border-t border-white/[0.05] px-6 py-3.5 text-[11px] text-muted-foreground sm:px-7">
                {footer}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};


/** Shape-matched skeleton used while a series is resolving. */
export const ChartLoadingSkeleton = () => (
  <div className="h-[244px] px-6 pt-2" aria-busy="true" aria-label="Loading chart">
    <div className="flex h-full w-full items-end gap-3">
      {[46, 72, 55, 84, 62, 91, 50, 68].map((h, i) => (
        <div
          key={i}
          className="flex-1 animate-pulse rounded-sm bg-white/[0.05]"
          style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  </div>
);

/** Designed empty state with a clear next action. */
export const ChartSkeleton = ({
  label = "No data for this period",
  hint = "Import or reconcile a bank statement to populate this chart.",
  action,
}: {
  label?: string;
  hint?: string;
  action?: ReactNode;
}) => (
  <div className="flex h-[244px] flex-col items-center justify-center gap-3 px-6 text-center">
    <div className="flex w-full max-w-[220px] items-end justify-between gap-2 opacity-40" aria-hidden="true">
      {[38, 62, 48, 76, 54, 88, 44].map((h, i) => (
        <div key={i} className="flex-1 rounded-sm bg-white/[0.06]" style={{ height: h }} />
      ))}
    </div>
    <div>
      <p className="text-[13px] font-medium text-foreground/80">{label}</p>
      <p className="mt-1 max-w-[280px] text-xs text-muted-foreground">{hint}</p>
    </div>
    {action}
  </div>
);
