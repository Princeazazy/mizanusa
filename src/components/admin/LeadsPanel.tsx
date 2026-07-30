import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Inbox, Loader2, Mail, Phone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  business_name: string | null;
  industry: string;
  email: string;
  phone: string | null;
  situation: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

/** Inbound quote requests from the public site, shown to accountants only. */
export const LeadsPanel = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quote_requests")
      .select(
        "id,name,business_name,industry,email,phone,situation,message,status,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(50);
    setLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: "Couldn’t load quote requests",
        description: error.message,
      });
      return;
    }
    setLeads((data ?? []) as Lead[]);
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const markHandled = async (lead: Lead) => {
    setBusyId(lead.id);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("quote_requests")
      .update({
        status: "handled",
        handled_at: new Date().toISOString(),
        handled_by: userData.user?.id ?? null,
      })
      .eq("id", lead.id);
    setBusyId(null);
    if (error) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: "handled" } : l)));
    toast({ title: "Marked as handled", description: `${lead.name} moved out of the new queue.` });
  };

  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <section aria-labelledby="leads-heading" className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <span className="eyebrow-label">Inbound</span>
          <h2
            id="leads-heading"
            className="headline-editorial mt-3 text-[22px] text-foreground sm:text-[26px]"
          >
            Quote requests
            {newCount > 0 && (
              <span className="badge-status badge-on-track ml-3 align-middle">
                {newCount} new
              </span>
            )}
          </h2>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Submissions from the public website. Reply by email, then mark them handled.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => void load()}>
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="mt-8 space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[104px] animate-pulse rounded-2xl bg-white/[0.04]" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No quote requests yet"
          description="When someone submits the form on the public site, it lands here with their industry, situation and contact details."
        />
      ) : (
        <div className="mt-8 space-y-3">
          {leads.map((lead, i) => {
            const handled = lead.status === "handled";
            return (
              <motion.article
                key={lead.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i, 6) * 0.04 }}
                className={`surface-panel p-6 ${handled ? "opacity-60" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3
                        className="truncate text-[16px] font-medium text-foreground"
                        title={lead.business_name || lead.name}
                      >
                        {lead.business_name || lead.name}
                      </h3>
                      <span
                        className={`badge-status ${handled ? "badge-review" : "badge-on-track"}`}
                      >
                        {handled ? "Handled" : "New"}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-[12.5px] text-muted-foreground" title={lead.industry}>
                      {lead.name} · {lead.industry}
                      {lead.situation ? ` · ${lead.situation}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11.5px] tabular text-muted-foreground/70">
                    {fmtDate(lead.created_at)}
                  </span>
                </div>

                {lead.message && (
                  <p className="mt-4 max-w-[80ch] whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/80">
                    {lead.message}
                  </p>
                )}

                <div className="rule-hairline mt-5" />
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px]">
                    <a
                      href={`mailto:${encodeURIComponent(lead.email)}`}
                      className="inline-flex min-w-0 items-center gap-1.5 text-primary hover:opacity-80"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate" title={lead.email}>
                        {lead.email}
                      </span>
                    </a>
                    {lead.phone && (
                      <a
                        href={`tel:${encodeURIComponent(lead.phone)}`}
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {lead.phone}
                      </a>
                    )}
                  </div>
                  {!handled && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      disabled={busyId === lead.id}
                      onClick={() => void markHandled(lead)}
                    >
                      {busyId === lead.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      Mark handled
                    </Button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LeadsPanel;
