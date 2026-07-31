import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  CHART_MARGIN,
  axisTick,
  chartColors,
  compactCurrency,
  fullCurrency,
  shortenLabel,
} from "./chartTheme";

export interface WaterfallStep {
  name: string;
  /** Signed contribution. Positive adds, negative subtracts. */
  amount: number;
  /** Renders as an absolute total column anchored to zero. */
  total?: boolean;
}

interface Props {
  steps: WaterfallStep[];
  period?: string;
  basis?: string;
  className?: string;
}

/**
 * Horizontal P&L / cash bridge. Categories live on the Y axis so long account
 * names never collide — they are truncated with the full name in the tooltip.
 */
export const PLWaterfallChart = ({
  steps,
  period,
  basis = "Cash basis · Bank statements",
  className,
}: Props) => {
  let running = 0;
  const bars = steps.map((s) => {
    if (s.total) {
      const value = running;
      return {
        name: s.name,
        label: shortenLabel(s.name, 20),
        base: Math.min(0, value),
        span: Math.abs(value),
        amount: value,
        cumulative: value,
        kind: "total" as const,
      };
    }
    const start = running;
    running += s.amount;
    return {
      name: s.name,
      label: shortenLabel(s.name, 20),
      base: Math.min(start, running),
      span: Math.abs(s.amount),
      amount: s.amount,
      cumulative: running,
      kind: (s.amount >= 0 ? "add" : "sub") as "add" | "sub",
    };
  });

  const hasData = bars.some((b) => b.span !== 0);

  const colorFor = (kind: string) =>
    kind === "total" ? chartColors.primary : kind === "add" ? chartColors.income : chartColors.expense;

  const WFTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <SeriesTooltip
        title={d.name}
        rows={[
          {
            key: "a",
            label: d.kind === "total" ? "Balance" : d.amount >= 0 ? "Increase" : "Decrease",
            value: d.amount,
            color: colorFor(d.kind),
          },
          { key: "c", label: "Running total", value: d.cumulative, emphasis: true },
        ]}
      />
    );
  };

  const net = bars[bars.length - 1]?.cumulative ?? 0;
  const chartHeight = Math.max(220, bars.length * 34 + 32);

  return (
    <ChartFrame
      eyebrow="Bridge"
      title="Profit & Loss Waterfall"
      period={period}
      basis={basis}
      value={hasData ? fullCurrency(net) : undefined}
      meta={hasData ? "Net result" : undefined}
      className={className}
      exportData={{
        columns: ["Step", "Amount", "Running total"],
        rows: bars.map((b) => [b.name, b.amount, b.cumulative]),
      }}
      footer={
        hasData ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="chart-legend">
              <i style={{ background: chartColors.income }} />
              Inflow
            </span>
            <span className="chart-legend">
              <i style={{ background: chartColors.expense }} />
              Outflow
            </span>
            <span className="chart-legend">
              <i style={{ background: chartColors.primary }} />
              Subtotal
            </span>
          </div>
        ) : undefined
      }
    >
      {!hasData ? (
        <ChartSkeleton label="No P&L activity" hint="Categorise transactions to build the bridge." />
      ) : (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={bars}
            layout="vertical"
            margin={{ ...CHART_MARGIN, right: 56, left: 2 }}
            barCategoryGap="26%"
          >
            <CartesianGrid stroke={chartColors.grid} horizontal={false} />
            <XAxis
              type="number"
              tick={{ ...axisTick, fontSize: 10.5 }}
              tickLine={false}
              axisLine={false}
              tickCount={4}
              tickFormatter={compactCurrency}
              height={22}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ ...axisTick, fontSize: 10.5 }}
              tickLine={false}
              axisLine={false}
              width={118}
              interval={0}
            />
            <ReferenceLine x={0} stroke="hsl(0 0% 100% / 0.14)" />
            <Tooltip
              content={<WFTooltip />}
              cursor={{ fill: "hsl(0 0% 100% / 0.035)" }}
              animationDuration={120}
            />
            <Bar dataKey="base" stackId="wf" fill="transparent" isAnimationActive={false} />
            <Bar
              dataKey="span"
              stackId="wf"
              radius={[0, 3, 3, 0]}
              maxBarSize={22}
              animationDuration={750}
              animationEasing="ease-out"
            >
              {bars.map((b, i) => (
                <Cell key={i} fill={colorFor(b.kind)} />
              ))}
              <LabelList
                dataKey="amount"
                position="right"
                offset={8}
                fill="hsl(var(--muted-foreground))"
                fontSize={10.5}
                style={{ fontVariantNumeric: "tabular-nums" }}
                formatter={(v: number) => compactCurrency(v)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartFrame>
  );
};
