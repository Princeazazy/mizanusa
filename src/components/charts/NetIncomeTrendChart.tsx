import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame, ChartSkeleton } from "./ChartFrame";
import { SummaryRows } from "./CategoryLedger";
import { SegmentedRange, rangeOptionsFor } from "./CardChrome";
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
  /** Optional prior-period value, drawn as a dashed comparison line. */
  compare?: number;
}

const LINE = "hsl(212 100% 65%)";

const TrendTooltip = ({ active, payload, label, avg }: any) => {
  if (!active || !payload?.length) return null;
  const net = payload.find((p: any) => p.dataKey === "net")?.value as number;
  const compare = payload.find((p: any) => p.dataKey === "compare")?.value as number | undefined;
  return (
    <SeriesTooltip
      title={label}
      rows={[
        { key: "n", label: "Net income", value: net, emphasis: true, color: LINE },
        ...(typeof compare === "number"
          ? [{ key: "c", label: "Prior period", value: compare }]
          : []),
        { key: "a", label: "Period avg.", value: avg },
        { key: "d", label: "vs. avg.", value: fullCurrency(net - avg) },
      ]}
    />
  );
};

interface Props {
  data: TrendPoint[];
  period?: string;
  basis?: string;
  featured?: boolean;
  className?: string;
}

export const NetIncomeTrendChart = ({
  data,
  period,
  basis = "Cash basis · Bank statements",
  featured = true,
  className,
}: Props) => {
  const rangeOptions = useMemo(() => rangeOptionsFor(data.length), [data.length]);
  const [range, setRange] = useState("all");

  const view = useMemo(() => {
    const opt = rangeOptions.find((o) => o.id === range);
    if (!opt?.points) return data;
    return data.slice(Math.max(0, data.length - opt.points));
  }, [data, range, rangeOptions]);

  const hasData = view.some((d) => d.net !== 0);
  const hasCompare = view.some((d) => typeof d.compare === "number");
  const total = view.reduce((s, d) => s + d.net, 0);
  const avg = mean(view.map((d) => d.net));
  const delta = periodDelta(view.map((d) => d.net));

  const peak = hasData
    ? view.reduce((best, d) => (Math.abs(d.net) > Math.abs(best.net) ? d : best), view[0])
    : null;
  const last = view[view.length - 1];

  return (
    <ChartFrame
      title="Net Cash Flow"
      eyebrow="Trend"
      period={period}
      basis={basis}
      featured={featured}
      value={hasData ? fullCurrency(total) : undefined}
      delta={hasData ? delta : undefined}
      meta={hasData ? `${view.length} periods · avg ${compactCurrency(avg)}` : undefined}
      className={className}
      exportData={{
        columns: hasCompare ? ["Period", "Net", "Prior period"] : ["Period", "Net"],
        rows: view.map((d) =>
          hasCompare ? [d.month, d.net, d.compare ?? ""] : [d.month, d.net],
        ),
      }}
      controls={
        <SegmentedRange options={rangeOptions} value={range} onChange={setRange} />
      }
      footer={
        hasData ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="chart-legend">
              <i className="!h-1.5 !w-4 !rounded-full" style={{ background: LINE }} />
              Net cash flow
            </span>
            <span className="chart-legend">
              <i className="!h-px !w-4 !rounded-none" style={{ background: chartColors.reference }} />
              {hasCompare ? "Prior period" : `Period average ${compactCurrency(avg)}`}
            </span>
          </div>
        ) : undefined
      }
    >
      {!hasData ? (
        <ChartSkeleton label="No net income recorded" />
      ) : (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <AreaChart data={view} margin={CHART_MARGIN}>
            <defs>
              <linearGradient id="netIncomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LINE} stopOpacity={0.25} />
                <stop offset="55%" stopColor={LINE} stopOpacity={0.08} />
                <stop offset="100%" stopColor={LINE} stopOpacity={0} />
              </linearGradient>
              <filter id="netIncomeGlow" x="-30%" y="-40%" width="160%" height="200%">
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="month"
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              dy={10}
              interval="preserveStartEnd"
              minTickGap={14}
            />
            <YAxis
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              width={54}
              tickCount={3}
              tickFormatter={compactCurrency}
            />
            <ReferenceLine y={0} stroke="hsl(0 0% 100% / 0.12)" strokeWidth={1} />
            {!hasCompare && (
              <ReferenceLine
                y={avg}
                stroke={chartColors.reference}
                strokeDasharray="3 5"
                strokeWidth={1}
                ifOverflow="extendDomain"
              />
            )}
            <Tooltip
              content={<TrendTooltip avg={avg} />}
              cursor={{ stroke: chartColors.crosshair, strokeWidth: 1, strokeDasharray: "3 3" }}
              animationDuration={120}
            />
            {hasCompare && (
              <Line
                type="monotone"
                dataKey="compare"
                stroke={chartColors.reference}
                strokeWidth={1.25}
                strokeDasharray="4 5"
                dot={false}
                activeDot={false}
              />
            )}
            <Area
              type="monotone"
              dataKey="net"
              stroke={LINE}
              strokeWidth={2}
              strokeLinecap="round"
              fill="url(#netIncomeFill)"
              filter="url(#netIncomeGlow)"
              dot={false}
              activeDot={{ r: 4, fill: LINE, stroke: "hsl(var(--background))", strokeWidth: 2 }}
              animationDuration={900}
              animationEasing="ease-out"
            />
            {last && (
              <ReferenceDot
                x={last.month}
                y={last.net}
                r={3.5}
                fill={LINE}
                stroke="hsl(var(--background))"
                strokeWidth={2}
                isFront
                label={{
                  value: compactCurrency(last.net),
                  position: "top",
                  offset: 12,
                  fill: "hsl(var(--foreground))",
                  fontSize: 11,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      )}
      {hasData && (
        <div className="mt-6 border-t border-white/[0.055] px-6 pt-4 sm:px-7">
          <SummaryRows
            rows={[
              { label: "Total net movement", value: fullCurrency(total) },
              { label: "Average per period", value: fullCurrency(avg) },
              ...(peak ? [{ label: `Largest period (${peak.month})`, value: fullCurrency(peak.net) }] : []),
              ...(last ? [{ label: `Closing period (${last.month})`, value: fullCurrency(last.net) }] : []),
            ]}
          />
        </div>
      )}
    </ChartFrame>
  );
};
