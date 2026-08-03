import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  Lock,
  ScrollText,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Section } from "@/components/marketing/Section";
import { MizanBalance3D } from "@/components/brand/MizanBalance3D";
import { SectionBoundary } from "@/components/marketing/SectionBoundary";
import { DepthAccents, PerspectiveShowcase, TiltCard } from "@/components/marketing/depth";

import { RevenueExpenseChart } from "@/components/charts/RevenueExpenseChart";
import { CategoryDonut } from "@/components/charts/CategoryDonut";

/** Illustrative figures for the product showcase — clearly labelled as a sample. */
const SAMPLE_MONTHS = [
  { month: "Oct", revenue: 42800, expenses: 31240 },
  { month: "Nov", revenue: 51360, expenses: 34910 },
  { month: "Dec", revenue: 47120, expenses: 29880 },
  { month: "Jan", revenue: 58940, expenses: 36420 },
  { month: "Feb", revenue: 54210, expenses: 33150 },
  { month: "Mar", revenue: 63480, expenses: 38760 },
];

const SAMPLE_COMPOSITION = [
  { name: "Inventory Purchases", value: 84200 },
  { name: "Payroll & Contractors", value: 46800 },
  { name: "Vehicle & Equipment", value: 21400 },
  { name: "Title & Registration", value: 14750 },
  { name: "Insurance", value: 9600 },
  { name: "Office & Software", value: 6180 },
  { name: "Bank & Merchant Fees", value: 3240 },
];

const PILLARS = [
  {
    icon: ScrollText,
    title: "Source-document bookkeeping",
    body: "Every entry traces to a bank statement, card statement or vendor invoice. Nothing is estimated and nothing is plugged to make a total agree.",
  },
  {
    icon: Scale,
    title: "Reconciliation you can defend",
    body: "Each period closes with a tie-out schedule: beginning balance, cleared activity, ending balance, and an explanation for every variance.",
  },
  {
    icon: FileSpreadsheet,
    title: "Accountant-ready statements",
    body: "Profit & loss, balance sheet and cash flow prepared to the format your accountant or lender already expects — no reformatting on their end.",
  },
];

const SERVICE_SUMMARY = [
  { name: "Monthly bookkeeping", detail: "Coding, classification, chart of accounts upkeep" },
  { name: "Bank & card reconciliation", detail: "Statement-level tie-out with variance notes" },
  { name: "Financial statements", detail: "P&L, balance sheet, cash flow" },
  { name: "Catch-up & clean-up", detail: "Back periods rebuilt from statements" },
  { name: "Accountant hand-off", detail: "Year-end package and workpapers" },
];

const PROCESS = [
  {
    step: "01",
    title: "Scoping call",
    body: "We look at how many accounts you run, how far behind the books are, and what your accountant needs at year end. You get a fixed monthly quote — no hourly surprises.",
  },
  {
    step: "02",
    title: "Baseline build",
    body: "We pull statements for the open periods, set a proper chart of accounts for your industry, and reconstruct the ledger from the documents themselves.",
  },
  {
    step: "03",
    title: "Monthly close",
    body: "Each month closes on a schedule: transactions coded, accounts reconciled, statements issued, open questions listed in plain English.",
  },
  {
    step: "04",
    title: "Portal & hand-off",
    body: "Your workbook lives in a private portal. Everything is exportable to Excel, PowerPoint or print for your accountant, lender or partners.",
  },
];

