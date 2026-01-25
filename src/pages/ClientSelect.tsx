import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import mizanLogo from "@/assets/mizan-logo-new.png";

const ClientSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen futuristic-bg relative overflow-hidden flex flex-col">
      {/* Light beams */}
      <div className="light-beam light-beam-left" />
      <div className="light-beam light-beam-right" />

      {/* Header */}
      <header className="border-b border-border/30 bg-card/20 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={mizanLogo}
              alt="Mizan"
              className="h-10 w-auto mix-blend-lighten logo-glow-pulse"
            />
            <div>
              <h1 className="text-base font-semibold tracking-tight text-foreground">Mizan</h1>
              <p className="text-xs text-muted-foreground">Professional Financial Services</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate("/auth")} 
            className="btn-glow"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-16 relative z-10 flex items-center justify-center">
        <motion.div 
          className="max-w-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Hero Logo */}
          <motion.div 
            className="mb-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <img
              src={mizanLogo}
              alt="Mizan"
              className="h-40 w-40 object-contain mx-auto mix-blend-lighten logo-glow-pulse"
            />
          </motion.div>

          <motion.h2 
            className="text-4xl font-bold text-foreground mb-4 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome to <span className="text-primary glow-text-cyan">Mizan</span>
          </motion.h2>
          
          <motion.p 
            className="text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Professional bookkeeping and financial management services for your business
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")} 
              className="gap-2 px-8 py-6 text-base btn-glow"
            >
              Access Your Account
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.p 
            className="text-muted-foreground/50 text-sm mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Authorized personnel only
          </motion.p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/10 py-4 relative z-10">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2025 Mizan. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ClientSelect;
