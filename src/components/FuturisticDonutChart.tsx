import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface ExpenseCategory {
  name: string;
  amount: number;
  change: number;
  color: string;
}

interface FuturisticDonutChartProps {
  title: string;
  totalValue: string;
  totalLabel: string;
  change: number;
  categories: ExpenseCategory[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export const FuturisticDonutChart = ({
  title,
  totalValue,
  totalLabel,
  change,
  categories,
}: FuturisticDonutChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
  let currentAngle = 0;

  const segments = categories.map((category, index) => {
    const percentage = (category.amount / total) * 100;
    const startAngle = currentAngle;
    currentAngle += (percentage / 100) * 360;
    return { ...category, percentage, startAngle, endAngle: currentAngle, index };
  });

  const hoveredSegment = hoveredIndex !== null ? segments[hoveredIndex] : null;

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 className="section-header">{title}</h3>

      <div className="flex items-start gap-6">
        {/* Donut Chart */}
        <div className="relative w-72 h-72 donut-glow flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {segments.map((segment, index) => {
              const radius = 40;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = (segment.percentage / 100) * circumference;
              const strokeDashoffset = segments
                .slice(0, index)
                .reduce((sum, s) => sum - (s.percentage / 100) * circumference, 0);

              const isHovered = hoveredIndex === index;

              return (
                <circle
                  key={segment.name}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={isHovered ? 16 : 12}
                  strokeDasharray={`${strokeDasharray} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 12px ${segment.color})` : undefined,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <AnimatePresence mode="wait">
              {hoveredSegment ? (
                <motion.div
                  key="hovered"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="text-xs text-muted-foreground mb-1">{hoveredSegment.name}</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(hoveredSegment.amount)}</p>
                  <p className="text-xs text-muted-foreground">{hoveredSegment.percentage.toFixed(1)}%</p>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="text-xs text-muted-foreground mb-1">{totalLabel}</p>
                  <p className="text-xl font-bold text-foreground">{totalValue}</p>
                  <div className="flex items-center gap-1 text-income text-sm mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{change}%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Categories list */}
        <div className="flex-1 space-y-3">
          {categories.map((category, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={category.name}
                className={`flex items-center gap-3 py-2 rounded-lg px-2 -mx-2 transition-colors cursor-pointer ${
                  isHovered ? "bg-accent/50" : "hover:bg-accent/30"
                }`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-1.5 h-8 rounded-full transition-all"
                  style={{
                    backgroundColor: category.color,
                    boxShadow: isHovered ? `0 0 10px ${category.color}` : undefined,
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    {index + 1}. {category.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">${category.amount.toLocaleString()}</p>
                  <p className={`text-xs ${category.change > 0 ? "text-expense" : "text-income"}`}>
                    {category.change > 0 ? "↑" : "↓"} {Math.abs(category.change)}%
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