const MarketingHome = () => (
  <MarketingShell>
    {/* ============================= Hero ============================= */}
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Bookkeeping &amp; financial reporting
          </span>

          <h1 className="headline-editorial mt-7 text-[38px] text-foreground sm:text-[54px] lg:text-[60px]">
            Books that tie to the
            <span className="text-primary"> statement</span>, every month.
          </h1>

          <p className="mt-6 max-w-[54ch] text-[15.5px] leading-relaxed text-muted-foreground sm:text-[17px]">
            Mizan builds and maintains small-business books from source documents, reconciles them
            to the penny, and issues financial statements your accountant can file from directly.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/quote"
              className="btn-glow inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground transition-transform duration-150 hover:-translate-y-px"
            >
              Get a quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] px-5 py-3 text-[14px] text-foreground/90 transition-colors duration-150 hover:border-white/20"
            >
              What we do
            </Link>
          </div>

          <dl className="mt-12 grid max-w-[520px] grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            {[
              { k: "Close cadence", v: "Monthly" },
              { k: "Reconciliation", v: "To the cent" },
              { k: "Quote structure", v: "Fixed fee" },
            ].map((s) => (
              <div key={s.k} className="min-w-0">
                <dt className="eyebrow-label">{s.k}</dt>
                <dd className="stat-display mt-2 truncate text-[16px] sm:text-[18px]" title={s.v}>
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto h-[340px] w-full max-w-[620px] sm:h-[480px] lg:h-[600px]"
        >
          <SectionBoundary label="hero-sculpture">
            <MizanBalance3D className="h-full w-full" />
          </SectionBoundary>
        </motion.div>

      </div>
    </section>

    {/* ============================= Pillars ============================= */}
    <Section
      eyebrow="The standard"
      title="Bookkeeping held to an accountant’s evidence standard."
      lede="Most small-business books fall apart under review because the numbers were never tied to anything. We work the other way round: the documents come first."
    >
      <div className="depth-stage mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <TiltCard as="article" className="surface-panel tilt-surface flex h-full flex-col overflow-hidden p-7">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <h3 className="headline-editorial mt-6 text-[18px] text-foreground">{p.title}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{p.body}</p>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </Section>

    {/* ============================= Showcase ============================= */}
    <Section
      eyebrow="Inside the portal"
      title="You see the same reporting we do."
      lede="Clients get a private workbook with reconciled registers, categorised detail and full statements — not a PDF dropped in an inbox once a quarter."
    >
      <div className="mt-14 grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr]">
        <RevenueExpenseChart
          data={SAMPLE_MONTHS}
          period="Oct 1, 2025 – Mar 31, 2026"
          basis="Illustrative sample · Not client data"
        />
        <CategoryDonut
          data={SAMPLE_COMPOSITION}
          period="Oct 1, 2025 – Mar 31, 2026"
          basis="Illustrative sample · Not client data"
          featured
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            icon: BookOpen,
            title: "Chart of accounts coding",
            body: "Industry-appropriate account structure applied line by line, so reports actually mean something.",
          },
          {
            icon: ShieldCheck,
            title: "Exportable everywhere",
            body: "Excel workpapers, a branded PowerPoint summary and print-clean statements, on demand.",
          },
          {
            icon: Lock,
            title: "Separate client access",
            body: "Read-only portal logins scoped to a single engagement. Clients never see another client’s data.",
          },
        ].map((f) => (
          <div key={f.title} className="surface-panel-flat p-6">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-primary">
              <f.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-[15px] font-medium text-foreground">{f.title}</h3>
            <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* ============================= Services digest ============================= */}
    <Section
      eyebrow="Engagements"
      title="Five things, done properly."
      lede="We deliberately don’t sell tax prep, audit or advisory. Bookkeeping and reporting is the whole practice."
    >
      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
        <ul className="min-w-0">
          {SERVICE_SUMMARY.map((s, i) => (
            <li
              key={s.name}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-white/[0.06] py-5"
            >
              <span className="flex min-w-0 items-baseline gap-4">
                <span className="stat-display shrink-0 text-[12px] text-muted-foreground/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="truncate text-[15.5px] text-foreground" title={s.name}>
                  {s.name}
                </span>
              </span>
              <span
                className="truncate text-[12.5px] text-muted-foreground/80"
                title={s.detail}
              >
                {s.detail}
              </span>
            </li>
          ))}
          <li className="pt-7">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-[13.5px] text-primary transition-opacity duration-150 hover:opacity-80"
            >
              Full scope and deliverables
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </li>
        </ul>

        <div className="surface-panel h-fit p-7 sm:p-8">
          <span className="eyebrow-label">What you get every month</span>
          <ul className="mt-6 space-y-4">
            {[
              "Coded and classified transaction register",
              "Reconciliation tie-out for each account",
              "Profit & loss, balance sheet, cash flow",
              "A short written list of open questions",
              "Excel and print exports of everything",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-[13.5px] leading-relaxed text-foreground/85">{item}</span>
              </li>
            ))}
          </ul>
          <div className="rule-hairline mt-7" />
          <Link
            to="/quote"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[13.5px] font-medium text-primary-foreground"
          >
            Request a fixed quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>

    {/* ============================= Process ============================= */}
    <Section eyebrow="How it runs" title="Four steps from messy to closed.">
      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.05] sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS.map((p) => (
          <div key={p.step} className="bg-[hsl(231_20%_8%)] p-7">
            <span className="stat-display text-[13px] text-primary">{p.step}</span>
            <h3 className="headline-editorial mt-5 text-[17px] text-foreground">{p.title}</h3>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* ============================= CTA ============================= */}
    <section className="mx-auto max-w-[1280px] px-5 pb-8 sm:px-8">
      <div className="surface-panel relative overflow-hidden px-7 py-14 text-center sm:px-16 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-1/2 h-[200%] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12),transparent_62%)]"
        />
        <div className="relative mx-auto max-w-[58ch]">
          <span className="eyebrow-label">Next step</span>
          <h2 className="headline-editorial mt-4 text-[30px] text-foreground sm:text-[42px]">
            Tell us where the books stand. We’ll quote it.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            Five minutes of detail is enough for a real scope and a fixed monthly fee — usually back
            within one business day.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/quote"
              className="btn-glow inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground"
            >
              Get a quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center rounded-xl border border-white/[0.1] px-5 py-3 text-[14px] text-foreground/90 hover:border-white/20"
            >
              About the firm
            </Link>
          </div>
        </div>
      </div>
    </section>
  </MarketingShell>
);

export default MarketingHome;
