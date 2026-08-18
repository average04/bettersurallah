import type { Metadata } from "next";
import { TransparencyList } from "@/components/transparency-list";

export const metadata: Metadata = {
  title: "Transparency",
  description:
    "Public documents of the Municipality of Surallah — budgets, audits, citizen's charters, and disclosures.",
};

export default function TransparencyPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue">Public documents</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">Transparency</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Official documents of the Municipality of Surallah, collected in one
        place. Every entry links to its source so you can verify it yourself.
      </p>
      <div className="mt-10">
        <TransparencyList />
      </div>
    </div>
  );
}
