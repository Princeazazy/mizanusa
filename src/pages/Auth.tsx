import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useClientAuth } from "@/hooks/useClientAuth";
import { Eye, EyeOff, Mail, Lock, LogIn, Calculator, TrendingUp, PieChart, FileSpreadsheet, User, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import mizanLogo from "@/assets/mizan-logo-new.png";

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

  const [activeTab, setActiveTab] = useState<"accountant" | "client">("accountant");

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: clientLogin, isAuthenticated: isClientAuthenticated, loading: clientAuthLoading } = useClientAuth();

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
        <div className="light-beam light-beam-left" />
        <div className="light-beam light-beam-right" />
        <div className="animate-pulse flex flex-col items-center gap-4 z-10">
          <img src={mizanLogo} alt="Mizan" className="h-64 w-64 object-contain mix-blend-lighten logo-glow-pulse" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex futuristic-bg relative overflow-hidden">
      {/* Light beams */}
      <div className="light-beam light-beam-left" />
      <div className="light-beam light-beam-right" />
      
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative z-10">
        <motion.div 
          className="max-w-md text-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="relative mb-8 inline-block">
            <img
              src={mizanLogo}
              alt="Mizan"
              className="h-64 w-64 object-contain mx-auto relative z-10 mix-blend-lighten logo-glow-pulse"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
            <span className="text-primary glow-text-cyan">Mizan</span>
          </h1>
          <p className="text-base text-muted-foreground mb-10">
            Professional Financial Management System
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            <motion.div 
              className="glass-card p-4 hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Calculator className="h-7 w-7 text-primary/80 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground/80">P&L Statements</p>
            </motion.div>
            <motion.div 
              className="glass-card p-4 hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TrendingUp className="h-7 w-7 text-primary/80 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground/80">Cash Flow</p>
            </motion.div>
            <motion.div 
              className="glass-card p-4 hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PieChart className="h-7 w-7 text-primary/80 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground/80">Balance Sheet</p>
            </motion.div>
            <motion.div 
              className="glass-card p-4 hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FileSpreadsheet className="h-7 w-7 text-primary/80 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground/80">Reconciliation</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="glass-card overflow-hidden border-primary/30">
            <CardHeader className="text-center pb-2 pt-8">
              {/* Mobile logo */}
              <div className="lg:hidden mb-6">
                <img
                  src={mizanLogo}
                  alt="Mizan"
                  className="h-32 w-32 object-contain mx-auto mix-blend-lighten logo-glow-pulse"
                />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Sign In
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Access your financial workbook
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4 pb-8 px-8">
              {/* Login Type Tabs */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "accountant" | "client")} className="w-full">
                <TabsList className="w-full mb-6 bg-primary/5">
                  <TabsTrigger value="accountant" className="flex-1 gap-2 data-[state=active]:bg-white/[0.06] data-[state=active]:text-foreground">
                    <Briefcase className="h-4 w-4" />
                    Accountant
                  </TabsTrigger>
                  <TabsTrigger value="client" className="flex-1 gap-2 data-[state=active]:bg-white/[0.06] data-[state=active]:text-foreground">
                    <User className="h-4 w-4" />
                    Client
                  </TabsTrigger>
                </TabsList>

                {/* Accountant Login Form */}
                <TabsContent value="accountant">
                  <form onSubmit={handleAccountantLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="accountant@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full btn-glow h-11 mt-2"
                      disabled={loading}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      {loading ? "Signing in..." : "Sign In as Accountant"}
                    </Button>
                  </form>
                  
                  <p className="text-center text-xs text-muted-foreground mt-6">
                    Authorized personnel only
                  </p>
                </TabsContent>

                {/* Client Login Form */}
                <TabsContent value="client">
                  <form onSubmit={handleClientLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="client-username" className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="client-username"
                          type="text"
                          placeholder="Your username"
                          value={clientUsername}
                          onChange={(e) => setClientUsername(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="client-password" className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="client-password"
                          type={showClientPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={clientPassword}
                          onChange={(e) => setClientPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowClientPassword(!showClientPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
                        >
                          {showClientPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full btn-glow h-11 mt-2"
                      disabled={clientLoading}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      {clientLoading ? "Signing in..." : "Sign In as Client"}
                    </Button>
                  </form>
                  
                  <p className="text-center text-xs text-muted-foreground mt-6">
                    Client portal access only
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </div>
        </motion.div>
        
        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-xs text-muted-foreground/70">
            © 2025 Mizan. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
