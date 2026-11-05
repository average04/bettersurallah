"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-blue/40 hover:text-blue print:hidden"
    >
      Print checklist
    </button>
  );
}
