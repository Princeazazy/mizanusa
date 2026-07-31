import { Link } from "react-router-dom";
import { LoginLink } from "@/components/auth/LoginNav";

interface SiteFooterProps {
  className?: string;
}

const LINKS = [
  { to: "/", label: "Mizan.com" },
  { to: "/services", label: "Services" },
  { to: "/quote", label: "Refer a business" },
];

const linkClass =
  "text-xs tracking-[0.02em] text-muted-foreground transition-colors duration-150 hover:text-primary";

export const SiteFooter = ({ className = "" }: SiteFooterProps) => (
  <footer className={`border-t border-white/[0.06] ${className}`}>
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-8 py-7 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-baseline gap-3">
        <span className="text-[13px] font-medium tracking-[0.02em] text-foreground/80">Mizan</span>
        <span className="text-xs text-muted-foreground/70">Financial reporting &amp; reconciliation</span>
      </div>
      <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} className={linkClass}>
            {l.label}
          </Link>
        ))}
        <LoginLink role="client" className={linkClass}>
          Client login
        </LoginLink>
        <LoginLink role="bookkeeper" className={linkClass}>
          Bookkeeper login
        </LoginLink>
        <span className="text-xs text-muted-foreground/60">© {new Date().getFullYear()} Mizan</span>
      </nav>
    </div>
  </footer>
);
