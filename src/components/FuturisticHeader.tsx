import { Search, Bell, HelpCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FuturisticHeaderProps {
  title: string;
  subtitle?: string;
  clientName?: string;
  showDatePicker?: boolean;
}

export const FuturisticHeader = ({ 
  title, 
  subtitle, 
  clientName,
  showDatePicker = true 
}: FuturisticHeaderProps) => {
  return (
    <motion.header 
      className="flex items-center justify-between mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1">
            {subtitle}
            {clientName && (
              <>
                {" "}
                <span className="text-primary font-medium cursor-pointer hover:underline">
                  {clientName}
                </span>
              </>
            )}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showDatePicker && (
          <div className="glass-card px-4 py-2 flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Reporting Period</span>
            <button className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors">
              Last 90 Days
              <Calendar className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-3 ml-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-medium">
            MZ
          </div>
        </div>
      </div>
    </motion.header>
  );
};
