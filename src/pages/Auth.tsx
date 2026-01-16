import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, LogIn, Calculator, TrendingUp, PieChart, FileSpreadsheet } from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/cvs");
        }
        setCheckingAuth(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/cvs");
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <img src={apexLogo} alt="Apex Accounting" className="h-16 w-16 object-contain" />
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>
      
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative">
        <div className="max-w-md text-center">
          {/* Logo with glow effect */}
          <div className="relative mb-8 inline-block">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl scale-150" />
            <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-2xl">
              <img src={apexLogo} alt="Apex Accounting" className="h-24 w-24 object-contain mx-auto" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Apex Accounting
          </h1>
          <p className="text-white/60 text-lg mb-8">
            Professional Financial Management System
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-white/80 text-sm font-medium">P&L Statements</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-white/80 text-sm font-medium">Cash Flow</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <PieChart className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white/80 text-sm font-medium">Balance Sheet</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <FileSpreadsheet className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <p className="text-white/80 text-sm font-medium">Reconciliation</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-2">
            {/* Mobile logo */}
            <div className="lg:hidden mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 inline-block">
                <img src={apexLogo} alt="Apex Accounting" className="h-16 w-16 object-contain" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Accountant Login
            </CardTitle>
            <CardDescription className="text-white/60">
              Sign in to access the financial workbook
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-white/80">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="accountant@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-white/80">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 mt-2"
                disabled={loading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <p className="text-center text-white/40 text-xs mt-6">
              Authorized personnel only
            </p>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-white/40 text-xs">
            © 2025 Apex Accounting. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
