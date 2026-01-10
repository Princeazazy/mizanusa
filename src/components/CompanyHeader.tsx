import { FileSpreadsheet, Shield } from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";

export const CompanyHeader = () => {
  return (
    <div className="gradient-header text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
              <img src={apexLogo} alt="Apex Accounting" className="h-9 w-9 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">CVS Auto Sales Inc.</h1>
              <p className="text-primary-foreground/70 text-sm mt-0.5">
                715 Huntingdon Pike, Rockledge, PA 19046
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                  <Shield className="h-3 w-3" />
                  Member #0021348405
                </span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10">
            <img src={apexLogo} alt="Apex Accounting" className="h-8 w-8 object-contain" />
            <div className="text-right">
              <p className="text-sm font-semibold">Prepared by Apex Accounting</p>
              <p className="text-xs text-primary-foreground/70">Q4 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
