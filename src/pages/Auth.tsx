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
import mizanLogo from "@/assets/mizan-logo-new.png";

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
          <p className="text-primary/60 text-base mb-10">
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
              <Calculator className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="text-primary/70 text-sm font-medium">P&L Statements</p>
            </motion.div>
            <motion.div 
              className="glass-card p-4 hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TrendingUp className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="text-primary/70 text-sm font-medium">Cash Flow</p>
            </motion.div>
            <motion.div 
              className="glass-card p-4 hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PieChart className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="text-primary/70 text-sm font-medium">Balance Sheet</p>
            </motion.div>
            <motion.div 
              className="glass-card p-4 hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FileSpreadsheet className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="text-primary/70 text-sm font-medium">Reconciliation</p>
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
              <CardTitle className="text-xl font-semibold text-primary">
                Sign In
              </CardTitle>
              <CardDescription className="text-primary/60">
                Access your financial workbook
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 pb-8 px-8">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-primary/80 text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="accountant@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-primary/5 border-primary/30 text-foreground placeholder:text-primary/40 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-primary/80 text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-primary/5 border-primary/30 text-foreground placeholder:text-primary/40 focus:border-primary focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary transition-colors"
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
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              
              <p className="text-center text-primary/40 text-xs mt-6">
                Authorized personnel only
              </p>
            </CardContent>
          </div>
        </motion.div>
        
        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-primary/30 text-xs">
            © 2025 Mizan. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
