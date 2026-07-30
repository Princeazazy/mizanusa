import { ReactNode } from "react";
import { fullCurrency } from "./chartTheme";

export interface TooltipRow {
  key: string;
  label: string;
  value: number | string;
  color?: string;
  emphasis?: boolean;
}

/** Compact aligned table: label left, tabular figure right. */
export const SeriesTooltip = ({
  title,
  rows,
  note,
}: {
  title: ReactNode;
  rows: TooltipRow[];
  note?: ReactNode;
}) => (
  <div className="chart-tooltip min-w-[172px]">
    <p className="chart-tooltip-title">{title}</p>
    <div className="space-y-1">
      {rows.map((r) => (
        <div key={r.key} className="chart-tooltip-row">
          <span className="chart-tooltip-key">
            {r.color && <i style={{ background: r.color }} />}
            {r.label}
          </span>
          <span className={`tabular ${r.emphasis ? "font-medium text-foreground" : ""}`}>
            {typeof r.value === "number" ? fullCurrency(r.value) : r.value}
          </span>
        </div>
      ))}
    </div>
    {note && (
      <p className="mt-2 border-t border-white/[0.07] pt-1.5 text-[10.5px] text-muted-foreground/80">
        {note}
      </p>
    )}
  </div>
);
