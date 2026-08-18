export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-ink/10 bg-base">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 sm:px-10">
        <p className="text-sm font-semibold text-ink">
          BetterSurallah is an independent, citizen-run initiative. It is not
          affiliated with the Municipal Government of Surallah.
        </p>
        <div className="flex flex-col gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BetterSurallah · A community initiative</p>
          <p>Surallah, South Cotabato, Philippines</p>
        </div>
      </div>
    </footer>
  );
}
