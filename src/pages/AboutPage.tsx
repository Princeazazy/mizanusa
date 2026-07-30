import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Section } from "@/components/marketing/Section";
import { MizanBalance3D } from "@/components/brand/MizanBalance3D";

const PRINCIPLES = [
  {
    title: "The document is the authority",
    body: "If a number can’t be traced to a statement, an invoice or a receipt, it doesn’t go in the ledger. Balancing by plug entry is how books become useless.",
  },
  {
    title: "Reconcile before you report",
    body: "A profit & loss built on unreconciled cash is a guess with formatting. Statements are only issued once every account ties out.",
  },
  {
    title: "Say what you don’t know",
    body: "Open questions are listed explicitly each month rather than absorbed into a miscellaneous account. Uncertainty is disclosed, not hidden.",
  },
  {
    title: "Fixed fees, stated scope",
    body: "You know the monthly cost and the deliverables before the engagement starts. Hourly billing rewards slow work; we don’t use it.",
  },
];

const AboutPage = () => (
  <MarketingShell>
    <section className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="min-w-0">
        <span className="eyebrow-label">About Mizan</span>
        <h1 className="headline-editorial mt-5 text-[36px] text-foreground sm:text-[50px]">
          Named for the balance, held to the balance.
        </h1>
        <p className="mt-6 max-w-[56ch] text-[15.5px] leading-relaxed text-muted-foreground sm:text-[16.5px]">
          <em className="not-italic text-foreground/90">Mizan</em> (ميزان) is the scale — the
          instrument that settles only when both sides agree. It’s an unusually literal name for a
          bookkeeping firm, and it’s the whole standard we work to: a period isn’t closed until it
          balances against the evidence.
        </p>
        <p className="mt-5 max-w-[56ch] text-[14.5px] leading-relaxed text-muted-foreground">
          We work with owner-operated businesses — auto dealers, trades and contractors,
          professional practices, and small retail. The common thread isn’t industry, it’s that the
          owner is too busy running the business to reconstruct a year of transactions, and needs
          someone who will do it from the statements rather than from memory.
        </p>
      </div>

      <div className="relative mx-auto h-[280px] w-full max-w-[460px] sm:h-[400px]">
        <MizanBalance3D className="h-full w-full" />
      </div>
    </section>

    <Section
      eyebrow="How we work"
      title="Four principles that decide every judgement call."
    >
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <article key={p.title} className="surface-panel p-7 sm:p-8">
            <span className="stat-display text-[12px] text-primary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="headline-editorial mt-5 text-[19px] text-foreground">{p.title}</h3>
            <p className="mt-3.5 text-[13.5px] leading-relaxed text-muted-foreground">{p.body}</p>
          </article>
        ))}
      </div>
    </Section>

    <Section
      eyebrow="Practice profile"
      title="A small practice, on purpose."
      lede="Client count is capped so that every engagement gets the same close discipline. Growth happens by adding capacity first, clients second."
    >
      <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.05] sm:grid-cols-3">
        {[
          { k: "Based in", v: "Philadelphia, PA" },
          { k: "Engagement model", v: "Fixed monthly fee" },
          { k: "Reporting cadence", v: "Monthly close" },
        ].map((item) => (
          <div key={item.k} className="bg-[hsl(231_20%_8%)] px-7 py-8">
            <dt className="eyebrow-label">{item.k}</dt>
            <dd
              className="stat-display mt-3 truncate text-[19px] text-foreground"
              title={item.v}
            >
              {item.v}
            </dd>
          </div>
        ))}
      </dl>
    </Section>

    <section className="mx-auto max-w-[1280px] px-5 pb-8 sm:px-8">
      <div className="surface-panel flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
        <div className="min-w-0">
          <h2 className="headline-editorial text-[24px] text-foreground sm:text-[28px]">
            Ready to see where your books really stand?
          </h2>
          <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-muted-foreground">
            Send us the shape of the problem — we’ll come back with the scope and a fixed monthly
            fee.
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

export default AboutPage;
