import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartFrame, ChartSkeleton } from "./ChartFrame";
import { fullCurrency } from "./chartTheme";

export interface CategorySlice {
  name: string;
  value: number;
}

/** Single-accent ramp: the largest category carries the accent, the rest recede into graphite. */
const sliceColor = (index: number) => {
  if (index === 0) return "hsl(var(--primary))";
  const shades = [
    "hsl(228 12% 58%)",
    "hsl(228 12% 48%)",
    "hsl(228 12% 39%)",
    "hsl(228 12% 31%)",
    "hsl(228 12% 24%)",
  ];
  return shades[Math.min(index - 1, shades.length - 1)];
};

const DonutTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">{p.name}</p>
      <div className="chart-tooltip-row">
        <span className="chart-tooltip-key">Total</span>
        <span className="tabular">{fullCurrency(p.value)}</span>
      </div>
    </div>
  );
};

interface Props {
  data: CategorySlice[];
  className?: string;
}

export const ExpenseBreakdownChart = ({ data, className }: Props) => {
  const slices = [...data].sort((a, b) => b.value - a.value).slice(0, 6);
  const total = slices.reduce((s, d) => s + d.value, 0);
  const hasData = total > 0;

  return (
    <ChartFrame eyebrow="Composition" title="Expense Breakdown" className={className}>
      {!hasData ? (
        <ChartSkeleton label="No categorised expenses yet" />
      ) : (
        <div className="grid grid-cols-1 items-center gap-2 px-4 sm:grid-cols-[minmax(0,200px)_1fr]">
          <div className="relative h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={1.5}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                  animationDuration={850}
                  animationEasing="ease-out"
                >
                  {slices.map((_, i) => (
                    <Cell key={i} fill={sliceColor(i)} />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="eyebrow-label">Total</span>
              <span className="stat-display mt-1 text-[19px] leading-none">{fullCurrency(total)}</span>
            </div>
          </div>

          <ul className="space-y-2.5 pr-2">
            {slices.map((s, i) => (
              <li key={s.name} className="flex items-baseline justify-between gap-4 text-[13px]">
                <span className="flex min-w-0 items-center gap-2.5 text-foreground/80">
                  <i
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    style={{ background: sliceColor(i) }}
                  />
                  <span className="truncate">{s.name}</span>
                </span>
                <span className="shrink-0 tabular text-muted-foreground">
                  {((s.value / total) * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartFrame>
  );
};
