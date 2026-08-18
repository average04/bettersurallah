const STITCH_DELAYS = [0, 0.4, 0.8, 1.2, 1.6];

function DiamondRings({ className }: { className?: string }) {
  const insets = [0, 9, 18, 27, 36];
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={className}>
      {insets.map((inset) => (
        <path
          key={inset}
          d={`M50 ${1 + inset} L${99 - inset} 50 L50 ${99 - inset} L${1 + inset} 50 Z`}
          stroke="currentColor"
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_80%_-10%,var(--mist)_0%,transparent_60%)]" />
        <div className="dotgrid absolute inset-0 opacity-[0.05]" />
        <DiamondRings className="absolute -right-56 top-1/2 h-[56rem] w-[56rem] -translate-y-1/2 text-blue opacity-[0.05]" />
      </div>

      <div className="relative z-10 h-1.5 w-full bg-blue" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8 sm:px-10">
        <p className="reveal flex items-center gap-2.5 font-display text-xl text-ink">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="var(--blue)" />
            <path d="M12 7.5 L16.5 12 L12 16.5 L7.5 12 Z" fill="var(--base)" />
          </svg>
          <span>
            <span className="font-normal">Better</span>
            <span className="font-bold">Surallah</span>
          </span>
        </p>
        <span
          className="reveal hidden items-center gap-2 rounded-full border border-blue/25 bg-mist/60 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue sm:inline-flex"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="beacon h-1.5 w-1.5 rounded-full bg-blue" />
          Under construction
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-16 sm:px-10">
        <p
          className="reveal flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue"
          style={{ animationDelay: "0.08s" }}
        >
          <span className="h-px w-10 bg-blue/50" />
          Para sa Surallah · South Cotabato
        </p>

        <h1
          className="reveal mt-6 max-w-4xl font-display text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-ink"
          style={{ animationDelay: "0.18s" }}
        >
          Something{" "}
          <span className="relative inline-block text-blue">
            better
            <svg
              aria-hidden="true"
              viewBox="0 0 120 10"
              fill="none"
              preserveAspectRatio="none"
              className="absolute -bottom-2 left-0 h-2.5 w-full"
            >
              <path
                d="M3 7 C 30 3, 90 3, 117 6"
                stroke="var(--sky)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          is coming for Surallah.
        </h1>

        <p
          className="reveal mt-8 max-w-xl text-lg leading-8 text-ink-soft"
          style={{ animationDelay: "0.3s" }}
        >
          An independent, citizen-built window into how our municipality works —
          local projects, budgets, and public records, gathered in one place and
          made easy to read. We&rsquo;re building it now; check back soon.
        </p>

        <div
          className="reveal mt-14 flex flex-wrap items-center gap-x-5 gap-y-3"
          style={{ animationDelay: "0.42s" }}
        >
          <span className="flex items-center gap-2">
            {STITCH_DELAYS.map((delay) => (
              <span
                key={delay}
                className="stitch block h-2 w-2 rotate-45 border border-blue/40"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
            Site status · On progress
          </span>
        </div>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-8 sm:px-10">
        <div
          className="reveal flex flex-col gap-2 border-t border-ink/10 pt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft sm:flex-row sm:items-center sm:justify-between"
          style={{ animationDelay: "0.55s" }}
        >
          <p>© 2026 BetterSurallah · A community initiative</p>
          <p>Surallah, South Cotabato, Philippines</p>
        </div>
      </footer>
    </div>
  );
}
