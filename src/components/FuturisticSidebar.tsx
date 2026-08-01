import { Home, LayoutGrid, List, FileText, Upload, Link2, Settings, LogOut, BrainCircuit } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import mizanMark from "@/assets/mizan-mark.png";

interface NavItem {
  icon: React.ElementType;
  label: string;
  description: string;
  path?: string;
  /** Workbook tab to activate on the current page. */
  tab?: string;
  /** Honest disabled state — the feature genuinely does not exist yet. */
  unbuilt?: boolean;
}

interface FuturisticSidebarProps {
  onSignOut?: () => void;
  onTabChange?: (tab: string) => void;
}

export const FuturisticSidebar = ({ onSignOut, onTabChange }: FuturisticSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const onWorkbook = location.pathname === "/cvs" || location.pathname === "/defiore";

  const navItems: NavItem[] = [
    { icon: Home, label: "Clients", description: "Return to the client roster", path: "/clients" },
    ...(onWorkbook && onTabChange
      ? [
          { icon: LayoutGrid, label: "Overview", description: "Financial dashboard overview", tab: "dashboard" },
          { icon: List, label: "Transactions", description: "Reconciled bank transactions", tab: location.pathname === "/defiore" ? "january" : "october" },
          { icon: FileText, label: "Reports", description: "P&L, balance sheet and cash flow", tab: location.pathname === "/defiore" ? "pnl" : "profitloss" },
        ]
      : []),
    { icon: Upload, label: "Documents", description: "Statement upload & document vault", unbuilt: true },
    { icon: Link2, label: "Connections", description: "Direct bank feed connections", unbuilt: true },
  ];

  const bottomItems: NavItem[] = [
    { icon: Settings, label: "Settings", description: "Workspace preferences", unbuilt: true },
  ];

  const NavButton = ({ item, index }: { item: NavItem; index: number }) => {
    const isActive = !!item.path && location.pathname === item.path;

    return (
      <Tooltip delayDuration={120}>
        <TooltipTrigger asChild>
          <motion.button
            type="button"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            disabled={item.unbuilt}
            aria-disabled={item.unbuilt}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            onClick={() => {
              if (item.unbuilt) return;
              if (item.path) navigate(item.path);
              else if (item.tab) onTabChange?.(item.tab);
            }}
            className={cn(
              "sidebar-nav-item focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive && "active",
              item.unbuilt && "cursor-not-allowed opacity-35",
            )}
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[220px]">
          <p className="font-medium">{item.label}</p>
          <p className="mt-0.5 text-muted-foreground">
            {item.unbuilt ? `${item.description} — coming soon.` : item.description}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <nav
      aria-label="Primary"
      className="sidebar-futuristic fixed left-0 top-0 z-40 flex min-h-screen w-16 flex-col items-center py-5"
    >
      <button
        type="button"
        onClick={() => navigate("/clients")}
        aria-label="Mizan — go to client roster"
        className="mb-6 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <img src={mizanMark} alt="Mizan" className="h-8 w-auto object-contain" />
      </button>

      <div className="flex flex-col items-center gap-1">
        {navItems.map((item, i) => (
          <NavButton key={item.label} item={item} index={i} />
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-1">
        {bottomItems.map((item, i) => (
          <NavButton key={item.label} item={item} index={navItems.length + i} />
        ))}

        {onSignOut && (
          <Tooltip delayDuration={120}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onSignOut}
                aria-label="Sign out"
                className="sidebar-nav-item text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign out</TooltipContent>
          </Tooltip>
        )}
      </div>
    </nav>
  );
};
