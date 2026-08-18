import Link from "next/link";
import { LatestDocuments } from "@/components/latest-documents";
import { MUNICIPAL_STATS } from "@/data/stats";

const SECTIONS = [
  {
    href: "/transparency",
    title: "Transparency",
    text: "Budgets, audits, and public documents — collected and easy to find.",
  },
  {
    href: "/projects",
    title: "Projects",
    text: "Government projects with amounts, funding sources, and status.",
  },
  {
    href: "/officials",
    title: "Officials",
    text: "Who runs Surallah — searchable, from mayor to barangay captains.",
  },
];

const STATS = [
  { value: MUNICIPAL_STATS.population.toLocaleString("en-PH"), label: `Population (${MUNICIPAL_STATS.populationCensusYear} census)` },
  { value: String(MUNICIPAL_STATS.barangays), label: "Barangays" },
  { value: MUNICIPAL_STATS.landAreaHectares.toLocaleString("en-PH"), label: "Hectares" },
  { value: String(MUNICIPAL_STATS.foundedYear), label: "Founded" },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_80%_-10%,var(--mist)_0%,transparent_60%)]" />
        <div className="dotgrid absolute inset-0 opacity-[0.05]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-20 sm:px-10">
        <p className="reveal flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue">
          <span className="h-px w-10 bg-blue/50" />
          Para sa Surallah · South Cotabato
        </p>
        <h1 className="reveal mt-6 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-ink" style={{ animationDelay: "0.1s" }}>
          See how Surallah <span className="text-blue">works</span>.
        </h1>
        <p className="reveal mt-6 max-w-xl text-lg leading-8 text-ink-soft" style={{ animationDelay: "0.2s" }}>
          An independent, citizen-built window into our municipality — public
          documents, government projects, and the people behind them, gathered
          in one place and made easy to read.
        </p>

        <dl className="reveal mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4" style={{ animationDelay: "0.3s" }}>
          {STATS.map((s) => (
            <div key={s.label} className="border-l-2 border-blue/30 pl-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{s.label}</dt>
              <dd className="mt-1 font-display text-3xl font-bold text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl gap-4 px-6 pb-16 sm:grid-cols-3 sm:px-10">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-xl border border-ink/10 bg-base p-6 transition-colors hover:border-blue/40"
          >
            <h2 className="font-display text-xl font-bold text-ink group-hover:text-blue">{s.title} →</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{s.text}</p>
          </Link>
        ))}
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 sm:px-10">
        <h2 className="font-display text-2xl font-bold text-ink">Latest documents</h2>
        <div className="mt-4">
          <LatestDocuments />
        </div>
      </section>
    </div>
  );
}
