import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Section } from "@/components/marketing/Section";

const SERVICES = [
  {
    id: "monthly",
    name: "Monthly bookkeeping",
    summary:
      "Ongoing coding and classification of every bank and card transaction against a chart of accounts built for your industry.",
    includes: [
      "Transaction-level coding with account numbers",
      "Chart of accounts design and upkeep",
      "Vendor and customer normalisation",
      "Inter-account transfers isolated so they never inflate revenue",
      "Written list of items needing your input",
    ],
    deliverable: "Coded transaction register + open-items memo",
  },
  {
    id: "reconciliation",
    name: "Bank & credit card reconciliation",
    summary:
      "Every account is tied out to its statement: beginning balance, cleared activity, ending balance, and a note for each variance.",
    includes: [
      "Statement-to-ledger tie-out per account",
      "Outstanding and uncleared item schedules",
      "Variance explanations in plain English",
      "Savings and operating accounts kept distinct",
      "Duplicate and missing-transaction detection",
    ],
    deliverable: "Reconciliation schedule per account, per period",
  },
  {
    id: "statements",
    name: "Financial statements",
    summary:
      "Profit & loss, balance sheet and cash flow prepared in a conventional accountant format, from reconciled data only.",
    includes: [
      "Profit & loss with subtotals by account group",
      "Balance sheet that ties to reconciled cash",
      "Cash flow using the direct method",
      "Comparative and period-to-date presentations",
      "Print-clean and Excel versions of each statement",
    ],
    deliverable: "Statement package (P&L, BS, CF)",
  },
  {
    id: "catchup",
    name: "Catch-up & clean-up",
    summary:
      "Back periods rebuilt from statements when books were never set up, abandoned, or left in an unusable state.",
    includes: [
      "Rebuild from bank and card statements",
      "Correction of miscoded prior entries",
      "Removal of duplicated and plugged entries",
      "Period-by-period reconciliation to close the gap",
      "Summary of what was found and corrected",
    ],
    deliverable: "Closed prior periods + findings summary",
  },
  {
    id: "handoff",
    name: "Year-end accountant hand-off",
    summary:
      "A packaged year so your accountant or lender can work from it directly instead of asking you for the same files twice.",
    includes: [
      "Full-year workpaper workbook",
      "Trial balance and account detail",
      "Supporting schedules for major accounts",
      "Branded summary presentation",
      "Direct answers to your accountant’s follow-ups",
    ],
    deliverable: "Year-end workpaper package",
  },
];

const NOT_INCLUDED = [
  "Tax return preparation or filing",
  "Audit, review or attestation engagements",
  "Payroll processing or tax deposits",
  "Investment, legal or valuation advice",
];

const ServicesPage = () => (
  <MarketingShell>
    <Section
      eyebrow="Services"
      title="What a Mizan engagement actually covers."
      lede="Scope is written down before we start, so you know exactly which deliverables land each month and which things sit outside the engagement."
      className="pb-6"
    />

    <section className="mx-auto max-w-[1280px] px-5 pb-6 sm:px-8">
      <div className="grid grid-cols-1 gap-6">
        {SERVICES.map((s, i) => (
          <article
            key={s.id}
            className="surface-panel grid grid-cols-1 gap-8 p-7 sm:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
          >
            <div className="min-w-0">
              <span className="stat-display text-[12px] text-muted-foreground/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="headline-editorial mt-4 text-[24px] text-foreground sm:text-[28px]">
                {s.name}
              </h2>
              <p className="mt-4 max-w-[46ch] text-[14px] leading-relaxed text-muted-foreground">
                {s.summary}
              </p>
              <div className="rule-hairline mt-7" />
              <div className="mt-4">
                <span className="eyebrow-label">Deliverable</span>
                <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/85">
                  {s.deliverable}
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <span className="eyebrow-label">Included</span>
              <ul className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
                {s.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-[13.5px] leading-relaxed text-foreground/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>

    <Section
      eyebrow="Boundaries"
      title="What we don’t do."
      lede="Being explicit here protects you. These services need a different licence, a different insurer, or simply a different specialist — we’ll refer you rather than improvise."
    >
      <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.05] sm:grid-cols-2">
        {NOT_INCLUDED.map((item) => (
          <li key={item} className="bg-[hsl(231_20%_8%)] px-6 py-5 text-[13.5px] text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </Section>

    <section className="mx-auto max-w-[1280px] px-5 pb-8 sm:px-8">
      <div className="surface-panel flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
        <div className="min-w-0">
          <h2 className="headline-editorial text-[24px] text-foreground sm:text-[28px]">
            Not sure which of these you need?
          </h2>
          <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-muted-foreground">
            Describe your situation and we’ll tell you what’s actually required — including if it’s
            less than you expected.
          </p>
        </div>
        <Link
          to="/quote"
          className="btn-glow inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground"
        >
          Get a quote
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  </MarketingShell>
);

export default ServicesPage;
