import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Building2,
  CreditCard,
  Fuel,
  Landmark,
  Package,
  Receipt,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { ChartFrame, ChartSkeleton } from "./ChartFrame";
import { IconChip, TextTabs } from "./CardChrome";
import { SeriesTooltip } from "./SeriesTooltip";
import { fullCurrency, shortenLabel } from "./chartTheme";

export interface DonutSlice {
  name: string;
  value: number;
}

/** Refined multi-hue palette — teal stays primary, then blue → violet range. */
export const donutPalette = [
  "hsl(var(--primary))",
  "hsl(var(--glow-blue))",
  "hsl(var(--glow-violet))",
  "hsl(196 84% 58%)",
  "hsl(41 92% 60%)",
  "hsl(340 72% 62%)",
  "hsl(228 12% 46%)",
];

const iconFor = (name: string) => {
  const n = name.toLowerCase();
  if (/inventory|purchase|supplies|material/.test(n)) return Package;
  if (/payroll|wage|labor|contractor|employee/.test(n)) return Users;
  if (/transfer|bank|loan|interest/.test(n)) return Landmark;
  if (/fuel|gas|vehicle|auto|mileage/.test(n)) return Fuel;
  if (/insurance|tax|license|registration|title/.test(n)) return ShieldCheck;
  if (/rent|office|utilit/.test(n)) return Building2;
  if (/repair|maintenance|tool|equipment/.test(n)) return Wrench;
  if (/shipping|freight|delivery|vitu/.test(n)) return Truck;
  if (/card|merchant|fee/.test(n)) return CreditCard;
  return Receipt;
};

const DonutTooltip = ({ active, payload, total }: any) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <SeriesTooltip
      title={p.name}
      rows={[
        { key: "v", label: "Amount", value: p.value, emphasis: true, color: p.payload?.fill },
        {
          key: "s",
          label: "Share of expenses",
          value: `${total ? ((p.value / total) * 100).toFixed(1) : "0.0"}%`,
        },
      ]}
    />
  );
};

interface Props {
  data: DonutSlice[];
  period?: string;
  basis?: string;
  title?: string;
  maxRows?: number;
  featured?: boolean;
  className?: string;
}

/**
 * Origin-style category donut: thick rounded segments, centred total, and
 * category rows with tinted circular icon chips.
 */
export const CategoryDonut = ({
  data,
  period,
  basis = "Cash basis · Bank statements",
  title = "Category Breakdown",
  maxRows = 6,
  featured = false,
  className,
}: Props) => {
  const [tab, setTab] = useState("expenses");

  const { slices, total } = useMemo(() => {
    const sorted = [...data].filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
    const head = sorted.slice(0, maxRows);
    const rest = sorted.slice(maxRows).reduce((s, d) => s + d.value, 0);
    const all = rest > 0 ? [...head, { name: "All other", value: rest }] : head;
    return { slices: all, total: all.reduce((s, d) => s + d.value, 0) };
  }, [data, maxRows]);

  const hasData = total > 0;

  return (
    <ChartFrame
      title={title}
      period={period}
      basis={basis}
      featured={featured}
      className={className}
      exportData={{
        columns: ["Category", "Amount", "Share %"],
        rows: slices.map((s) => [
          s.name,
          s.value,
          total ? ((s.value / total) * 100).toFixed(1) : "0.0",
        ]),
      }}
      controls={
        hasData ? (
          <TextTabs
            tabs={[
              { id: "expenses", label: "Expenses" },
              { id: "share", label: "Share" },
            ]}
            value={tab}
            onChange={setTab}
          />
        ) : undefined
      }
    >
      {!hasData ? (
        <ChartSkeleton
          label="No categorised expenses yet"
          hint="Assign chart-of-accounts codes to withdrawals to see the breakdown."
        />
      ) : (
        <div className="px-4 sm:px-5">
          <div className="relative mx-auto h-[212px] w-full max-w-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="66%"
                  outerRadius="94%"
                  paddingAngle={3}
                  cornerRadius={8}
                  stroke="none"
                  animationDuration={800}
                >
                  {slices.map((s, i) => (
                    <Cell key={s.name} fill={donutPalette[i % donutPalette.length]} />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip total={total} />} animationDuration={120} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="hero-figure text-[clamp(1.25rem,3.4vw,1.6rem)]" title={fullCurrency(total)}>
                {fullCurrency(total)}
              </span>
              <span className="card-label mt-2 text-[10px]">Total expenses</span>
            </div>
          </div>

          <ul className="mt-7 space-y-1">
            {slices.map((s, i) => {
              const color = donutPalette[i % donutPalette.length];
              const Icon = iconFor(s.name);
              const share = total ? (s.value / total) * 100 : 0;
              return (
                <li key={s.name} className="flex items-center gap-3.5 rounded-2xl px-1.5 py-2.5">
                  <IconChip color={color}>
                    <Icon className="h-4 w-4" />
                  </IconChip>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] text-foreground/90" title={s.name}>
                      {shortenLabel(s.name, 26)}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] text-muted-foreground tabular">
                      {share.toFixed(1)}% of expenses
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-[13.5px] tabular text-foreground">
                    {tab === "share" ? `${share.toFixed(1)}%` : fullCurrency(s.value)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </ChartFrame>
  );
};
