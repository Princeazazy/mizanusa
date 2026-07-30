import { ReactNode } from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Designed empty state — always paired with a clear next action. */
export const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/[0.09] px-8 py-14 text-center",
      className,
    )}
  >
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-muted-foreground">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
    <div>
      <p className="text-[14px] font-medium text-foreground">{title}</p>
      {description && (
        <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {action && <div className="mt-1">{action}</div>}
  </div>
);

/** Shape-matched table skeleton. */
export const TableSkeleton = ({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="space-y-px" aria-busy="true" aria-label="Loading table">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4 px-4 py-3">
        {Array.from({ length: cols }).map((_, c) => (
          <div
            key={c}
            className="h-3 animate-pulse rounded bg-white/[0.05]"
            style={{
              flex: c === 0 ? 2 : 1,
              animationDelay: `${(r * cols + c) * 40}ms`,
            }}
          />
        ))}
      </div>
    ))}
  </div>
);
