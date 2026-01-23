import { motion } from "framer-motion";
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

export const FuturisticDonutChart = ({
  title,
  totalValue,
  totalLabel,
  change,
  categories,
}: FuturisticDonutChartProps) => {
  // Calculate percentages for the donut segments
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
  let currentAngle = 0;

  const segments = categories.map((category, index) => {
    const percentage = (category.amount / total) * 100;
    const startAngle = currentAngle;
    currentAngle += (percentage / 100) * 360;
    return { ...category, percentage, startAngle, endAngle: currentAngle };
  });

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
        <div className="relative w-48 h-48 donut-glow flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {segments.map((segment, index) => {
              const radius = 40;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = (segment.percentage / 100) * circumference;
              const strokeDashoffset = segments
                .slice(0, index)
                .reduce((sum, s) => sum - (s.percentage / 100) * circumference, 0);

              return (
                <circle
                  key={segment.name}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="12"
                  strokeDasharray={`${strokeDasharray} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                  style={{ 
                    filter: `drop-shadow(0 0 8px ${segment.color}40)`,
                  }}
                />
              );
            })}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-muted-foreground mb-1">{totalLabel}</p>
            <p className="text-xl font-bold text-foreground">{totalValue}</p>
            <div className="flex items-center gap-1 text-income text-sm mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>{change}%</span>
            </div>
          </div>
        </div>

        {/* Categories list */}
        <div className="flex-1 space-y-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              className="flex items-center gap-3 py-2 hover:bg-accent/30 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <div 
                className="w-1.5 h-8 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div className="flex-1">
                <p className="text-sm text-foreground">{index + 1}. {category.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  ${category.amount.toLocaleString()}
                </p>
                <p className={`text-xs ${category.change > 0 ? 'text-expense' : 'text-income'}`}>
                  {category.change > 0 ? '↑' : '↓'} {Math.abs(category.change)}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
