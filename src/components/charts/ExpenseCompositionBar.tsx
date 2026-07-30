import { ChartFrame, ChartSkeleton } from "./ChartFrame";
import { fullCurrency } from "./chartTheme";
import { CategoryLedger, SummaryRows } from "./CategoryLedger";

export interface CompositionSlice {
  name: string;
  value: number;
}

/** Single-accent ramp: the largest category carries the accent, the rest recede into graphite. */
export const rampColor = (index: number) => {
  if (index === 0) return "hsl(var(--primary))";
  const shades = [
    "hsl(228 12% 58%)",
    "hsl(228 12% 50%)",
    "hsl(228 12% 42%)",
    "hsl(228 12% 34%)",
    "hsl(228 12% 27%)",
    "hsl(228 12% 21%)",
  ];
  return shades[Math.min(index - 1, shades.length - 1)];
};

interface Props {
  data: CompositionSlice[];
  period?: string;
  basis?: string;
  maxRows?: number;
  className?: string;
}

/**
 * Stacked horizontal bar + ranked ledger. Reads composition far better than a
 * donut once there are more than three categories, and prints cleanly.
 */
export const ExpenseCompositionBar = ({
  data,
  period,
  basis = "Cash basis · Bank statements",
  maxRows = 7,
  className,
}: Props) => {
  const sorted = [...data].filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const head = sorted.slice(0, maxRows);
  const restTotal = sorted.slice(maxRows).reduce((s, d) => s + d.value, 0);
  const slices = restTotal > 0 ? [...head, { name: "All other", value: restTotal }] : head;
  const total = slices.reduce((s, d) => s + d.value, 0);
  const hasData = total > 0;

  return (
    <ChartFrame
      eyebrow="Composition"
      title="Expense Breakdown"
      period={period}
      basis={basis}
      value={hasData ? fullCurrency(total) : undefined}
      meta={hasData ? `${slices.length} categories` : undefined}
      className={className}
    >
      {!hasData ? (
        <ChartSkeleton
          label="No categorised expenses yet"
          hint="Assign chart-of-accounts codes to withdrawals to see composition."
        />
      ) : (
        <div className="px-4">
          {/* Stacked bar */}
          <div
            className="flex h-3 w-full overflow-hidden rounded-full bg-white/[0.04]"
            role="img"
            aria-label={`Expense composition: ${slices
              .map((s) => `${s.name} ${((s.value / total) * 100).toFixed(0)} percent`)
              .join(", ")}`}
          >
            {slices.map((s, i) => (
              <div
                key={s.name}
                className="h-full transition-[flex-grow] duration-500"
                style={{ flexGrow: s.value, background: rampColor(i) }}
                title={`${s.name} — ${fullCurrency(s.value)}`}
              />
            ))}
          </div>

          {/* Ranked ledger — Monarch-style aligned columns */}
          <CategoryLedger
            className="mt-5"
            rows={slices.map((sl, i) => ({ name: sl.name, value: sl.value, color: rampColor(i) }))}
            total={total}
          />

          <SummaryRows
            className="mt-3 border-t border-white/[0.06] pt-2"
            rows={[
              { label: "Categories", value: String(slices.length) },
              { label: "Largest category", value: fullCurrency(slices[0]?.value ?? 0) },
              { label: "Average per category", value: fullCurrency(total / slices.length) },
              { label: "Total expenses", value: fullCurrency(total) },
            ]}
          />
        </div>
      )}
    </ChartFrame>
  );
};
