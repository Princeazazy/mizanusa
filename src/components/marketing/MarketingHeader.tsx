import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import mizanMark from "@/assets/mizan-mark.png";
import { LoginLink } from "@/components/auth/LoginNav";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
];

/**
 * Public site header. Sticky, hairline-bordered, becomes an opaque glass bar
 * once the page scrolls so the editorial hero can sit flush beneath it.
 */
export const MarketingHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/[0.07] bg-[hsl(232_24%_5%_/_0.82)] backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-[74px] max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-baseline gap-3.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          aria-label="Mizan — home"
        >
          <img src={mizanMark} alt="" className="h-11 w-auto shrink-0 self-center object-contain" />
          <span className="flex flex-col leading-none">
            <span className="text-[17px] font-medium tracking-[-0.01em] text-foreground">Mizan</span>
            <span className="mt-1.5 text-[11px] uppercase tracking-[0.24em] text-muted-foreground/80">
              Bookkeeping
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3.5 py-2 text-[13.5px] tracking-[0.01em] transition-colors duration-150",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/90",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LoginLink
            role="bookkeeper"
            className="rounded-lg px-3 py-2 text-[12.5px] text-muted-foreground/75 transition-colors duration-150 hover:text-foreground"
          >
            Bookkeeper login
          </LoginLink>
          <LoginLink
            role="client"
            className="rounded-lg px-3.5 py-2 text-[13.5px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            Client login
          </LoginLink>
          <Link
            to="/quote"
            className="btn-glow inline-flex items-center rounded-xl bg-primary px-4 py-2.5 text-[13.5px] font-medium text-primary-foreground transition-transform duration-150 hover:-translate-y-px"
          >
            Get a quote
          </Link>
        </div>


        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] text-foreground/80 md:hidden"
        >
          {open ? <X className="h-4.5 w-4.5 h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.07] bg-[hsl(232_24%_5%_/_0.97)] px-5 pb-6 pt-2 backdrop-blur-xl md:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "border-b border-white/[0.05] py-3.5 text-[15px]",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <LoginLink role="client" className="border-b border-white/[0.05] py-3.5 text-left text-[15px] text-muted-foreground">
              Client login
            </LoginLink>
            <LoginLink role="bookkeeper" className="border-b border-white/[0.05] py-3.5 text-left text-[15px] text-muted-foreground/80">
              Bookkeeper login
            </LoginLink>

          </nav>
          <Link
            to="/quote"
            className="mt-5 block rounded-xl bg-primary px-4 py-3 text-center text-[14px] font-medium text-primary-foreground"
          >
            Get a quote
          </Link>
        </div>
      )}
    </header>
  );
};

export default MarketingHeader;
