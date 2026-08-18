import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FuturisticSidebar } from "@/components/FuturisticSidebar";
import { FuturisticHeader } from "@/components/FuturisticHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { InvoicingPanel } from "@/components/invoicing/InvoicingPanel";
import { BOOKS_CLIENTS } from "@/lib/books/clients";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const InvoicingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clientId, setClientId] = useState(BOOKS_CLIENTS[0].id);
  const client = BOOKS_CLIENTS.find((c) => c.id === clientId)!;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth?role=bookkeeper", { replace: true });
  };

  return (
    <div className="futuristic-bg relative min-h-screen overflow-hidden">
      <div className="light-beam light-beam-left opacity-50" />
      <div className="light-beam light-beam-right opacity-50" />

      <FuturisticSidebar onSignOut={handleSignOut} />

      <div className="ml-16">
        <div className="mx-auto max-w-[1600px] px-6 py-8 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <FuturisticHeader
              title="Invoicing"
              subtitle="Create and email invoices on behalf of your clients, then track what has been collected."
              accountEmail={user?.email ?? undefined}
              onSignOut={handleSignOut}
            />

            <div className="mb-6 flex flex-wrap items-center gap-2">
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="h-9 w-[260px] text-[12.5px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOKS_CLIENTS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <InvoicingPanel clientId={clientId} clientName={client.name} />
          </motion.div>
        </div>

        <SiteFooter className="mt-16" />
      </div>
    </div>
  );
};

export default InvoicingPage;
