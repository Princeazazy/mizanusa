import { ReactNode } from "react";
import { ChevronDown, Maximize2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small-caps letter-spaced card label — the Origin header language. */
export const CardLabel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn("card-label block truncate", className)}>{children}</span>
);

/** Quiet ghost icon buttons that live on the right of a card header. */
export const CardHeaderActions = ({
  onExpand,
  onMenu,
  className,
}: {
  onExpand?: () => void;
  onMenu?: () => void;
  className?: string;
}) => (
  <div className={cn("flex shrink-0 items-center gap-1.5 print:hidden", className)}>
    <button type="button" className="ghost-icon-btn" aria-label="Expand card" onClick={onExpand}>
      <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
    <button type="button" className="ghost-icon-btn" aria-label="Card options" onClick={onMenu}>
      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
    </button>
  </div>
);

/** Period context chip, e.g. "vs. April". Decorative dropdown affordance only. */
export const PeriodChip = ({ label, withCaret = false }: { label: string; withCaret?: boolean }) => (
  <span className="period-chip max-w-full" title={label}>
    <span className="truncate">{label}</span>
    {withCaret && <ChevronDown className="h-3 w-3 shrink-0 opacity-70" aria-hidden="true" />}
  </span>
);

/**
 * Origin hero-number pattern: large light numeral, small coloured delta,
 * optional period chip aligned to the right.
 */
export const HeroFigure = ({
  value,
  delta,
  invertDelta = false,
  contextLabel,
  size = "md",
  className,
}: {
  value: string;
  delta?: number | null;
  invertDelta?: boolean;
  contextLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const up = typeof delta === "number" && delta >= 0;
  const good = invertDelta ? !up : up;
  const sizeClass =
    size === "lg"
      ? "text-[clamp(2rem,5vw,2.75rem)]"
      : size === "sm"
        ? "text-[clamp(1.375rem,3.2vw,1.75rem)]"
        : "";

  return (
    <div className={cn("flex min-w-0 flex-wrap items-end justify-between gap-x-4 gap-y-2", className)}>
      <div className="flex min-w-0 items-end gap-2.5">
        <span className={cn("hero-figure min-w-0 truncate", sizeClass)} title={value}>
          {value}
        </span>
        {typeof delta === "number" && (
          <span
            className={cn("delta-pill pb-0.5", good ? "text-income" : "text-expense")}
            title={`${up ? "Up" : "Down"} ${Math.abs(delta).toFixed(1)}% over the period`}
          >
            {up ? "+" : "−"}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      {contextLabel && <PeriodChip label={contextLabel} withCaret />}
    </div>
  );
};

/** Circular tinted chip with a line icon inside — for category/list rows. */
export const IconChip = ({
  children,
  color,
  className,
}: {
  children: ReactNode;
  /** Any CSS colour; tinted at ~12% for the background. */
  color?: string;
  className?: string;
}) => (
  <span
    className={cn("icon-chip", className)}
    style={
      color
        ? { background: `color-mix(in srgb, ${color} 12%, transparent)`, color }
        : undefined
    }
    aria-hidden="true"
  >
    {children}
  </span>
);

export interface RangeOption {
  id: string;
  label: string;
  /** Number of trailing periods to keep. Undefined keeps everything. */
  points?: number;
}

/** Segmented pill group: [1M | 3M | 6M | YTD | ALL] mapped to real periods. */
export const SegmentedRange = ({
  options,
  value,
  onChange,
  className,
}: {
  options: RangeOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) => {
  if (options.length < 2) return null;
  return (
    <div className={cn("segmented print:hidden", className)} role="tablist" aria-label="Time range">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          className={cn("segment", value === o.id && "active")}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

/**
 * Builds the range options that the supplied series length can actually satisfy,
 * so a control never offers a window we have no data for.
 */
export const rangeOptionsFor = (count: number): RangeOption[] => {
  const candidates: RangeOption[] = [
    { id: "1m", label: "1M", points: 1 },
    { id: "3m", label: "3M", points: 3 },
    { id: "6m", label: "6M", points: 6 },
    { id: "12m", label: "YTD", points: 12 },
  ];
  const usable = candidates.filter((c) => (c.points ?? 0) < count);
  return [...usable, { id: "all", label: "All" }];
};

/** Quiet underlined text tabs ("Expenses | Budget"). */
export const TextTabs = ({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) => (
  <div className={cn("flex items-center gap-5 print:hidden", className)} role="tablist">
    {tabs.map((t) => (
      <button
        key={t.id}
        type="button"
        role="tab"
        aria-selected={value === t.id}
        className={cn("text-tab", value === t.id && "active")}
        onClick={() => onChange(t.id)}
      >
        {t.label}
      </button>
    ))}
  </div>
);
