import { motion } from "framer-motion";

interface CashFlowData {
  incoming: number[];
  outgoing: number[];
  netBalance: number[];
}

interface FuturisticCashFlowChartProps {
  data: CashFlowData;
  netCashFlow: string;
  netCashFlowChange: number;
  currentBalance: string;
  currentBalanceChange: number;
  freeCashFlow: string;
  freeCashFlowChange: number;
  runway: string;
  runwayChange: number;
}

export const FuturisticCashFlowChart = ({
  data,
  netCashFlow,
  netCashFlowChange,
  currentBalance,
  currentBalanceChange,
  freeCashFlow,
  freeCashFlowChange,
  runway,
  runwayChange,
}: FuturisticCashFlowChartProps) => {
  const maxVal = Math.max(...data.incoming, ...data.outgoing);

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="section-header">Cash Flow</h3>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full cf-dot-incoming" />
          <span className="text-xs text-muted-foreground">Incoming</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full cf-dot-outgoing" />
          <span className="text-xs text-muted-foreground">Outgoing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full cf-dot-net" />
          <span className="text-xs text-muted-foreground">Net Balance</span>
        </div>
      </div>

      {/* Chart area */}
      <div className="relative h-32 mb-6">
        {/* Bars */}
        <div className="flex items-end justify-between h-full gap-1">
          {data.incoming.map((incoming, index) => {
            const incomingHeight = (incoming / maxVal) * 100;
            const outgoingHeight = (data.outgoing[index] / maxVal) * 100;
            
            return (
              <div key={index} className="flex-1 flex gap-[2px] items-end h-full">
                <motion.div
                  className="flex-1 cf-bar-incoming rounded-t-sm"
                  style={{ height: `${incomingHeight}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.02, duration: 0.3 }}
                />
                <motion.div
                  className="flex-1 cf-bar-outgoing rounded-t-sm"
                  style={{ height: `${outgoingHeight}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.02 + 0.1, duration: 0.3 }}
                />
              </div>
            );
          })}
        </div>

        {/* Net balance line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <polyline
            fill="none"
            stroke="hsl(var(--chart-net))"
            strokeWidth="2"
            points={data.netBalance
              .map((val, i) => {
                const x = (i / (data.netBalance.length - 1)) * 100;
                const y = 100 - (val / maxVal) * 100;
                return `${x}%,${y}%`;
              })
              .join(" ")}
          />
          {data.netBalance.map((val, i) => {
            const x = (i / (data.netBalance.length - 1)) * 100;
            const y = 100 - (val / maxVal) * 100;
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill="hsl(var(--chart-net))"
              />
            );
          })}
        </svg>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Net Cash Flow</p>
          <p className="text-xl font-bold text-foreground">{netCashFlow}</p>
          <p className={`text-xs ${netCashFlowChange > 0 ? 'text-income' : 'text-expense'}`}>
            {netCashFlowChange > 0 ? '↑' : '↓'} {Math.abs(netCashFlowChange)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current Cash Balance</p>
          <p className="text-xl font-bold text-foreground">{currentBalance}</p>
          <p className={`text-xs ${currentBalanceChange > 0 ? 'text-expense' : 'text-income'}`}>
            {currentBalanceChange > 0 ? '↓' : '↑'} {Math.abs(currentBalanceChange)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Free Cash Flow</p>
          <p className="text-xl font-bold text-foreground">{freeCashFlow}</p>
          <p className={`text-xs ${freeCashFlowChange > 0 ? 'text-expense' : 'text-income'}`}>
            {freeCashFlowChange > 0 ? '↓' : '↑'} {Math.abs(freeCashFlowChange)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Runway (Months)</p>
          <p className="text-xl font-bold text-foreground">{runway}</p>
          <p className={`text-xs ${runwayChange > 0 ? 'text-income' : 'text-expense'}`}>
            {runwayChange > 0 ? '↑' : '↓'} {Math.abs(runwayChange)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
};
