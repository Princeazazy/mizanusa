import { compactCurrency, fullCurrency, periodDelta } from "./chartTheme";
import { DeltaBadge } from "./ChartFrame";

export interface SparkSeries {
  label: string;
  values: number[];
  /** Down is good for cost lines. */
  invertDelta?: boolean;
}

const Spark = ({ values }: { values: number[] }) => {
  const w = 92;
  const h = 26;
  if (values.length < 2) return <svg width={w} height={h} aria-hidden="true" />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y] as const;
  });
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="overflow-visible">
      <path d={d} fill="none" stroke="hsl(var(--primary))" strokeWidth={1.25} strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2} fill="hsl(var(--primary))" />
    </svg>
  );
};

/** Small-multiples row: per-account trend at a glance. */
export const SparklineRow = ({
  title = "Account Trends",
  period,
  basis = "Cash basis · Bank statements",
  series,
  className = "",
}: {
  title?: string;
  period?: string;
  basis?: string;
  series: SparkSeries[];
  className?: string;
}) => {
  if (!series.length) return null;

  return (
    <section
      className={`surface-panel overflow-hidden print:border print:border-neutral-300 print:bg-white print:shadow-none ${className}`}
    >
      <header className="px-6 pt-6">
        <span className="eyebrow-label">Small multiples</span>
        <h3 className="mt-2 text-[15px] font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-[11px] text-muted-foreground/80">
          {[period, basis].filter(Boolean).join(" · ")}
        </p>
      </header>
      <div className="mt-5 h-px w-full bg-white/[0.06]" />
      <ul className="grid grid-cols-1 gap-px bg-white/[0.05] sm:grid-cols-2 xl:grid-cols-3">
        {series.map((s) => {
          const total = s.values.reduce((a, b) => a + b, 0);
          const delta = periodDelta(s.values);
          return (
            <li key={s.label} className="bg-background/85 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] text-foreground/80" title={s.label}>
                    {s.label}
                  </p>
                  <p
                    className="stat-display mt-1 text-[17px] leading-none"
                    title={fullCurrency(total)}
                  >
                    {compactCurrency(total)}
                  </p>
                </div>
                <Spark values={s.values} />
              </div>
              {typeof delta === "number" && (
                <div className="mt-2">
                  <DeltaBadge value={delta} invert={s.invertDelta} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
