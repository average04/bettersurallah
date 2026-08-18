"use client";

import { useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/data-states";
import { CATEGORY_LABELS, documentYears, groupByCategory } from "@/lib/format";
import { fetchDocuments } from "@/lib/queries";
import type { DocumentCategory, TransparencyDocument } from "@/lib/types";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; docs: TransparencyDocument[] };

export function TransparencyList() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [year, setYear] = useState<number | "all">("all");
  const [category, setCategory] = useState<DocumentCategory | "all">("all");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchDocuments()
      .then((docs) => {
        if (!cancelled) setState({ status: "ready", docs });
      })
      .catch((e: Error) => {
        if (!cancelled) setState({ status: "error", message: e.message });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setState({ status: "loading" });
    setAttempt((a) => a + 1);
  };

  const docs = useMemo(
    () => (state.status === "ready" ? state.docs : []),
    [state],
  );
  const years = useMemo(() => documentYears(docs), [docs]);
  const categories = useMemo(
    () => groupByCategory(docs).map(([c]) => c),
    [docs],
  );
  const visible = useMemo(
    () =>
      docs
        .filter((d) => year === "all" || d.year === year)
        .filter((d) => category === "all" || d.category === category),
    [docs, year, category],
  );
  const groups = useMemo(() => groupByCategory(visible), [visible]);

  if (state.status === "loading") return <SkeletonRows count={8} />;
  if (state.status === "error")
    return <ErrorState message="Couldn't load documents." onRetry={retry} />;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip label="All years" active={year === "all"} onClick={() => setYear("all")} />
        {years.map((y) => (
          <FilterChip key={y} label={String(y)} active={year === y} onClick={() => setYear(y)} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterChip label="All categories" active={category === "all"} onClick={() => setCategory("all")} />
        {categories.map((c) => (
          <FilterChip
            key={c}
            label={CATEGORY_LABELS[c]}
            active={category === c}
            onClick={() => setCategory(c)}
          />
        ))}
      </div>

      {groups.length === 0 && <EmptyState message="No documents for this filter yet." />}

      {groups.map(([groupCategory, list]) => (
        <section key={groupCategory}>
          <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold text-ink">
            {CATEGORY_LABELS[groupCategory]}
            <span className="text-sm font-semibold text-ink-soft">{list.length}</span>
          </h2>
          <ul className="mt-4 flex flex-col divide-y divide-ink/10 rounded-xl border border-ink/10 bg-base px-5">
            {list.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{doc.title}</p>
                  {doc.description && (
                    <p className="mt-0.5 text-sm text-ink-soft">{doc.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-4 text-sm font-semibold">
                  {doc.year && <span className="text-ink-soft">{doc.year}</span>}
                  {doc.source_url && (
                    <a href={doc.source_url} target="_blank" rel="noopener noreferrer" className="text-blue hover:text-blue-deep">
                      Official source ↗
                    </a>
                  )}
                  {doc.file_url && (
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-blue hover:text-blue-deep">
                      Copy ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "border-blue bg-blue text-white"
          : "border-ink/15 text-ink-soft hover:border-blue/40 hover:text-blue"
      }`}
    >
      {label}
    </button>
  );
}
