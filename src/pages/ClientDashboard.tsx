import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FuturisticSidebar } from "@/components/FuturisticSidebar";
import { FuturisticHeader } from "@/components/FuturisticHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EmptyState } from "@/components/EmptyState";
import { BrandLockup } from "@/components/brand/BrandLockup";

const clients = [
  {
    id: "cvs",
    name: "CVS Auto Sales Inc.",
    address: "715 Huntingdon Pike, Rockledge, PA 19046",
    memberNumber: "0021348405",
    status: "active" as const,
    lastActivity: "Q4 2025 reconciled",
  },
  {
    id: "defiore",
    name: "Defiore Carpentry LLC",
    address: "1162 S 12th St, Philadelphia, PA 19147",
    memberNumber: "9046528999",
    status: "active" as const,
    lastActivity: "Q1 2026 reconciled",
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
      <div className="min-h-screen futuristic-bg">
        <div className="light-beam light-beam-left" />
        <div className="light-beam light-beam-right" />
        <div className="mx-auto max-w-[1600px] px-8 py-8" aria-busy="true" aria-label="Loading clients">
          <BrandLockup size="md" />
          <div className="mt-8 h-9 w-56 animate-pulse rounded-lg bg-white/[0.05]" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-white/[0.04]" />
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-[320px] animate-pulse rounded-2xl bg-white/[0.04] lg:col-span-2" />
            <div className="h-[320px] animate-pulse rounded-2xl bg-white/[0.04]" />
          </div>
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

            {/* Client roster — editorial, asymmetric */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {filteredClients.map((client, index) => {
                const feature = index === 0;
                return (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className={feature ? "lg:col-span-2 lg:row-span-2" : ""}
                  >
                    <button
                      type="button"
                      onClick={() => handleClientClick(client.id)}
                      className={`surface-panel tilt-surface flex h-full w-full flex-col justify-between text-left ${
                        feature ? "p-9" : "p-7"
                      } ${client.status === "pending" ? "opacity-55" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <span className="stat-display text-[13px] text-muted-foreground/60">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {client.status === "active" ? (
                          <span className="badge-status badge-on-track">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Active
                          </span>
                        ) : (
                          <span className="badge-status badge-tasks">Pending</span>
                        )}
                      </div>

                      <div className={feature ? "mt-16" : "mt-10"}>
                        <h3
                          className={`headline-editorial text-foreground ${
                            feature ? "text-[30px]" : "text-[19px]"
                          }`}
                        >
                          {client.name}
                        </h3>
                        <p className="mt-3 max-w-[46ch] text-[13px] leading-relaxed text-muted-foreground">
                          {client.address}
                        </p>
                      </div>

                      <div className="rule-hairline mt-7" />
                      <div className="mt-4 flex items-center justify-between text-[11.5px] text-muted-foreground/70">
                        <span className="tabular">#{client.memberNumber}</span>
                        <span>{client.lastActivity}</span>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>


            {filteredClients.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No clients found matching your search.</p>
              </div>
            )}
          </motion.div>
        </div>

        <SiteFooter className="mt-16" />

      </div>
    </div>
  );
};

export default ClientDashboard;
