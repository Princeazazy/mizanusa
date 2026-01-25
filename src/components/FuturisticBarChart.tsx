import { motion } from "framer-motion";

interface BarData {
  value: number;
  label?: string;
}

interface FuturisticBarChartProps {
  title: string;
  data: BarData[];
  height?: number;
}

const barColors = [
  "bar-gradient-1",
  "bar-gradient-2", 
  "bar-gradient-3",
  "bar-gradient-4",
  "bar-gradient-5",
  "bar-gradient-6",
  "bar-gradient-7",
  "bar-gradient-8",
];

export const FuturisticBarChart = ({
  title,
  data,
  height = 160,
}: FuturisticBarChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const yAxisLabels = [
    `$${Math.round(maxValue / 1000)}K`,
    `$${Math.round((maxValue * 0.75) / 1000)}K`,
    `$${Math.round((maxValue * 0.5) / 1000)}K`,
    `$${Math.round((maxValue * 0.25) / 1000)}K`,
  ];

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-base font-semibold text-foreground mb-6">{title}</h3>

      <div className="flex gap-4">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-xs text-muted-foreground pr-2" style={{ height }}>
          {yAxisLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end gap-2" style={{ height }}>
          {data.map((bar, index) => {
            const barHeight = (bar.value / maxValue) * 100;
            return (
              <motion.div
                key={index}
                className="flex-1 flex flex-col items-center gap-2"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                style={{ transformOrigin: "bottom" }}
              >
                <div
                  className={`w-full rounded-t-md bar-glow ${barColors[index % barColors.length]}`}
                  style={{ 
                    height: `${barHeight}%`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
