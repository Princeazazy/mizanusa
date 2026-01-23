import { Home, LayoutGrid, List, FileText, Upload, Link2, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import mizanLogo from "@/assets/mizan-logo-transparent.png";

interface NavItem {
  icon: React.ElementType;
  label: string;
  description: string;
  path?: string;
  action?: string;
}

interface FuturisticSidebarProps {
  onSignOut?: () => void;
  onTabChange?: (tab: string) => void;
}

export const FuturisticSidebar = ({ onSignOut, onTabChange }: FuturisticSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const topNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", description: "Return to client selection dashboard", path: "/clients" },
  ];

  const middleNavItems: NavItem[] = [
    { icon: LayoutGrid, label: "Overview", description: "View financial dashboard overview", path: "/cvs", action: "dashboard" },
    { icon: List, label: "Transactions", description: "View all bank transactions for Q4 2025", action: "october" },
    { icon: FileText, label: "Reports", description: "Access P&L, Balance Sheet, and Cash Flow reports", action: "profitloss" },
    { icon: Upload, label: "Documents", description: "Upload and manage financial documents", action: "documents" },
    { icon: Link2, label: "Connections", description: "Manage bank account connections", action: "connections" },
  ];

  const bottomNavItems: NavItem[] = [
    { icon: Settings, label: "Settings", description: "Configure application settings", action: "settings" },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.path) {
      navigate(item.path);
      return;
    }

    // Handle actions that change tabs
    if (item.action && onTabChange) {
      if (["dashboard", "october", "november", "december", "transfers", "esafety", "titlerevenue", "vitu", "coa", "reconciliation", "profitloss", "balancesheet", "cashflow"].includes(item.action)) {
        onTabChange(item.action);
        toast({
          title: item.label,
          description: item.description,
        });
        return;
      }
    }

    // Handle other actions with toast
    switch (item.action) {
      case "documents":
        toast({
          title: "Documents",
          description: "Document upload feature coming soon. Use the workbook tabs to view financial data.",
        });
        break;
      case "connections":
        toast({
          title: "Connections",
          description: "Bank connection management coming soon. Current data is synced with Chase Bank.",
        });
        break;
      case "settings":
        toast({
          title: "Settings",
          description: "Settings panel coming soon. Configure preferences and account options here.",
        });
        break;
      default:
        toast({
          title: item.label,
          description: item.description,
        });
    }
  };

  const NavButton = ({ item, index }: { item: NavItem; index: number }) => {
    const isActive = item.path && location.pathname === item.path;
    const isActionActive = item.action === "dashboard" && location.pathname === "/cvs";
    
    return (
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => handleNavClick(item)}
        className={cn(
          "sidebar-nav-item group relative",
          (isActive || isActionActive) && "active"
        )}
        title={item.label}
      >
        <item.icon className="h-5 w-5" />
        
        {/* Tooltip */}
        <div className="absolute left-full ml-3 px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
          <p className="font-semibold">{item.label}</p>
          <p className="text-muted-foreground font-normal mt-0.5 max-w-[200px]">{item.description}</p>
        </div>
      </motion.button>
    );
  };

  return (
    <div className="sidebar-futuristic w-16 min-h-screen flex flex-col items-center py-4 fixed left-0 top-0 z-40">
      {/* Logo */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <img
          src={mizanLogo}
          alt="Mizan"
          className="h-10 w-10 object-contain mix-blend-lighten logo-glow-pulse cursor-pointer"
          onClick={() => navigate("/clients")}
          title="Return to Dashboard"
        />
      </motion.div>

      {/* Collapse/Expand indicator */}
      <motion.button 
        className="sidebar-nav-item mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        onClick={() => toast({
          title: "Sidebar",
          description: "Sidebar expansion feature coming soon.",
        })}
        title="Expand Sidebar"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Top nav items */}
      <div className="flex flex-col items-center gap-1">
        {topNavItems.map((item, index) => (
          <NavButton key={item.label} item={item} index={index} />
        ))}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-border/50 my-4" />

      {/* Middle nav items */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {middleNavItems.map((item, index) => (
          <NavButton key={item.label} item={item} index={index + topNavItems.length} />
        ))}
      </div>

      {/* Bottom nav items */}
      <div className="flex flex-col items-center gap-1 mt-auto">
        {bottomNavItems.map((item, index) => (
          <NavButton key={item.label} item={item} index={index + topNavItems.length + middleNavItems.length} />
        ))}
        
        {/* Sign out button */}
        {onSignOut && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onSignOut}
            className="sidebar-nav-item text-muted-foreground hover:text-destructive group relative"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
            <div className="absolute left-full ml-3 px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
              <p className="font-semibold">Sign Out</p>
              <p className="text-muted-foreground font-normal mt-0.5">Log out of your account</p>
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
};
