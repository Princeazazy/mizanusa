import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

/** Editorial chart container: quiet label stack, oversized figure, hairline rule. */
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
  children,
  className = "",
}: ChartFrameProps) => (
  <figure
    className={`surface-panel flex flex-col overflow-hidden print:border print:border-neutral-300 print:bg-white print:shadow-none ${className}`}
  >
    <figcaption className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 px-6 pt-6">
      <div className="min-w-0">
        {eyebrow && <span className="eyebrow-label">{eyebrow}</span>}
        <h3 className="mt-2 flex flex-wrap items-center gap-2 text-[15px] font-medium text-foreground">
          {title}
          {typeof delta === "number" && <DeltaBadge value={delta} invert={invertDelta} />}
        </h3>
        {(period || basis) && (
          <p className="mt-1 text-[11px] tracking-[0.02em] text-muted-foreground/80">
            {[period, basis].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
      {value && (
        <div className="text-right">
          <span className="stat-display text-[26px] leading-none">{value}</span>
          {meta && <div className="mt-1.5 text-xs text-muted-foreground tabular">{meta}</div>}
        </div>
      )}
    </figcaption>
    <div className="mt-5 h-px w-full bg-white/[0.06]" />
    <div className="flex-1 px-2 pb-4 pt-5">{children}</div>
    {footer && (
      <div className="border-t border-white/[0.05] px-6 py-3 text-[11px] text-muted-foreground">
        {footer}
      </div>
    )}
  </figure>
);

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
