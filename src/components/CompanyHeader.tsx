import { Building2, FileSpreadsheet } from "lucide-react";

export const CompanyHeader = () => {
  return (
    <div className="bg-primary text-primary-foreground px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary-foreground/10 p-3 rounded-lg">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">CVS Auto Sales Inc.</h1>
            <p className="text-primary-foreground/80 text-sm">
              715 Huntingdon Pike, Rockledge, PA 19046 | Member #0021348405
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-primary-foreground/80">
          <FileSpreadsheet className="h-5 w-5" />
          <span className="text-sm font-medium">Financial Records Q4 2025</span>
        </div>
      </div>
    </div>
  );
};
