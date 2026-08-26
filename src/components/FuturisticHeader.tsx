import { useEffect, useMemo, useRef, useState } from "react";
import { Search, HelpCircle, Calendar, X, Check, LogOut, User, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientLoginButton } from "@/components/ClientLoginButton";
import { BrandLockup } from "@/components/brand/BrandLockup";

export interface SearchTarget {
  label: string;
  value: string;
  hint?: string;
}

interface FuturisticHeaderProps {
  title: string;
  subtitle?: string;
  clientName?: string;
  clientLogo?: string;
  /** Sections the header search can jump to. Search is hidden when empty. */
  searchTargets?: SearchTarget[];
  onTabChange?: (tab: string) => void;
  /** Date picker only renders when the page actually consumes the range. */
  dateRanges?: { label: string; value: string }[];
  selectedRangeLabel?: string;
  onDateRangeChange?: (range: string) => void;
  accountEmail?: string;
  onSignOut?: () => void;
}

export const FuturisticHeader = ({
  title,
  subtitle,
  clientName,
  clientLogo,
  searchTargets = [],
  onTabChange,
  dateRanges,
  selectedRangeLabel,
  onDateRangeChange,
  accountEmail,
  onSignOut,
}: FuturisticHeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const searchable = searchTargets.length > 0 && !!onTabChange;

  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return searchTargets.slice(0, 6);
    return searchTargets.filter((t) => t.label.toLowerCase().includes(q)).slice(0, 6);
  }, [searchQuery, searchTargets]);

  // Close every popover on outside click or Escape.
  useEffect(() => {
    const closeAll = () => {
      setShowSearch(false);
      setShowHelp(false);
      setShowProfile(false);
      setShowDateDropdown(false);
    };
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) closeAll();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
      if (searchable && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [searchable]);

  const jumpTo = (target: SearchTarget) => {
    onTabChange?.(target.value);
    setShowSearch(false);
    setSearchQuery("");
  };

  const popover =
    "absolute top-full right-0 mt-2 surface-panel z-[200] p-2 shadow-2xl";

  return (
    <motion.header
      className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex min-w-0 flex-col gap-4">
        <BrandLockup clientLogo={clientLogo} clientName={clientName} size="md" />
        <div className="min-w-0">
          <h1 className="headline-editorial text-[clamp(1.6rem,3.4vw,2rem)] text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-[14px] text-muted-foreground">
              {subtitle}
              {clientName && <span className="ml-1 font-medium text-foreground/85">{clientName}</span>}
            </p>
          )}
        </div>
      </div>

      <div ref={wrapRef} className="flex flex-wrap items-center gap-2 lg:shrink-0">
        {/* Reporting period — only when the page consumes it */}
        {dateRanges && onDateRangeChange && (
          <div className="relative">
            <button
              className="glass-card flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setShowDateDropdown((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={showDateDropdown}
            >
              <span className="text-muted-foreground">Reporting Period</span>
              <span className="flex items-center gap-2 font-medium text-foreground">
                {selectedRangeLabel ?? dateRanges[0].label}
                <Calendar className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
            <AnimatePresence>
              {showDateDropdown && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`${popover} min-w-[190px]`}
                >
                  {dateRanges.map((range) => (
                    <button
                      key={range.value}
                      role="menuitem"
                      onClick={() => {
                        onDateRangeChange(range.value);
                        setShowDateDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedRangeLabel === range.label
                          ? "bg-primary/15 text-primary"
                          : "text-foreground hover:bg-white/[0.05]"
                      }`}
                    >
                      {range.label}
                      {selectedRangeLabel === range.label && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Search — jumps to a workbook section */}
        {searchable && (
          <div className="relative flex items-center">
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 210, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="mr-2 overflow-hidden"
                >
                  <Input
                    placeholder="Jump to section…"
                    aria-label="Search workbook sections"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && results[0]) jumpTo(results[0]);
                    }}
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              aria-label={showSearch ? "Close search" : "Search workbook sections"}
              aria-expanded={showSearch}
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setShowSearch((v) => !v)}
            >
              {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`${popover} w-[280px]`}
                >
                  {results.length === 0 ? (
                    <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                      No section matches “{searchQuery}”.
                    </p>
                  ) : (
                    results.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => jumpTo(t)}
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-white/[0.05]"
                      >
                        <span className="truncate">{t.label}</span>
                        {t.hint && (
                          <span className="shrink-0 text-[11px] text-muted-foreground">{t.hint}</span>
                        )}
                      </button>
                    ))
                  )}
                  <p className="mt-1 flex items-center gap-1.5 border-t border-white/[0.06] px-3 pt-2 text-[10.5px] text-muted-foreground">
                    <CornerDownLeft className="h-3 w-3" aria-hidden="true" /> Enter opens the first
                    result
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Help */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Help and support"
            aria-expanded={showHelp}
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowHelp((v) => !v)}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`${popover} w-[300px] p-4`}
              >
                <h4 className="text-[13px] font-medium text-foreground">Working in the workbook</h4>
                <ul className="mt-2.5 space-y-2 text-[12.5px] leading-relaxed text-muted-foreground">
                  <li>Each tab is a reconciled period. Figures come straight from bank statements.</li>
                  <li>Use Export to Excel or PowerPoint for a shareable, branded copy.</li>
                  <li>The assistant in the bottom-right answers questions about these numbers.</li>
                </ul>
                <a
                  href="mailto:support@mizanusa.com"
                  className="mt-3 inline-block text-[12.5px] text-primary hover:underline"
                >
                  Email support@mizanusa.com
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ClientLoginButton className="ml-1" />

        {onSignOut && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
            className="ml-1 hidden gap-2 hover:border-destructive/50 hover:text-destructive sm:inline-flex"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </Button>
        )}

        {/* Account menu */}
        <div className="relative">
          <button
            className="ml-1 flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => setShowProfile((v) => !v)}
            aria-label="Account menu"
            aria-haspopup="menu"
            aria-expanded={showProfile}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-[13px] font-medium text-primary transition-colors hover:bg-primary/25">
              MZ
            </span>
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`${popover} w-[240px]`}
              >
                <div className="flex items-start gap-2.5 px-3 py-2.5">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-foreground">Mizan · Accountant</p>
                    <p className="truncate text-[11.5px] text-muted-foreground">
                      {accountEmail ?? "Signed in"}
                    </p>
                  </div>
                </div>
                <div className="my-1 h-px bg-white/[0.06]" />
                {onSignOut && (
                  <button
                    role="menuitem"
                    onClick={onSignOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-expense/10 hover:text-expense"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};
