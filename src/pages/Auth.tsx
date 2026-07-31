import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useClientAuth, storeClientSession } from "@/hooks/useClientAuth";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ArrowUpRight, Building2, Eye, EyeOff, LogIn, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { MizanBalance3D } from "@/components/brand/MizanBalance3D";
import { AppleGlyph, GoogleGlyph } from "@/components/brand/ProviderGlyphs";
import { setStaySignedIn } from "@/lib/sessionPersistence";
import { lovable } from "@/integrations/lovable/index";
import { isAccountantEmail, isOAuthIdentity } from "@/lib/accountants";

const SSO_SURFACE =
  "group relative flex h-11 w-full items-center rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 text-[13.5px] font-medium text-foreground transition-all duration-200 hover:-translate-y-px hover:border-white/[0.12] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/60 disabled:pointer-events-none disabled:opacity-60";

type Mode = "choose" | "client" | "bookkeeper";
type Provider = "apple" | "google";

/** Formats raw digits as XX-XXXXXXX while typing. */
const formatEin = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
};

const EIN_PATTERN = /^\d{2}-\d{7}$/;

const Auth = () => {
  // Bookkeeper (practice) login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [staySignedIn, setStaySignedInState] = useState(true);
  const [oauthPending, setOauthPending] = useState<Provider | null>(null);
  const [unavailable, setUnavailable] = useState<Provider[]>([]);
  const [resetting, setResetting] = useState(false);

  // Client login state
  const [clientUsername, setClientUsername] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const [showClientPassword, setShowClientPassword] = useState(false);
  const [clientLoading, setClientLoading] = useState(false);

  // EIN company-linking state (OAuth clients only)
  const [linkStage, setLinkStage] = useState<"idle" | "checking" | "ein">("idle");
  const [ein, setEin] = useState("");
  const [einError, setEinError] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);

  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const [mode, setMode] = useState<Mode>(
    roleParam === "client" ? "client" : roleParam === "bookkeeper" || roleParam === "accountant" ? "bookkeeper" : "choose",
  );

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: clientLogin, isAuthenticated: isClientAuthenticated, loading: clientAuthLoading } = useClientAuth();

  useEffect(() => {
    if (roleParam === "client") setMode("client");
    else if (roleParam === "bookkeeper" || roleParam === "accountant") setMode("bookkeeper");
  }, [roleParam]);

  /** Resolve an OAuth identity: linked -> portal, unlinked -> EIN step. */
  const resolveClientLink = useCallback(
    async (accessToken: string, action: "status" | "link", einValue?: string) => {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/client-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ action, ein: einValue }),
      });
      const data = await response.json().catch(() => ({}));
      return { ok: response.ok, status: response.status, data };
    },
    [],
  );

  const enterPortal = useCallback(
    (data: { sessionToken: string; clientId: string; clientName: string; expiresAt: string }) => {
      storeClientSession({
        sessionToken: data.sessionToken,
        clientId: data.clientId,
        clientName: data.clientName,
        expiresAt: data.expiresAt,
      });
      navigate("/client-portal");
    },
    [navigate],
  );

  useEffect(() => {
    let cancelled = false;

    const handleIdentity = async (session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]) => {
      if (cancelled) return;
      setCheckingAuth(false);

      if (!session?.user) return;

      const user = session.user;
      const federated = isOAuthIdentity(user.app_metadata);

      if (!federated && isAccountantEmail(user.email)) {
        navigate("/clients");
        return;
      }

      // Client-side identity — must be linked to a company before portal access.
      setMode("client");
      setLinkStage("checking");
      const { ok, data } = await resolveClientLink(session.access_token, "status");
      if (cancelled) return;

      if (ok && data.linked) {
        enterPortal(data);
        return;
      }
      setLinkStage("ein");
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleIdentity(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => handleIdentity(session));

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate, resolveClientLink, enterPortal]);

  useEffect(() => {
    if (!clientAuthLoading && isClientAuthenticated) {
      navigate("/client-portal");
    }
  }, [isClientAuthenticated, clientAuthLoading, navigate]);

  const handleOAuth = async (provider: Provider) => {
    setOauthPending(provider);
    setStaySignedIn(staySignedIn);

    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: `${window.location.origin}/auth?role=client`,
    });

    if (result.error) {
      const message = result.error.message ?? "";
      const notEnabled = /not enabled|unsupported provider|provider is not|disabled/i.test(message);
      if (notEnabled) setUnavailable((prev) => (prev.includes(provider) ? prev : [...prev, provider]));
      toast({
        title: notEnabled ? "Temporarily unavailable" : "Sign-in failed",
        description: notEnabled
          ? `${provider === "apple" ? "Apple" : "Google"} sign-in isn't switched on yet. Use your issued username and password, or contact your bookkeeper.`
          : message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setOauthPending(null);
      return;
    }

    if (result.redirected) return;
    setOauthPending(null);
  };

  const handleEinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEinError(null);

    if (!EIN_PATTERN.test(ein)) {
      setEinError("Enter your EIN in the format XX-XXXXXXX.");
      return;
    }

    setLinking(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLinking(false);
      setEinError("Your sign-in expired. Please sign in again.");
      return;
    }

    const { ok, data } = await resolveClientLink(session.access_token, "link", ein);
    setLinking(false);

    if (!ok || !data.linked) {
      setEinError(data.error || "We couldn't match that EIN — contact your bookkeeper.");
      return;
    }

    toast({ title: "Company linked", description: `Welcome, ${data.clientName}.` });
    enterPortal(data);
  };

  const handleSignOutIdentity = async () => {
    await supabase.auth.signOut();
    setLinkStage("idle");
    setEin("");
    setEinError(null);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Enter your email first",
        description: "Add your practice email above, then select Forgot password.",
        variant: "destructive",
      });
      return;
    }

    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetting(false);

    if (error) {
      toast({ title: "Could not send reset link", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Reset link sent",
      description: `If an account exists for ${email}, a password reset link is on its way.`,
    });
  };

  const handleBookkeeperLogin = async (e: React.FormEvent) => {
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
    setStaySignedIn(staySignedIn);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({
        title: "Login failed",
        description:
          error.message === "Invalid login credentials"
            ? "Invalid email or password. Please try again."
            : error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Welcome back", description: "Signed in to the practice workspace." });
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
      toast({ title: "Welcome", description: "Opening your client portal." });
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

  const panelClass =
    "surface-panel halo-card mx-auto w-full max-w-[440px] px-6 py-8 sm:px-8 sm:py-9";

  const renderChooser = () => (
    <div className={panelClass}>
      <span className="eyebrow-label">Sign in</span>
      <h2 className="headline-editorial mt-3 text-[30px] text-foreground">Choose your access</h2>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
        Two separate doors — one for business owners, one for the Mizan practice team.
      </p>

      <div className="mt-8 space-y-4">
        <button
          type="button"
          onClick={() => setMode("client")}
          className="group flex w-full items-center gap-4 rounded-2xl border border-primary/25 bg-primary/[0.06] p-5 text-left transition-all duration-200 hover:-translate-y-px hover:border-primary/45 hover:bg-primary/[0.09] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/60"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-medium text-foreground">Client Login</span>
            <span className="mt-1 block text-[12.5px] leading-relaxed text-muted-foreground">
              Business owners — Google, Apple or the credentials your bookkeeper issued.
            </span>
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>

        <button
          type="button"
          onClick={() => setMode("bookkeeper")}
          className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition-all duration-200 hover:-translate-y-px hover:border-white/[0.14] hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/60"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-foreground/80">
            <Users className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-medium text-foreground">Bookkeeper Login</span>
            <span className="mt-1 block text-[12.5px] leading-relaxed text-muted-foreground">
              Mizan practice staff only — email and password.
            </span>
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <div className="rule-hairline mt-10" />
      <p className="mt-5 flex items-start gap-2 text-[11.5px] leading-relaxed text-muted-foreground/70">
        <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0" />
        Practice access is restricted to authorised Mizan accountants.
      </p>
    </div>
  );

  const backButton = (
    <button
      type="button"
      onClick={() => setMode("choose")}
      className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      All sign-in options
    </button>
  );

  const renderEinStep = () => (
    <div className={panelClass}>
      <span className="eyebrow-label">Client Portal</span>
      <h2 className="headline-editorial mt-3 text-[30px] text-foreground">Link your company</h2>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
        Enter your company's EIN to connect your account. We verify it against your engagement
        records — this is a one-time step.
      </p>

      <form onSubmit={handleEinSubmit} className="mt-8 space-y-6">
        <div className="space-y-2.5">
          <Label htmlFor="ein" className="eyebrow-label">Employer Identification Number</Label>
          <Input
            id="ein"
            inputMode="numeric"
            placeholder="12-3456789"
            value={ein}
            onChange={(e) => {
              setEin(formatEin(e.target.value));
              setEinError(null);
            }}
            autoComplete="off"
          />
          {einError ? (
            <p className="text-[12px] leading-relaxed text-destructive">{einError}</p>
          ) : (
            <p className="text-[11.5px] text-muted-foreground/70">Format XX-XXXXXXX</p>
          )}
        </div>

        <Button type="submit" className="h-11 w-full btn-glow" disabled={linking}>
          <ShieldCheck className="mr-2 h-4 w-4" />
          {linking ? "Verifying..." : "Link and continue"}
        </Button>
      </form>

      <div className="rule-hairline mt-10" />
      <button
        type="button"
        onClick={handleSignOutIdentity}
        className="mt-5 text-[11.5px] font-medium text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline"
      >
        Use a different account
      </button>
    </div>
  );

  const renderClient = () => (
    <div className={panelClass}>
      {backButton}
      <span className="eyebrow-label mt-6 block">Client Portal</span>
      <h2 className="headline-editorial mt-3 text-[30px] text-foreground">View your books</h2>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
        Sign in with Google or Apple, or use the credentials your bookkeeper issued.
      </p>

      <div className="mt-8 space-y-3">
        {(["apple", "google"] as Provider[]).map((provider) => {
          const isUnavailable = unavailable.includes(provider);
          const label = provider === "apple" ? "Apple" : "Google";
          return (
            <button
              key={provider}
              type="button"
              onClick={() => handleOAuth(provider)}
              disabled={oauthPending !== null || isUnavailable}
              className={SSO_SURFACE}
            >
              {provider === "apple" ? (
                <AppleGlyph className="h-[17px] w-[17px] -mt-[2px] text-foreground" />
              ) : (
                <GoogleGlyph className="h-[17px] w-[17px]" />
              )}
              <span className="pointer-events-none absolute inset-x-0 text-center">
                {isUnavailable
                  ? `${label} temporarily unavailable`
                  : oauthPending === provider
                    ? `Opening ${label}...`
                    : `Continue with ${label}`}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-white/[0.07]" />
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Or</span>
        <span className="h-px flex-1 bg-white/[0.07]" />
      </div>

      <form onSubmit={handleClientLogin} className="mt-6 space-y-6">
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
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="client-password" className="eyebrow-label">Password</Label>
            <span className="text-[11.5px] text-muted-foreground/70">Issued by your bookkeeper</span>
          </div>
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

      <div className="rule-hairline mt-10" />
      <p className="mt-5 text-[11.5px] leading-relaxed text-muted-foreground/70">
        First time signing in with Google or Apple? You'll confirm your company EIN once to connect
        your account.
      </p>
    </div>
  );

  const renderBookkeeper = () => (
    <div className={panelClass}>
      {backButton}
      <span className="eyebrow-label mt-6 block">Practice Access</span>
      <h2 className="headline-editorial mt-3 text-[30px] text-foreground">Bookkeeper sign in</h2>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
        Email and password only, restricted to authorised Mizan accountants.
      </p>

      <form onSubmit={handleBookkeeperLogin} className="mt-8 space-y-6">
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
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="login-password" className="eyebrow-label">Password</Label>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetting}
              className="text-[11.5px] font-medium text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline disabled:opacity-60"
            >
              {resetting ? "Sending..." : "Forgot password?"}
            </button>
          </div>
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

        <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <Label htmlFor="stay-signed-in" className="cursor-pointer text-[13px] font-normal text-muted-foreground">
            Stay signed in
          </Label>
          <Switch id="stay-signed-in" checked={staySignedIn} onCheckedChange={setStaySignedInState} />
        </div>

        <Button type="submit" className="h-11 w-full btn-glow" disabled={loading}>
          <LogIn className="mr-2 h-4 w-4" />
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="rule-hairline mt-10" />
      <p className="mt-5 text-[11.5px] leading-relaxed text-muted-foreground/70">
        Google and Apple sign-in are reserved for client accounts and are not accepted for practice
        access.
      </p>
    </div>
  );

  const renderLinkChecking = () => (
    <div className={panelClass}>
      <span className="eyebrow-label">Client Portal</span>
      <h2 className="headline-editorial mt-3 text-[30px] text-foreground">Checking your access</h2>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
        One moment while we look up the company linked to your account.
      </p>
      <div className="mt-8 h-11 w-full animate-pulse rounded-xl bg-white/[0.05]" />
    </div>
  );

  return (
    <div className="min-h-screen futuristic-bg lg:grid lg:grid-cols-[1.15fr_0.85fr]">
      {/* ---------------- Brand column ---------------- */}
      <section className="relative hidden overflow-hidden border-r border-white/[0.06] lg:flex lg:flex-col lg:justify-between">
        <div className="light-beam light-beam-left" />

        <div className="relative z-10 px-14 pt-14">
          <span className="text-[15px] font-medium tracking-[-0.01em] text-foreground">Mizan</span>
        </div>

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
        <div className="mb-6 lg:hidden">
          <span className="text-[15px] font-medium tracking-[-0.01em] text-foreground">Mizan</span>
        </div>

        <motion.div
          key={`${mode}-${linkStage}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {linkStage === "checking"
            ? renderLinkChecking()
            : linkStage === "ein"
              ? renderEinStep()
              : mode === "choose"
                ? renderChooser()
                : mode === "client"
                  ? renderClient()
                  : renderBookkeeper()}
        </motion.div>
      </section>
    </div>
  );
};

export default Auth;
