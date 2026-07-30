import { Clock, MailCheck, ShieldCheck } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { QuoteForm } from "@/components/marketing/QuoteForm";

const ASSURANCES = [
  {
    icon: Clock,
    title: "One business day",
    body: "Requests are reviewed by an accountant, not routed to a sales queue. You’ll hear back within one business day.",
  },
  {
    icon: MailCheck,
    title: "A real scope, not a brochure",
    body: "The reply names the deliverables, the close cadence and a fixed monthly fee for your specific situation.",
  },
  {
    icon: ShieldCheck,
    title: "No documents up front",
    body: "We don’t ask for statements or logins until an engagement is agreed. The form below is all we need to quote.",
  },
];

const QuotePage = () => (
  <MarketingShell>
    <section className="mx-auto max-w-[1280px] px-5 pt-16 sm:px-8 sm:pt-20">
      <div className="max-w-[62ch]">
        <span className="eyebrow-label">Request a quote</span>
        <h1 className="headline-editorial mt-5 text-[34px] text-foreground sm:text-[46px]">
          Tell us where your books stand today.
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
          Answer six short questions. We’ll come back with the scope, the close cadence and a fixed
          monthly fee — including a plain answer if you need less than you think.
        </p>
      </div>
    </section>

    <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
      <QuoteForm />

      <aside className="min-w-0 space-y-6">
        {ASSURANCES.map((a) => (
          <div key={a.title} className="surface-panel-flat p-6">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <a.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-[15px] font-medium text-foreground">{a.title}</h2>
            <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">{a.body}</p>
          </div>
        ))}

        <div className="surface-panel-flat p-6">
          <span className="eyebrow-label">Already a client?</span>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            Your reconciled workbook, statements and exports live in the client portal.
          </p>
          <a
            href="/auth"
            className="mt-4 inline-flex text-[13px] text-primary transition-opacity duration-150 hover:opacity-80"
          >
            Go to the client portal →
          </a>
        </div>
      </aside>
    </section>
  </MarketingShell>
);

export default QuotePage;
