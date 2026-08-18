import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/officials-directory";

export const metadata: Metadata = {
  title: "Officials",
  description:
    "Searchable directory of Surallah's municipal officials, department heads, and barangay captains.",
};

export default function OfficialsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue">Who runs Surallah</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">Officials</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Municipal officials, department heads, and barangay captains — as
        published by the Municipality of Surallah, searchable as text for the
        first time.
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">
        Note: the Sangguniang Bayan roster below is as listed on the official
        municipal website and may be outdated — verification against the 2025
        election results is in progress.
      </p>
      <div className="mt-10">
        <OfficialsDirectory />
      </div>
    </div>
  );
}
