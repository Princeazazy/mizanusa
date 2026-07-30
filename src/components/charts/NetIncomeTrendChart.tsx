import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame, ChartSkeleton } from "./ChartFrame";
import { SeriesTooltip } from "./SeriesTooltip";
import {
  CHART_HEIGHT,
  CHART_MARGIN,
  axisTick,
  chartColors,
  compactCurrency,
  fullCurrency,
  mean,
  periodDelta,
} from "./chartTheme";

export interface TrendPoint {
  month: string;
  net: number;
}

const TrendTooltip = ({ active, payload, label, avg }: any) => {
  if (!active || !payload?.length) return null;
  const v = payload[0].value as number;
  return (
    <SeriesTooltip
      title={label}
      rows={[
        { key: "n", label: "Net income", value: v, emphasis: true, color: chartColors.primary },
        { key: "a", label: "Period avg.", value: avg },
        { key: "d", label: "vs. avg.", value: fullCurrency(v - avg) },
      ]}
    />
  );
};

interface Props {
  data: TrendPoint[];
  period?: string;
  basis?: string;
  className?: string;
}

export const NetIncomeTrendChart = ({
  data,
  period,
  basis = "Cash basis · Bank statements",
  className,
}: Props) => {
  const hasData = data.some((d) => d.net !== 0);
  const total = data.reduce((s, d) => s + d.net, 0);
  const avg = mean(data.map((d) => d.net));
  const delta = periodDelta(data.map((d) => d.net));

  const peak = hasData
    ? data.reduce((best, d) => (Math.abs(d.net) > Math.abs(best.net) ? d : best), data[0])
    : null;
  const last = data[data.length - 1];

  return (
    <ChartFrame
      eyebrow="Trend"
      title="Net Income"
      period={period}
      basis={basis}
      value={hasData ? fullCurrency(total) : undefined}
      delta={hasData ? delta : undefined}
      meta={hasData ? `${data.length} periods · avg ${compactCurrency(avg)}` : undefined}
      className={className}
      footer={
        hasData ? (
          <span className="chart-legend">
            <i className="!h-px !w-4 !rounded-none" style={{ background: chartColors.reference }} />
            Period average {compactCurrency(avg)}
          </span>
        ) : undefined
      }
    >
      {!hasData ? (
        <ChartSkeleton label="No net income recorded" />
      ) : (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <AreaChart data={data} margin={CHART_MARGIN}>
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
              tickCount={4}
              tickFormatter={compactCurrency}
            />
            <ReferenceLine y={0} stroke="hsl(0 0% 100% / 0.14)" strokeWidth={1} />
            <ReferenceLine
              y={avg}
              stroke={chartColors.reference}
              strokeDasharray="3 4"
              strokeWidth={1}
              ifOverflow="extendDomain"
            />
            <Tooltip
              content={<TrendTooltip avg={avg} />}
              cursor={{ stroke: chartColors.crosshair, strokeWidth: 1, strokeDasharray: "3 3" }}
              animationDuration={120}
            />
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
            {/* Value label pinned to the closing point */}
            {last && (
              <ReferenceDot
                x={last.month}
                y={last.net}
                r={3.5}
                fill={chartColors.primary}
                stroke="hsl(var(--background))"
                strokeWidth={1.5}
                isFront
                label={{
                  value: compactCurrency(last.net),
                  position: "top",
                  offset: 10,
                  fill: "hsl(var(--foreground))",
                  fontSize: 11,
                }}
              />
            )}
            {peak && peak.month !== last?.month && (
              <ReferenceDot
                x={peak.month}
                y={peak.net}
                r={2.5}
                fill="hsl(var(--background))"
                stroke={chartColors.reference}
                strokeWidth={1.5}
                isFront
                label={{
                  value: `Peak ${compactCurrency(peak.net)}`,
                  position: "top",
                  offset: 10,
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartFrame>
  );
};
