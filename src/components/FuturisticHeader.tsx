import { useState } from "react";
import { Search, Bell, HelpCircle, Calendar, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface FuturisticHeaderProps {
  title: string;
  subtitle?: string;
  clientName?: string;
  clientLogo?: string;
  showDatePicker?: boolean;
  onDateRangeChange?: (range: string) => void;
}

const dateRanges = [
  { label: "Last 30 Days", value: "30" },
  { label: "Last 60 Days", value: "60" },
  { label: "Last 90 Days", value: "90" },
  { label: "Q4 2025", value: "q4" },
  { label: "Year to Date", value: "ytd" },
];

const notifications = [
  { id: 1, title: "Reconciliation Complete", message: "October 2025 bank statement has been reconciled", time: "2 hours ago", read: false },
  { id: 2, title: "Document Uploaded", message: "Chase Bank statement for December uploaded", time: "1 day ago", read: false },
  { id: 3, title: "Report Generated", message: "Q4 P&L statement is ready for review", time: "2 days ago", read: true },
];

export const FuturisticHeader = ({ 
  title, 
  subtitle, 
  clientName,
  clientLogo,
  showDatePicker = true,
  onDateRangeChange 
}: FuturisticHeaderProps) => {
  const { toast } = useToast();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Last 90 Days");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (showSearch && searchQuery) {
      toast({
        title: "Search",
        description: `Searching for "${searchQuery}" across all financial data...`,
      });
      setSearchQuery("");
    }
    setShowSearch(!showSearch);
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    toast({
      title: notification.title,
      description: notification.message,
    });
    setShowNotifications(false);
  };

  const handleHelpClick = () => {
    toast({
      title: "Help & Support",
      description: "Access documentation, tutorials, and contact support for assistance.",
    });
  };

  const handleDateRangeSelect = (range: typeof dateRanges[0]) => {
    setSelectedRange(range.label);
    setShowDateDropdown(false);
    onDateRangeChange?.(range.value);
    toast({
      title: "Date Range Updated",
      description: `Now showing data for ${range.label}`,
    });
  };

  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "View and edit your account profile settings.",
    });
  };

  return (
    <motion.header 
      className="flex items-center justify-between mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col">
        {clientLogo && (
          <div className="flex items-center justify-center gap-4 mb-3">
            <img src={mizanLogo} alt="Mizan" className="h-14 w-auto object-contain" />
            <span className="text-muted-foreground text-xl font-light">×</span>
            <img src={clientLogo} alt={clientName || "Client"} className="h-14 w-auto object-contain" />
          </div>
        )}
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
                  <span 
                    className="text-primary font-medium cursor-pointer hover:underline"
                    onClick={() => toast({
                      title: clientName,
                      description: "View detailed client information and settings.",
                    })}
                  >
                    {clientName}
                  </span>
                </>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Picker */}
        {showDatePicker && (
          <div className="relative">
            <button 
              className="glass-card px-4 py-2 flex items-center gap-3 text-sm hover:border-primary/30 transition-colors"
              onClick={() => setShowDateDropdown(!showDateDropdown)}
            >
              <span className="text-muted-foreground">Reporting Period</span>
              <span className="flex items-center gap-2 text-foreground font-medium">
                {selectedRange}
                <Calendar className="h-4 w-4" />
              </span>
            </button>
            
            <AnimatePresence>
              {showDateDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 glass-card p-2 min-w-[180px] z-50"
                >
                  {dateRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => handleDateRangeSelect(range)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${
                        selectedRange === range.label 
                          ? "bg-primary/20 text-primary" 
                          : "hover:bg-accent/50 text-foreground"
                      }`}
                    >
                      {range.label}
                      {selectedRange === range.label && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center">
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden mr-2"
              >
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-input border-border/50 h-9"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            onClick={handleSearch}
          >
            {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 glass-card p-3 w-[320px] z-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  <button 
                    className="text-xs text-primary hover:underline"
                    onClick={() => {
                      toast({ title: "Notifications", description: "All notifications marked as read." });
                      setShowNotifications(false);
                    }}
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        notif.read ? "bg-accent/30" : "bg-primary/10"
                      } hover:bg-accent/50`}
                    >
                      <div className="flex items-start gap-2">
                        {!notif.read && <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />}
                        <div className={notif.read ? "ml-4" : ""}>
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Help */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground"
          onClick={handleHelpClick}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* User avatar */}
        <button 
          className="flex items-center gap-3 ml-2"
          onClick={handleProfileClick}
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-medium hover:bg-primary/30 transition-colors">
            MZ
          </div>
        </button>
      </div>
    </motion.header>
  );
};
