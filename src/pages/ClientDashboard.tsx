import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FuturisticSidebar } from "@/components/FuturisticSidebar";
import { FuturisticHeader } from "@/components/FuturisticHeader";
import mizanLogo from "@/assets/mizan-logo-new.png";

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
    id: "defiore",
    name: "Defiore Carpentry LLC",
    address: "1162 S 12th St, Philadelphia, PA 19147",
    memberNumber: "9046528999",
    status: "active" as const,
    lastActivity: "Just added",
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
    } else if (clientId === "defiore") {
      navigate("/defiore");
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
      <div className="min-h-screen flex items-center justify-center futuristic-bg">
        <div className="light-beam light-beam-left" />
        <div className="light-beam light-beam-right" />
        <div className="animate-pulse flex flex-col items-center gap-4 z-10">
          <img
            src={mizanLogo}
            alt="Mizan"
            className="h-24 w-24 object-contain mix-blend-lighten logo-glow-pulse"
          />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen futuristic-bg relative overflow-hidden">
      {/* Light beams */}
      <div className="light-beam light-beam-left opacity-50" />
      <div className="light-beam light-beam-right opacity-50" />

      {/* Sidebar */}
      <FuturisticSidebar onSignOut={handleSignOut} />

      {/* Main content */}
      <div className="ml-16">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <FuturisticHeader
              title="Your Clients"
              subtitle="Select a client to view their financial workbook"
              showDatePicker={false}
            />

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input border-border/50 text-foreground placeholder:text-muted-foreground w-72 focus:border-primary/50"
                />
              </div>
              <Button 
                className="gap-2 btn-glow"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div
                    className={`floating-card p-6 cursor-pointer ${
                      client.status === "pending" ? "opacity-50" : ""
                    }`}
                    onClick={() => handleClientClick(client.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/15 text-primary">
                        <Building2 className="h-6 w-6" />
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
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No clients found matching your search.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/30 py-4 mt-16">
          <div className="max-w-[1600px] mx-auto px-8 text-center text-sm text-muted-foreground">
            © 2025 Mizan. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ClientDashboard;
