import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, ChevronRight } from "lucide-react";

const clients = [
  {
    id: "cvs",
    name: "CVS Auto Sales Inc.",
    description: "Auto dealership - Q4 2025 Bookkeeping",
    route: "/cvs",
  },
];

const ClientSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3">
          <img 
            src="/apex-logo.png" 
            alt="Apex Accounting" 
            className="h-10 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Apex Accounting</h1>
            <p className="text-xs text-muted-foreground">Client Portal</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Select a Client</h2>
            <p className="text-muted-foreground">
              Choose a client to view their financial workbook
            </p>
          </div>

          <div className="space-y-4">
            {clients.map((client) => (
              <Card 
                key={client.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 hover:bg-muted/30 group"
                onClick={() => navigate(client.route)}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {client.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State for Future Clients */}
          <div className="mt-8 p-6 border-2 border-dashed rounded-xl text-center text-muted-foreground">
            <p className="text-sm">More clients coming soon...</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-4">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2025 Apex Accounting Services. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ClientSelect;
