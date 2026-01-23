import { Home, LayoutGrid, List, FileText, Upload, Link2, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import mizanLogo from "@/assets/mizan-logo-transparent.png";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  onClick?: () => void;
}

interface FuturisticSidebarProps {
  onSignOut?: () => void;
}

export const FuturisticSidebar = ({ onSignOut }: FuturisticSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const topNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", path: "/clients" },
  ];

  const middleNavItems: NavItem[] = [
    { icon: LayoutGrid, label: "Overview", path: "/cvs" },
    { icon: List, label: "Transactions" },
    { icon: FileText, label: "Reports" },
    { icon: Upload, label: "Documents" },
    { icon: Link2, label: "Connections" },
  ];

  const bottomNavItems: NavItem[] = [
    { icon: Settings, label: "Settings" },
  ];

  const NavButton = ({ item, index }: { item: NavItem; index: number }) => {
    const isActive = item.path && location.pathname === item.path;
    
    return (
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => item.path ? navigate(item.path) : item.onClick?.()}
        className={cn(
          "sidebar-nav-item group relative",
          isActive && "active"
        )}
        title={item.label}
      >
        <item.icon className="h-5 w-5" />
        
        {/* Tooltip */}
        <div className="absolute left-full ml-3 px-2 py-1 bg-card border border-border rounded-md text-xs font-medium text-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
          {item.label}
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
        />
      </motion.div>

      {/* Top divider arrow */}
      <motion.div 
        className="sidebar-nav-item mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.div>

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
            className="sidebar-nav-item text-muted-foreground hover:text-destructive"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
