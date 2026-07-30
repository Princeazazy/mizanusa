import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Page not found · Mizan";
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col futuristic-bg">
      <header className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-6 sm:px-8">
        <BrandLockup size="md" onLogoClick={() => navigate("/")} />
      </header>

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 items-center px-6 sm:px-8">
        <div className="max-w-xl py-16">
          <span className="eyebrow-label">Error 404</span>
          <h1 className="headline-editorial mt-4 text-[clamp(2.25rem,6vw,3.5rem)] text-foreground">
            This page isn’t part of the workbook.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            We couldn’t find anything at{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[13px] text-foreground/80">
              {location.pathname}
            </code>
            . It may have been renamed, or you may not have access to it with your current sign-in.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Go back
            </Button>
            <Button asChild className="gap-2">
              <Link to="/">
                <Compass className="h-4 w-4" aria-hidden="true" />
                Return to sign in
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default NotFound;
