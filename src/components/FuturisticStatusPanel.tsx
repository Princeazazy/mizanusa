import { motion } from "framer-motion";
import { Clock, FileText, AlertTriangle, Upload, ArrowRight } from "lucide-react";

interface StatusItem {
  label: string;
  status: "on-track" | "optimal" | "tasks" | "review";
  statusLabel: string;
  taskCount?: number;
}

interface Task {
  id: string;
  title: string;
  count?: number;
  dueDate: string;
  dueDays: string;
  type: "review" | "documents" | "signature" | "upload";
  description?: string;
}

interface FuturisticStatusPanelProps {
  statusItems: StatusItem[];
  tasks: Task[];
}

export const FuturisticStatusPanel = ({
  statusItems,
  tasks,
}: FuturisticStatusPanelProps) => {
  const getStatusBadgeClass = (status: StatusItem["status"]) => {
    switch (status) {
      case "on-track":
        return "badge-on-track";
      case "optimal":
        return "badge-optimal";
      case "tasks":
        return "badge-tasks";
      case "review":
        return "badge-review";
      default:
        return "badge-on-track";
    }
  };

  const getTaskIcon = (type: Task["type"]) => {
    switch (type) {
      case "review":
        return <FileText className="h-4 w-4" />;
      case "documents":
        return <FileText className="h-4 w-4" />;
      case "signature":
        return <AlertTriangle className="h-4 w-4" />;
      case "upload":
        return <Upload className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTaskColor = (type: Task["type"]) => {
    switch (type) {
      case "review":
        return "text-primary";
      case "documents":
        return "text-warning";
      case "signature":
        return "text-expense";
      case "upload":
        return "text-info";
      default:
        return "text-primary";
    }
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Status section */}
      <h3 className="section-header">Status</h3>
      <div className="space-y-3 mb-6">
        {statusItems.map((item, index) => (
          <motion.div
            key={item.label}
            className="flex items-center"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <span className="text-sm text-muted-foreground">— {item.label}</span>
            <div className="dotted-connector" />
            <span className={`badge-status ${getStatusBadgeClass(item.status)}`}>
              {item.taskCount ? `${item.taskCount} ${item.statusLabel}` : item.statusLabel}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Tasks section */}
      <h3 className="section-header">Tasks</h3>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            className="p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
          >
            <div className="flex items-start gap-3">
              <div className={`${getTaskColor(task.type)} mt-0.5`}>
                {getTaskIcon(task.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getTaskColor(task.type)}`}>
                    {task.title}
                  </span>
                  {task.count && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${getTaskColor(task.type)} bg-current/10`}>
                      {task.count}
                    </span>
                  )}
                </div>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{task.dueDate}</span>
                  <span>/</span>
                  <span className={getTaskColor(task.type)}>Due in {task.dueDays}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
