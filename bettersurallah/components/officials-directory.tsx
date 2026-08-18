"use client";

import { useMemo, useState } from "react";
import { GROUP_LABELS, OFFICIALS, type OfficialGroup } from "@/data/officials";
import { searchOfficials } from "@/lib/search";

const GROUP_ORDER: OfficialGroup[] = [
  "executive",
  "sangguniang_bayan",
  "department_head",
  "barangay_captain",
];

export function OfficialsDirectory() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchOfficials(OFFICIALS, query), [query]);

  return (
    <div className="flex flex-col gap-10">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, position, office, or barangay&hellip;"
        aria-label="Search officials"
        className="w-full max-w-xl rounded-full border border-ink/15 bg-base px-5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-blue"
      />

      {results.length === 0 && (
        <p className="text-sm text-ink-soft">No officials match &quot;{query}&quot;.</p>
      )}

      {GROUP_ORDER.map((group) => {
        const list = results.filter((o) => o.group === group);
        if (list.length === 0) return null;
        return (
          <section key={group}>
            <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold text-ink">
              {GROUP_LABELS[group]}
              <span className="text-sm font-semibold text-ink-soft">{list.length}</span>
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((o) => (
                <li key={`${o.name}-${o.position}`} className="rounded-xl border border-ink/10 bg-base p-4">
                  <p className="font-semibold text-ink">{o.name}</p>
                  <p className="mt-0.5 text-sm text-blue">{o.position}</p>
                  {o.detail && <p className="mt-1 text-xs leading-5 text-ink-soft">{o.detail}</p>}
                  {o.phone && (
                    <p className="mt-1 text-xs font-semibold text-ink-soft">☎ (083) {o.phone}</p>
                  )}
                  {o.unverified && (
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft/70">
                      Verification in progress
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
