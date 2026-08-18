"use client";

import { useEffect, useState } from "react";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/data-states";
import { CATEGORY_LABELS } from "@/lib/format";
import { fetchLatestDocuments } from "@/lib/queries";
import type { TransparencyDocument } from "@/lib/types";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; docs: TransparencyDocument[] };

export function LatestDocuments() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchLatestDocuments(5)
      .then((docs) => { if (!cancelled) setState({ status: "ready", docs }); })
      .catch((e: Error) => { if (!cancelled) setState({ status: "error", message: e.message }); });
    return () => { cancelled = true; };
  }, [attempt]);

  const retry = () => { setState({ status: "loading" }); setAttempt((a) => a + 1); };

  if (state.status === "loading") return <SkeletonRows count={5} />;
  if (state.status === "error")
    return <ErrorState message="Couldn't load the latest documents." onRetry={retry} />;
  if (state.docs.length === 0)
    return <EmptyState message="No documents published yet." />;

  return (
    <ul className="flex flex-col divide-y divide-ink/10">
      {state.docs.map((doc) => (
        <li key={doc.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
          {doc.file_url ?? doc.source_url ? (
            <a
              href={doc.file_url ?? doc.source_url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink transition-colors hover:text-blue"
            >
              {doc.title}
            </a>
          ) : (
            <span className="font-semibold text-ink">{doc.title}</span>
          )}
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            {CATEGORY_LABELS[doc.category]}
            {doc.year ? ` · ${doc.year}` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
