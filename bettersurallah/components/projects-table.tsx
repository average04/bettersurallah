"use client";

import { useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/data-states";
import { formatPeso, sortProjects } from "@/lib/format";
import { fetchProjects } from "@/lib/queries";
import type { FundingSource, GovernmentProject, ProjectStatus } from "@/lib/types";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; projects: GovernmentProject[] };

const STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "Planned",
  ongoing: "Ongoing",
  completed: "Completed",
  unknown: "Unknown",
};

const STATUS_STYLES: Record<ProjectStatus, string> = {
  completed: "bg-blue text-white",
  ongoing: "bg-mist text-blue border border-blue/30",
  planned: "border border-ink/20 text-ink-soft",
  unknown: "border border-ink/10 text-ink-soft",
};

const FUND_LABELS: Record<FundingSource, string> = {
  BUB: "BUB",
  LGSF: "LGSF",
  ADM: "ADM",
  AM: "AM",
  local: "Local funds",
  national: "National funds",
  other: "Other",
};

type SortKey = "year" | "amount";
type SortDir = "asc" | "desc";

export function ProjectsTable() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((projects) => { if (!cancelled) setState({ status: "ready", projects }); })
      .catch((e: Error) => { if (!cancelled) setState({ status: "error", message: e.message }); });
    return () => { cancelled = true; };
  }, [attempt]);

  const retry = () => { setState({ status: "loading" }); setAttempt((a) => a + 1); };

  const toggleSort = (key: SortKey) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  };

  const projects = useMemo(
    () => (state.status === "ready" ? state.projects : []),
    [state],
  );
  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.status === filter)),
    [projects, filter],
  );
  const sorted = useMemo(
    () => (sort ? sortProjects(visible, sort.key, sort.dir) : visible),
    [visible, sort],
  );
  const total = useMemo(
    () => visible.reduce((sum, p) => sum + (p.amount ?? 0), 0),
    [visible],
  );

  if (state.status === "loading") return <SkeletonRows count={10} />;
  if (state.status === "error")
    return <ErrorState message="Couldn't load projects." onRetry={retry} />;

  const statuses: (ProjectStatus | "all")[] = ["all", "completed", "ongoing", "planned", "unknown"];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === s
                ? "border-blue bg-blue text-white"
                : "border-ink/15 text-ink-soft hover:border-blue/40 hover:text-blue"
            }`}
          >
            {s === "all" ? "All" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState message="No projects with this status yet." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink/10">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-mist/60 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Barangay</th>
                <SortableHeader label="Year" sortKey="year" sort={sort} onSort={toggleSort} />
                <th className="px-4 py-3">Fund</th>
                <SortableHeader label="Amount" sortKey="amount" sort={sort} onSort={toggleSort} align="right" />
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">{p.title}</p>
                    {p.description && <p className="mt-0.5 text-xs text-ink-soft">{p.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{p.barangay ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.year ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.funding_source ? FUND_LABELS[p.funding_source] : "—"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-ink">{formatPeso(p.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[p.status]}`}>
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-mist/60 font-semibold text-ink">
                <td className="px-4 py-3" colSpan={4}>
                  Total ({visible.length} {visible.length === 1 ? "project" : "projects"})
                </td>
                <td className="px-4 py-3 text-right">{formatPeso(total)}</td>
                <td className="px-4 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  sort: { key: SortKey; dir: SortDir } | null;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sort?.key === sortKey;
  const ariaSort = active ? (sort.dir === "asc" ? "ascending" : "descending") : "none";
  return (
    <th className={`px-4 py-3 ${align === "right" ? "text-right" : ""}`} aria-sort={ariaSort}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 transition-colors hover:text-blue ${
          align === "right" ? "flex-row-reverse" : ""
        }`}
      >
        {label}
        {active && <span aria-hidden="true">{sort.dir === "asc" ? "▲" : "▼"}</span>}
      </button>
    </th>
  );
}
