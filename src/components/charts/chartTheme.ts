/**
 * Shared chart language: thin strokes, muted grid, tabular numerals,
 * accent reserved for the primary series only.
 */
export const chartColors = {
  primary: "hsl(var(--primary))",
  income: "hsl(var(--income))",
  expense: "hsl(var(--expense))",
  neutral: "hsl(228 10% 42%)",
  grid: "hsl(0 0% 100% / 0.055)",
  axis: "hsl(228 10% 52%)",
};

export const axisTick = {
  fill: chartColors.axis,
  fontSize: 11,
  fontVariantNumeric: "tabular-nums" as const,
  letterSpacing: "0.02em",
};

export const compactCurrency = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${Math.round(value / 1000)}K`;
  return `$${Math.round(value)}`;
};

export const fullCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
