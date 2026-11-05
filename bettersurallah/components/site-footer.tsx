export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-ink/10 bg-base print:hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 sm:px-10">
        <div className="flex flex-col gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BetterSurallah · A community initiative</p>
          <p>Surallah, South Cotabato, Philippines</p>
        </div>
      </div>
    </footer>
  );
}
