import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FuturisticStatCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  variant?: "default" | "income" | "expense" | "warning" | "info";
  delay?: number;
}

export const FuturisticStatCard = ({
  label,
  value,
  change,
  changeLabel = "vs last period",
  variant = "default",
  delay = 0,
}: FuturisticStatCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <motion.div
      className={cn(
        "stat-card",
        variant === "income" && "stat-card-income",
        variant === "expense" && "stat-card-expense",
        variant === "warning" && "stat-card-warning",
        variant === "info" && "stat-card-info"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="amount-large text-foreground mb-2">{value}</p>
      
      {change !== undefined && (
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          isPositive && "text-income",
          isNegative && "text-expense"
        )}>
          {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
          {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
          <span>{isPositive ? "+" : ""}{change}%</span>
          {changeLabel && (
            <span className="text-muted-foreground text-xs ml-1">{changeLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};
