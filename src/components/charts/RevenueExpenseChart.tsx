import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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

export interface MonthlyPoint {
  month: string;
  revenue: number;
  expenses: number;
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const revenue = payload.find((p: any) => p.dataKey === "revenue")?.value ?? 0;
  const expenses = payload.find((p: any) => p.dataKey === "expenses")?.value ?? 0;
  return (
    <SeriesTooltip
      title={label}
      rows={[
        { key: "r", label: "Revenue", value: revenue, color: chartColors.primary },
        { key: "e", label: "Expenses", value: expenses, color: chartColors.neutral },
        { key: "n", label: "Net", value: revenue - expenses, emphasis: true },
      ]}
    />
  );
};

interface Props {
  data: MonthlyPoint[];
  period?: string;
  basis?: string;
  className?: string;
}

export const RevenueExpenseChart = ({
  data,
  period,
  basis = "Cash basis · Bank statements",
  className,
}: Props) => {
  const hasData = data.some((d) => d.revenue !== 0 || d.expenses !== 0);
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalExpenses = data.reduce((s, d) => s + d.expenses, 0);
  const avgRevenue = mean(data.map((d) => d.revenue));
  const delta = periodDelta(data.map((d) => d.revenue));
  const lastMonth = data[data.length - 1]?.month;

  return (
    <ChartFrame
      eyebrow="Monthly Performance"
      title="Revenue vs. Expenses"
      period={period}
      basis={basis}
      value={hasData ? fullCurrency(totalRevenue) : undefined}
      delta={hasData ? delta : undefined}
      meta={hasData ? `${fullCurrency(totalExpenses)} spent` : undefined}
      className={className}
      footer={
        hasData ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="chart-legend">
              <i style={{ background: chartColors.primary }} />
              Revenue
            </span>
            <span className="chart-legend">
              <i style={{ background: chartColors.neutral }} />
              Expenses
            </span>
            <span className="chart-legend">
              <i className="!h-px !w-4 !rounded-none" style={{ background: chartColors.reference }} />
              Avg. revenue {compactCurrency(avgRevenue)}
            </span>
          </div>
        ) : undefined
      }
    >
      {!hasData ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={data} margin={CHART_MARGIN} barGap={5}>
            <CartesianGrid stroke={chartColors.grid} vertical={false} strokeDasharray="0" />
            <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} dy={8} interval="preserveStartEnd" minTickGap={12} />
            <YAxis
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              width={54}
              tickCount={4}
              tickFormatter={compactCurrency}
            />
            <ReferenceLine
              y={avgRevenue}
              stroke={chartColors.reference}
              strokeDasharray="3 4"
              strokeWidth={1}
              ifOverflow="extendDomain"
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "hsl(0 0% 100% / 0.035)" }}
              animationDuration={120}
            />
            <Bar
              dataKey="revenue"
              fill={chartColors.primary}
              radius={[3, 3, 0, 0]}
              maxBarSize={26}
              animationDuration={750}
              animationEasing="ease-out"
            >
              {/* Value label on the closing data point only */}
              <LabelList
                dataKey="revenue"
                position="top"
                offset={8}
                content={(props: any) => {
                  if (props.index !== data.length - 1) return null;
                  return (
                    <text
                      x={props.x + props.width / 2}
                      y={props.y - 8}
                      textAnchor="middle"
                      fill="hsl(var(--foreground))"
                      fontSize={11}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {compactCurrency(props.value)}
                    </text>
                  );
                }}
              />
            </Bar>
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
      {hasData && lastMonth && (
        <p className="sr-only">
          Revenue closed at {fullCurrency(data[data.length - 1].revenue)} in {lastMonth}.
        </p>
      )}
    </ChartFrame>
  );
};
