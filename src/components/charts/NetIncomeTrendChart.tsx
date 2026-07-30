import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame, ChartSkeleton } from "./ChartFrame";
import { axisTick, chartColors, compactCurrency, fullCurrency } from "./chartTheme";

export interface TrendPoint {
  month: string;
  net: number;
}

const TrendTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const v = payload[0].value as number;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">{label}</p>
      <div className="chart-tooltip-row">
        <span className="chart-tooltip-key">Net income</span>
        <span className={`tabular ${v < 0 ? "text-expense" : "text-foreground"}`}>{fullCurrency(v)}</span>
      </div>
    </div>
  );
};

interface Props {
  data: TrendPoint[];
  className?: string;
}

export const NetIncomeTrendChart = ({ data, className }: Props) => {
  const hasData = data.some((d) => d.net !== 0);
  const total = data.reduce((s, d) => s + d.net, 0);

  return (
    <ChartFrame
      eyebrow="Trend"
      title="Net Income"
      value={hasData ? fullCurrency(total) : undefined}
      meta={hasData ? `${data.length} periods` : undefined}
      className={className}
    >
      {!hasData ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={252}>
          <AreaChart data={data} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="netIncomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.28} />
                <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={chartColors.grid} vertical={false} />
            <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} dy={8} />
            <YAxis
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              width={54}
              tickFormatter={compactCurrency}
            />
            <ReferenceLine y={0} stroke="hsl(0 0% 100% / 0.14)" strokeWidth={1} />
            <Tooltip content={<TrendTooltip />} cursor={{ stroke: "hsl(0 0% 100% / 0.12)", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="net"
              stroke={chartColors.primary}
              strokeWidth={1.5}
              fill="url(#netIncomeFill)"
              dot={{ r: 2.5, fill: "hsl(var(--background))", stroke: chartColors.primary, strokeWidth: 1.5 }}
              activeDot={{ r: 4, strokeWidth: 1.5 }}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartFrame>
  );
};
