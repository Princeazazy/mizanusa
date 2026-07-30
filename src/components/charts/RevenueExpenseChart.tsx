import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame, ChartSkeleton } from "./ChartFrame";
import { axisTick, chartColors, compactCurrency, fullCurrency } from "./chartTheme";

export interface MonthlyPoint {
  month: string;
  revenue: number;
  expenses: number;
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="chart-tooltip-row">
          <span className="chart-tooltip-key">
            <i style={{ background: entry.color }} />
            {entry.dataKey === "revenue" ? "Revenue" : "Expenses"}
          </span>
          <span className="tabular">{fullCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

interface Props {
  data: MonthlyPoint[];
  className?: string;
}

export const RevenueExpenseChart = ({ data, className }: Props) => {
  const hasData = data.some((d) => d.revenue !== 0 || d.expenses !== 0);
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalExpenses = data.reduce((s, d) => s + d.expenses, 0);

  return (
    <ChartFrame
      eyebrow="Monthly Performance"
      title="Revenue vs. Expenses"
      value={hasData ? fullCurrency(totalRevenue) : undefined}
      meta={hasData ? `${fullCurrency(totalExpenses)} spent` : undefined}
      className={className}
    >
      {!hasData ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={252}>
          <BarChart data={data} margin={{ top: 4, right: 16, left: 4, bottom: 0 }} barGap={5}>
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="0" vertical={false} />
            <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} dy={8} />
            <YAxis
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              width={54}
              tickFormatter={compactCurrency}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(0 0% 100% / 0.03)" }} />
            <Bar
              dataKey="revenue"
              fill={chartColors.primary}
              radius={[3, 3, 0, 0]}
              maxBarSize={26}
              animationDuration={750}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="expenses"
              fill={chartColors.neutral}
              radius={[3, 3, 0, 0]}
              maxBarSize={26}
              animationDuration={750}
              animationBegin={120}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      <div className="mt-4 flex items-center gap-5 px-4">
        <span className="chart-legend">
          <i style={{ background: chartColors.primary }} />
          Revenue
        </span>
        <span className="chart-legend">
          <i style={{ background: chartColors.neutral }} />
          Expenses
        </span>
      </div>
    </ChartFrame>
  );
};
