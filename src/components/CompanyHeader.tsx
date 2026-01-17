import { Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import mizanLogo from "@/assets/mizan-logo.png";

export const CompanyHeader = () => {
  return (
    <div className="animated-gradient text-primary-foreground relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-20 left-1/4 w-48 h-48 bg-info/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/4 w-32 h-32 bg-income/10 rounded-full blur-2xl"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src={mizanLogo}
              alt="Mizan"
              className="h-10 w-10 object-contain drop-shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
            <div>
              <motion.h1 
                className="text-2xl font-bold tracking-tight flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                CVS Auto Sales Inc.
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <Sparkles className="h-4 w-4 text-warning" />
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-primary-foreground/70 text-sm mt-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                715 Huntingdon Pike, Rockledge, PA 19046
              </motion.p>
              <motion.div 
                className="flex items-center gap-2 mt-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                  <Shield className="h-3 w-3" />
                  Member #0021348405
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs bg-income/20 text-income-foreground px-2.5 py-1 rounded-full border border-income/30 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Active
                </span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="hidden md:flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.img
              src={mizanLogo}
              alt="Mizan"
              className="h-10 w-10 object-contain drop-shadow-xl"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            />
            <div className="text-right">
              <p className="text-sm font-semibold flex items-center gap-2">
                Prepared by Mizan
                <span className="inline-flex items-center justify-center w-5 h-5 bg-income/20 rounded-full">
                  <span className="w-2 h-2 bg-income rounded-full animate-pulse" />
                </span>
              </p>
              <p className="text-xs text-primary-foreground/70">Q4 2025 • CPA-Ready</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
