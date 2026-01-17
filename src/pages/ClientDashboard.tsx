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
    <div className="min-h-screen bg-[#0a0e17] relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={mizanLogo}
              alt="Mizan"
              className="h-14 w-auto mix-blend-lighten logo-glow-pulse"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Mizan</h1>
              <p className="text-xs text-slate-400">Professional Financial Services</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                Your Clients
              </h2>
              <p className="text-slate-400 mt-1">
                Select a client to view their financial workbook
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 w-64"
                />
              </div>
              <Button 
                className="gap-2"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Add Client feature is under development.",
                })}
              >
                <Plus className="h-4 w-4" />
                Add Client
              </Button>
            </div>
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
                <Card
                  className={`bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group ${
                    client.status === "pending" ? "opacity-60" : ""
                  }`}
                  onClick={() => handleClientClick(client.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {client.name}
                          </h3>
                          {client.status === "active" && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                              Active
                            </span>
                          )}
                          {client.status === "pending" && (
                            <span className="inline-flex items-center text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 truncate mb-3">
                          {client.address}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Member #{client.memberNumber}</span>
                          <span>Last activity: {client.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No clients found matching your search.</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 py-4 relative z-10">
        <div className="container mx-auto px-6 text-center text-sm text-slate-500">
          © 2025 Mizan. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ClientDashboard;
