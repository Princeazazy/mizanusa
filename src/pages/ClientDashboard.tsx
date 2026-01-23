import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Users, LogOut, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import mizanLogo from "@/assets/mizan-logo-transparent.png";

// Mock client data - in the future this would come from the database
const clients = [
  {
    id: "cvs",
    name: "CVS Auto Sales Inc.",
    address: "715 Huntingdon Pike, Rockledge, PA 19046",
    memberNumber: "0021348405",
    status: "active" as const,
    lastActivity: "2 hours ago",
  },
  {
    id: "coming-soon-1",
    name: "Coming Soon",
    address: "New client onboarding",
    memberNumber: "—",
    status: "pending" as const,
    lastActivity: "—",
  },
];

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/auth");
        }
        setCheckingAuth(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/auth");
  };

  const handleClientClick = (clientId: string) => {
    if (clientId === "cvs") {
      navigate("/cvs");
    } else {
      toast({
        title: "Coming Soon",
        description: "This client will be available soon.",
      });
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e17]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <img
            src={mizanLogo}
            alt="Mizan"
            className="h-24 w-24 object-contain mix-blend-lighten logo-glow-pulse"
          />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark relative overflow-hidden flex flex-col">
      {/* Subtle gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={mizanLogo}
              alt="Mizan"
              className="h-12 w-auto mix-blend-lighten logo-glow-pulse"
            />
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">Mizan</h1>
              <p className="text-xs text-muted-foreground">Professional Financial Services</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleSignOut} 
            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-foreground tracking-tight mb-1">
              Hi there!
            </h2>
            <p className="text-muted-foreground">
              Here's Your Client Dashboard |{" "}
              <span className="text-primary font-medium cursor-pointer hover:underline">
                VIEW ALL
              </span>
            </p>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border/50 text-foreground placeholder:text-muted-foreground w-72 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
            <Button 
              className="gap-2 bg-primary hover:bg-primary/90 btn-primary"
              onClick={() => toast({
                title: "Coming Soon",
                description: "Add Client feature is under development.",
              })}
            >
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>

          {/* Client Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={`bg-card border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all cursor-pointer group hover-lift ${
                    client.status === "pending" ? "opacity-50" : ""
                  }`}
                  onClick={() => handleClientClick(client.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-base font-semibold text-foreground truncate">
                            {client.name}
                          </h3>
                          {client.status === "active" && (
                            <span className="badge-status badge-on-track">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                              Active
                            </span>
                          )}
                          {client.status === "pending" && (
                            <span className="badge-status badge-tasks">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-3">
                          {client.address}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                          <span>#{client.memberNumber}</span>
                          <span>{client.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No clients found matching your search.</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-4 relative z-10">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2025 Mizan. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ClientDashboard;
