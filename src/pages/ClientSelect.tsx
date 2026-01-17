import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import mizanLogo from "@/assets/mizan-logo.png";

const ClientSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="dark min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-info/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-info/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-border/60 bg-card/30 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={mizanLogo} alt="Mizan" className="h-10 w-auto logo-glow" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Mizan</h1>
              <p className="text-xs text-muted-foreground">Professional Financial Services</p>
            </div>
          </div>
          <Button onClick={() => navigate("/auth")} className="gap-2">
            <LogIn className="h-4 w-4" />
            Accountant Login
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12 relative z-10 flex items-center justify-center">
        <div className="max-w-2xl text-center">
          {/* Hero Logo */}
          <div className="mb-8">
            <img
              src={mizanLogo}
              alt="Mizan"
              className="h-48 w-48 object-contain mx-auto logo-glow"
              loading="eager"
            />
          </div>

          <h2 className="text-4xl font-bold text-foreground mb-4">Welcome to Mizan</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Professional bookkeeping and financial management services for your business
          </p>

          <Button size="lg" onClick={() => navigate("/auth")} className="gap-2 px-8 py-6 text-lg">
            <LogIn className="h-5 w-5" />
            Sign In to Access Your Account
          </Button>

          <p className="text-muted-foreground text-sm mt-6">
            Authorized personnel only. Please sign in to continue.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/30 py-4 relative z-10">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2025 Mizan. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ClientSelect;
