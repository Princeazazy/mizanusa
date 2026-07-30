import { fullCurrency } from "./chartTheme";

export interface LedgerRow {
  name: string;
  value: number;
  color?: string;
  /** Optional override for the right-most figure. */
  display?: string;
}

/**
 * Monarch-style category table: colour dot, truncated name, amount and share
 * in aligned tabular columns. Used beside or beneath every chart.
 */
export const CategoryLedger = ({
  rows,
  total,
  heading = "Category",
  valueHeading = "Amount",
  className = "",
}: {
  rows: LedgerRow[];
  /** Denominator for the share column. Defaults to the sum of rows. */
  total?: number;
  heading?: string;
  valueHeading?: string;
  className?: string;
}) => {
  const denom = total ?? rows.reduce((s, r) => s + Math.abs(r.value), 0);
  if (!rows.length) return null;

  return (
    <div className={className}>
      <div className="flex items-center gap-3 border-b border-white/[0.06] pb-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
        <span className="min-w-0 flex-1 truncate">{heading}</span>
        <span className="w-12 shrink-0 text-right">Share</span>
        <span className="w-24 shrink-0 text-right">{valueHeading}</span>
      </div>
      <ul className="divide-y divide-white/[0.05]">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3 py-2.5 text-[13px]">
            <span className="flex min-w-0 flex-1 items-center gap-2.5">
              {r.color && (
                <i
                  className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                  style={{ background: r.color }}
                  aria-hidden="true"
                />
              )}
              <span className="min-w-0 truncate text-foreground/85" title={r.name}>
                {r.name}
              </span>
            </span>
            <span className="w-12 shrink-0 text-right tabular text-muted-foreground">
              {denom ? ((Math.abs(r.value) / denom) * 100).toFixed(1) : "0.0"}%
            </span>
            <span className="w-24 shrink-0 truncate text-right tabular text-foreground">
              {r.display ?? fullCurrency(r.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Small aligned label/value stack used for chart side summaries. */
export const SummaryRows = ({
  rows,
  className = "",
}: {
  rows: { label: string; value: string }[];
  className?: string;
}) => (
  <dl className={`divide-y divide-white/[0.05] ${className}`}>
    {rows.map((r) => (
      <div key={r.label} className="flex items-baseline justify-between gap-3 py-2">
        <dt className="min-w-0 truncate text-[12px] text-muted-foreground" title={r.label}>
          {r.label}
        </dt>
        <dd className="shrink-0 tabular text-[13px] text-foreground">{r.value}</dd>
      </div>
    ))}
  </dl>
);
