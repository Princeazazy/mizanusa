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
  crosshair: "hsl(0 0% 100% / 0.16)",
  reference: "hsl(0 0% 100% / 0.22)",
};

/** One height and one margin set for every chart in the product. */
export const CHART_HEIGHT = 244;
export const CHART_MARGIN = { top: 14, right: 22, left: 4, bottom: 0 };

export const axisTick = {
  fill: chartColors.axis,
  fontSize: 11,
  fontVariantNumeric: "tabular-nums" as const,
  letterSpacing: "0.02em",
};

export const compactCurrency = (value: number) => {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1000)}K`;
  return `${sign}$${Math.round(abs)}`;
};

export const fullCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const mean = (values: number[]) =>
  values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;

/** Period-over-period change between the first and last observation. */
export const periodDelta = (values: number[]) => {
  if (values.length < 2) return null;
  const first = values[0];
  const last = values[values.length - 1];
  if (first === 0) return null;
  return ((last - first) / Math.abs(first)) * 100;
};
