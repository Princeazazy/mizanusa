import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useClientAuth } from "@/hooks/useClientAuth";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { MizanBalance3D } from "@/components/brand/MizanBalance3D";

const Auth = () => {
  // Accountant login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Client login state
  const [clientUsername, setClientUsername] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const [showClientPassword, setShowClientPassword] = useState(false);
  const [clientLoading, setClientLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"accountant" | "client">(
    searchParams.get("role") === "client" ? "client" : "accountant"
  );

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: clientLogin, isAuthenticated: isClientAuthenticated, loading: clientAuthLoading } = useClientAuth();

  useEffect(() => {
    if (searchParams.get("role") === "client") setActiveTab("client");
  }, [searchParams]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/clients");
        }
        setCheckingAuth(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/clients");
      }
      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Redirect if client is already authenticated
  useEffect(() => {
    if (!clientAuthLoading && isClientAuthenticated) {
      navigate("/client-portal");
    }
  }, [isClientAuthenticated, clientAuthLoading, navigate]);

  const handleAccountantLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message === "Invalid login credentials"
          ? "Invalid email or password. Please try again."
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account.",
      });
    }

    setLoading(false);
  };

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientUsername || !clientPassword) {
      toast({
        title: "Missing credentials",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }

    setClientLoading(true);

    const result = await clientLogin(clientUsername, clientPassword);

    if (!result.success) {
      toast({
        title: "Login failed",
        description: result.error || "Invalid username or password.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome!",
        description: "Successfully logged in to your client portal.",
      });
      navigate("/client-portal");
    }

    setClientLoading(false);
  };

  if (checkingAuth || clientAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center futuristic-bg">
        <p className="eyebrow-label animate-pulse">Mizan</p>
      </div>
    );
  }

  const isClient = activeTab === "client";

  return (
    <div className="min-h-screen futuristic-bg lg:grid lg:grid-cols-[1.15fr_0.85fr]">
      {/* ---------------- Brand column ---------------- */}
      <section className="relative hidden overflow-hidden border-r border-white/[0.06] lg:flex lg:flex-col lg:justify-between">
        <div className="light-beam light-beam-left" />

        <div className="relative z-10 px-14 pt-14">
          <span className="text-[15px] font-medium tracking-[-0.01em] text-foreground">Mizan</span>
        </div>

        {/* 3D balance — the brand object */}
        <MizanBalance3D className="pointer-events-none absolute inset-x-0 top-[6%] h-[62%] w-full" />

        <div className="relative z-10 px-14 pb-16">
          <span className="eyebrow-label">ميزان — Balance</span>
          <h1 className="headline-editorial mt-5 max-w-[15ch] text-[42px] text-foreground">
            Books that hold
            <br />
            their balance.
          </h1>
          <p className="mt-6 max-w-[42ch] text-[14.5px] leading-relaxed text-muted-foreground">
            Reconciliation, statements and reporting for owner-operated businesses — prepared to
            accounting standards, delivered without the noise.
          </p>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/[0.06]">
            {[
              { k: "Statements", v: "3" },
              { k: "Tie-out", v: "100%" },
              { k: "Turnaround", v: "48h" },
            ].map((s) => (
              <div key={s.k} className="bg-background/70 px-5 py-4">
                <div className="stat-display text-[22px] leading-none">{s.v}</div>
                <div className="eyebrow-label mt-2">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Form column ---------------- */}
      <section className="flex min-h-screen flex-col justify-center px-6 py-14 sm:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-[380px]"
        >
          <div className="lg:hidden">
            <span className="text-[15px] font-medium tracking-[-0.01em] text-foreground">Mizan</span>
          </div>

          <span className="eyebrow-label mt-10 lg:mt-0">
            {isClient ? "Client Portal" : "Practice Access"}
          </span>
          <h2 className="headline-editorial mt-3 text-[30px] text-foreground">
            {isClient ? "View your books" : "Sign in"}
          </h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
            {isClient
              ? "Enter the credentials your accountant issued to open your statements."
              : "Restricted to authorised practice staff."}
          </p>

          {/* Role switch — a quiet segmented control, not a tab bar */}
          <div className="mt-8 inline-flex rounded-full border border-white/[0.07] bg-white/[0.025] p-1">
            {(["accountant", "client"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveTab(role)}
                className={`rounded-full px-4 py-1.5 text-[12px] font-medium capitalize transition-all duration-200 ${
                  activeTab === role
                    ? "bg-white/[0.08] text-foreground shadow-[0_1px_2px_hsl(232_40%_2%/0.5)]"
                    : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {!isClient ? (
            <form onSubmit={handleAccountantLogin} className="mt-8 space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="login-email" className="eyebrow-label">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@practice.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="login-password" className="eyebrow-label">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="h-11 w-full btn-glow" disabled={loading}>
                <LogIn className="mr-2 h-4 w-4" />
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleClientLogin} className="mt-8 space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="client-username" className="eyebrow-label">Username</Label>
                <Input
                  id="client-username"
                  type="text"
                  placeholder="Your username"
                  value={clientUsername}
                  onChange={(e) => setClientUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="client-password" className="eyebrow-label">Password</Label>
                <div className="relative">
                  <Input
                    id="client-password"
                    type={showClientPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={clientPassword}
                    onChange={(e) => setClientPassword(e.target.value)}
                    className="pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    aria-label={showClientPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowClientPassword(!showClientPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {showClientPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="h-11 w-full btn-glow" disabled={clientLoading}>
                <LogIn className="mr-2 h-4 w-4" />
                {clientLoading ? "Signing in..." : "Open my portal"}
              </Button>
            </form>
          )}

          <div className="rule-hairline mt-10" />
          <p className="mt-5 text-[11.5px] leading-relaxed text-muted-foreground/70">
            Credentials are issued by your accountant. Contact your engagement lead if you need
            access restored.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Auth;
