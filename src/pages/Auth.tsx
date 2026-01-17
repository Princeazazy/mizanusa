import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, LogIn, Calculator, TrendingUp, PieChart, FileSpreadsheet } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e17]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <img src={mizanLogo} alt="Mizan" className="h-24 w-24 object-contain mix-blend-lighten logo-glow-pulse" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0a0e17] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>
      
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative">
        <div className="max-w-md text-center">
          {/* Logo with blend mode to hide background */}
          <div className="relative mb-8 inline-block">
            <img
              src={mizanLogo}
              alt="Mizan"
              className="h-40 w-40 object-contain mx-auto relative z-10 mix-blend-lighten logo-glow-pulse"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Mizan
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Professional Financial Management System
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <Calculator className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-medium">P&L Statements</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-medium">Cash Flow</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <PieChart className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-medium">Balance Sheet</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <FileSpreadsheet className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-medium">Reconciliation</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-2">
            {/* Mobile logo */}
            <div className="lg:hidden mb-6">
              <img
                src={mizanLogo}
                alt="Mizan"
                className="h-24 w-24 object-contain mx-auto mix-blend-lighten logo-glow-pulse"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Accountant Login
            </CardTitle>
            <CardDescription className="text-slate-400">
              Sign in to access the financial workbook
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="accountant@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-11 mt-2"
                disabled={loading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <p className="text-center text-slate-500 text-xs mt-6">
              Authorized personnel only
            </p>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-slate-500 text-xs">
            © 2025 Mizan. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
