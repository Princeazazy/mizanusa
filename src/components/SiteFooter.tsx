import { Link } from "react-router-dom";

interface SiteFooterProps {
  className?: string;
}

export const SiteFooter = ({ className = "" }: SiteFooterProps) => (
  <footer className={`border-t border-white/[0.06] ${className}`}>
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-8 py-7 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-baseline gap-3">
        <span className="text-[13px] font-medium tracking-[0.02em] text-foreground/80">Mizan</span>
        <span className="text-xs text-muted-foreground/70">Financial reporting &amp; reconciliation</span>
      </div>
      <div className="flex items-center gap-6">
        <Link
          to="/auth?role=client"
          className="text-xs tracking-[0.02em] text-muted-foreground transition-colors duration-150 hover:text-primary"
        >
          Client Portal
        </Link>
        <span className="text-xs text-muted-foreground/60">© {new Date().getFullYear()} Mizan</span>
      </div>
    </div>
  </footer>
);
