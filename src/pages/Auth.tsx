import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, LogIn, Calculator, TrendingUp, PieChart, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import mizanLogo from "@/assets/mizan-logo-transparent.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleLogin = async (e: React.FormEvent) => {
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

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <img src={mizanLogo} alt="Mizan" className="h-24 w-24 object-contain mix-blend-lighten logo-glow-pulse" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background dark relative overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3" />
      </div>
      
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative">
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
              className="h-36 w-36 object-contain mx-auto relative z-10 mix-blend-lighten logo-glow-pulse"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
            Mizan
          </h1>
          <p className="text-muted-foreground text-base mb-10">
            Professional Financial Management System
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            <div className="bg-card border border-border/50 p-4 rounded-xl hover:border-primary/30 transition-colors">
              <Calculator className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="text-foreground/80 text-sm font-medium">P&L Statements</p>
            </div>
            <div className="bg-card border border-border/50 p-4 rounded-xl hover:border-primary/30 transition-colors">
              <TrendingUp className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="text-foreground/80 text-sm font-medium">Cash Flow</p>
            </div>
            <div className="bg-card border border-border/50 p-4 rounded-xl hover:border-primary/30 transition-colors">
              <PieChart className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="text-foreground/80 text-sm font-medium">Balance Sheet</p>
            </div>
            <div className="bg-card border border-border/50 p-4 rounded-xl hover:border-primary/30 transition-colors">
              <FileSpreadsheet className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="text-foreground/80 text-sm font-medium">Reconciliation</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="bg-card border-border/50 shadow-xl">
            <CardHeader className="text-center pb-2">
              {/* Mobile logo */}
              <div className="lg:hidden mb-6">
                <img
                  src={mizanLogo}
                  alt="Mizan"
                  className="h-20 w-20 object-contain mx-auto mix-blend-lighten logo-glow-pulse"
                />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Sign In
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Access your financial workbook
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-foreground/80 text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="accountant@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-input border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-foreground/80 text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-input border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 mt-2 btn-primary"
                  disabled={loading}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              
              <p className="text-center text-muted-foreground/60 text-xs mt-6">
                Authorized personnel only
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-muted-foreground/50 text-xs">
            © 2025 Mizan. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
