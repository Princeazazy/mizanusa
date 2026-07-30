import { ReactNode } from "react";

interface ChartFrameProps {
  eyebrow: string;
  title: string;
  value?: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Editorial chart container: quiet label stack, oversized figure, hairline rule. */
export const ChartFrame = ({ eyebrow, title, value, meta, children, className = "" }: ChartFrameProps) => (
  <figure className={`surface-panel flex flex-col ${className}`}>
    <figcaption className="flex items-start justify-between gap-6 px-6 pt-6">
      <div>
        <span className="eyebrow-label">{eyebrow}</span>
        <h3 className="mt-2 text-[15px] font-medium text-foreground">{title}</h3>
      </div>
      {value && (
        <div className="text-right">
          <span className="stat-display text-[26px] leading-none">{value}</span>
          {meta && <div className="mt-1.5 text-xs text-muted-foreground tabular">{meta}</div>}
        </div>
      )}
    </figcaption>
    <div className="mt-6 h-px w-full bg-white/[0.06]" />
    <div className="flex-1 px-2 pb-4 pt-5">{children}</div>
  </figure>
);

export const ChartSkeleton = ({ label = "No data for this period" }: { label?: string }) => (
  <div className="flex h-[240px] flex-col items-center justify-center gap-4 px-6">
    <div className="flex w-full max-w-xs items-end justify-between gap-2" aria-hidden="true">
      {[38, 62, 48, 76, 54, 88, 44].map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-white/[0.05] animate-pulse"
          style={{ height: h, animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);
