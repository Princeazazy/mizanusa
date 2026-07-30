import { CardLabel, HeroFigure } from "@/components/charts/CardChrome";
import { cn } from "@/lib/utils";

export interface KpiItem {
  label: string;
  value: string;
  delta?: number | null;
  invertDelta?: boolean;
  /** Small context chip, e.g. "vs. prior quarter". */
  context?: string;
  /** Gradient-border + bloom treatment. Reserve for the headline figure. */
  featured?: boolean;
}

/**
 * KPI row in the Origin language: near-black rounded cards, small-caps label,
 * large light numeral with a coloured delta, at most one featured halo card.
 */
export const KpiBand = ({ items, className }: { items: KpiItem[]; className?: string }) => (
  <section className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}>
    {items.map((item) => (
      <div
        key={item.label}
        className={cn("surface-panel min-w-0 px-6 py-6 sm:px-7", item.featured && "halo-card")}
      >
        <CardLabel>{item.label}</CardLabel>
        <HeroFigure
          className="mt-4"
          value={item.value}
          delta={typeof item.delta === "number" ? item.delta : undefined}
          invertDelta={item.invertDelta}
          contextLabel={item.context}
        />
      </div>
    ))}
  </section>
);
