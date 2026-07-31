import { ReactNode } from "react";
import { Link } from "react-router-dom";
import mizanMark from "@/assets/mizan-mark.png";
import { MarketingHeader } from "./MarketingHeader";
import { LoginLink, LoginRole } from "@/components/auth/LoginNav";

const COLUMNS: { heading: string; links: { to?: string; role?: LoginRole; label: string }[] }[] = [
  {
    heading: "Firm",
    links: [
      { to: "/", label: "Home" },
      { to: "/services", label: "Services" },
      { to: "/about", label: "About" },
    ],
  },
  {
    heading: "Engage",
    links: [
      { to: "/quote", label: "Request a quote" },
      { role: "client", label: "Client login" },
      { role: "bookkeeper", label: "Bookkeeper login" },
    ],
  },

];

export const MarketingFooter = () => (
  <footer className="mt-28 border-t border-white/[0.06]">
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-[34ch]">
          <div className="flex items-center gap-3">
            <img src={mizanMark} alt="" className="h-9 w-auto object-contain" />
            <span className="text-[15px] font-medium tracking-[-0.01em] text-foreground">Mizan</span>
          </div>
          <p className="mt-4 text-[13.5px] leading-relaxed text-muted-foreground">
            Accountant-grade bookkeeping, reconciliation and financial reporting for small
            businesses. Every engagement ties to source documents — no estimates, no plugs.
          </p>
          <p className="mt-5 text-[12px] leading-relaxed text-muted-foreground/70">
            Philadelphia, Pennsylvania · Serving clients nationwide
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <span className="eyebrow-label">{col.heading}</span>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={(l.to ?? l.role) + l.label}>
                  {l.role ? (
                    <LoginLink
                      role={l.role}
                      className="text-left text-[13.5px] text-muted-foreground transition-colors duration-150 hover:text-primary"
                    >
                      {l.label}
                    </LoginLink>
                  ) : (
                    <Link
                      to={l.to!}
                      className="text-[13.5px] text-muted-foreground transition-colors duration-150 hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="rule-hairline mt-12" />
      <div className="mt-5 flex flex-col gap-2 text-[11.5px] text-muted-foreground/65 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Mizan. All rights reserved.</span>
        <span>
          Bookkeeping and financial reporting services. Not an audit, review or attestation
          engagement.
        </span>
      </div>
    </div>
  </footer>
);

/** Shared chrome for every public marketing route. */
export const MarketingShell = ({ children }: { children: ReactNode }) => (
  <div className="relative min-h-screen overflow-x-hidden futuristic-bg">
    <div className="light-beam light-beam-left opacity-40" />
    <div className="light-beam light-beam-right opacity-40" />
    <div className="relative">
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  </div>
);

export default MarketingShell;
