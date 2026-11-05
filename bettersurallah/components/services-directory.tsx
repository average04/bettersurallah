"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Office, OfficeKey } from "@/data/services";
import { searchServices, type ServiceIndexEntry } from "@/lib/services-search";

interface DirectoryProps {
  entries: ServiceIndexEntry[];
  offices: Office[];
  popular: { slug: string; name: string }[];
}

/** Reads ?q= and ?office= so searches can be linked and shared. */
export function ServicesDirectory(props: DirectoryProps) {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const officeParam = params.get("office");
  const office = props.offices.some((o) => o.key === officeParam) ? (officeParam as OfficeKey) : "all";
  return <DirectoryView {...props} initialQuery={q} initialOffice={office} syncUrl />;
}

/** Keeps ?q= and ?office= in the address bar so a search can be shared. */
function writeUrl(query: string, office: OfficeKey | "all") {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (office !== "all") params.set("office", office);
  const search = params.toString() ? `?${params.toString()}` : "";
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${search}${window.location.hash}`);
}

export function DirectoryView({
  entries,
  offices,
  popular,
  initialQuery = "",
  initialOffice = "all",
  syncUrl = false,
}: DirectoryProps & { initialQuery?: string; initialOffice?: OfficeKey | "all"; syncUrl?: boolean }) {
  const [query, setQueryState] = useState(initialQuery);
  const [office, setOfficeState] = useState<OfficeKey | "all">(initialOffice);

  const setQuery = (q: string) => {
    setQueryState(q);
    if (syncUrl) writeUrl(q, office);
  };
  const setOffice = (o: OfficeKey | "all") => {
    setOfficeState(o);
    if (syncUrl) writeUrl(query, o);
  };

  const officeByKey = useMemo(() => new Map(offices.map((o) => [o.key, o])), [offices]);
  const inOffice = useMemo(
    () => (office === "all" ? entries : entries.filter((e) => e.office === office)),
    [entries, office],
  );
  const results = useMemo(() => searchServices(inOffice, query), [inOffice, query]);
  const searching = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search services</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft">
            <path fill="currentColor" d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.65 3.64a.75.75 0 1 1-1.06 1.06l-3.64-3.65A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you need? Try “cedula”, “business permit”, “birth certificate”"
            autoComplete="off"
            className="w-full rounded-full border border-ink/15 bg-base py-4 pl-13 pr-5 text-base text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-blue"
          />
        </label>
        <label className="relative sm:w-72">
          <span className="sr-only">Filter by office</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft">
            <path fill="currentColor" d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
          </svg>
          <select
            value={office}
            onChange={(e) => setOffice(e.target.value as OfficeKey | "all")}
            className="w-full appearance-none rounded-full border border-ink/15 bg-base py-4 pl-5 pr-11 text-sm font-semibold text-ink outline-none transition-colors focus:border-blue"
          >
            <option value="all">All offices</option>
            {offices.map((o) => (
              <option key={o.key} value={o.key}>
                {o.topic} ({o.short})
              </option>
            ))}
          </select>
        </label>
      </div>

      {!searching && office === "all" && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Popular</span>
          {popular.map((p) => (
            <Link
              key={p.slug}
              href={`/services/${p.slug}`}
              className="rounded-full border border-blue/25 bg-mist/60 px-3.5 py-1.5 text-sm font-semibold text-blue transition-colors hover:border-blue hover:bg-mist"
            >
              {p.name}
            </Link>
          ))}
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {searching ? `${results.length} services match ${query}` : ""}
      </p>

      {searching ? (
        results.length > 0 ? (
          <section>
            <h2 className="text-sm font-semibold text-ink-soft">
              {results.length} {results.length === 1 ? "service matches" : "services match"} “{query.trim()}”
              {office !== "all" && <> in {officeByKey.get(office)?.topic}</>}
            </h2>
            <ServiceGrid entries={results} officeByKey={officeByKey} showOffice />
          </section>
        ) : (
          <NoResults query={query.trim()} onClear={() => setQuery("")} />
        )
      ) : (
        offices
          .filter((o) => office === "all" || o.key === office)
          .map((o) => {
            const list = inOffice.filter((e) => e.office === o.key);
            if (list.length === 0) return null;
            return (
              <section key={o.key} aria-labelledby={`office-${o.key}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink/10 pb-3">
                  <h2 id={`office-${o.key}`} className="font-display text-2xl font-bold text-ink">
                    {o.topic}
                  </h2>
                  <p className="text-sm text-ink-soft">
                    {o.name}
                    {o.phone && <> · <a href={`tel:${o.phone.replace(/[^\d]/g, "")}`} className="font-semibold hover:text-blue">{o.phone}</a></>}
                  </p>
                </div>
                <ServiceGrid entries={list} officeByKey={officeByKey} />
              </section>
            );
          })
      )}
    </div>
  );
}

function ServiceGrid({
  entries,
  officeByKey,
  showOffice = false,
}: {
  entries: ServiceIndexEntry[];
  officeByKey: Map<OfficeKey, Office>;
  showOffice?: boolean;
}) {
  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((e) => (
        <li key={e.slug}>
          <Link
            href={`/services/${e.slug}`}
            className="group flex h-full flex-col rounded-xl border border-ink/10 bg-base p-4 transition-colors hover:border-blue/40 hover:bg-mist/30"
          >
            {showOffice && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue">
                {officeByKey.get(e.office)?.short}
              </span>
            )}
            <span className="font-semibold leading-6 text-ink group-hover:text-blue">{e.name}</span>
            <span className="mt-auto flex flex-wrap items-center gap-2 pt-3 text-xs text-ink-soft">
              <FeeBadge free={e.free} totalFee={e.totalFee} />
              <span>{e.totalTime ? `⏱ ${e.totalTime}` : "Time varies"}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FeeBadge({ free, totalFee }: { free: boolean; totalFee: string | null }) {
  if (free) {
    return <span className="rounded-full bg-mist px-2 py-0.5 font-semibold text-blue">Free</span>;
  }
  const label = totalFee && totalFee !== "None" ? totalFee : "Fees apply";
  return <span className="rounded-full border border-ink/15 px-2 py-0.5 font-semibold text-ink">{label}</span>;
}

function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-ink/20 p-8 text-center">
      <p className="text-ink">No municipal services match “{query}”.</p>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-ink-soft">
        Barangay clearances and barangay certifications come from your barangay
        hall, not the municipal hall. Each barangay&apos;s own Citizen&apos;s Charter is
        listed on the{" "}
        <Link href="/transparency" className="font-semibold text-blue hover:text-blue-deep">
          Transparency page
        </Link>
        .
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-deep"
      >
        Show all services
      </button>
    </div>
  );
}
