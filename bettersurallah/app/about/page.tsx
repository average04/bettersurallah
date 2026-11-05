import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "What BetterSurallah is, who runs it, and where the data comes from.",
};

const SOURCES = [
  { name: "Municipality of Surallah official website", url: "https://surallah.gov.ph/" },
  { name: "DILG Full Disclosure Policy Portal", url: "https://fdpp.dilg.gov.ph/" },
  { name: "Commission on Audit annual audit reports", url: "https://www.coa.gov.ph/" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue">About</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">
        What is BetterSurallah?
      </h1>

      <div className="mt-8 flex flex-col gap-6 text-lg leading-8 text-ink-soft">
        <p>
          BetterSurallah is a citizen-built website that gathers public
          information about the Municipality of Surallah, South Cotabato —
          transparency documents, government projects, and the people in
          office — and makes it easy to find, read, and verify.
        </p>
        <div aria-hidden="true" className="flex h-56 items-center justify-center rounded-xl bg-mist text-sm font-semibold text-ink-soft">
          Photo coming soon
        </div>
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold text-ink">Where the data comes from</h2>
      <ul className="mt-4 flex flex-col gap-2">
        {SOURCES.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue hover:text-blue-deep">
              {s.name} ↗
            </a>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-display text-2xl font-bold text-ink">Corrections</h2>
      <p className="mt-3 text-lg leading-8 text-ink-soft">
        Spotted something wrong or outdated? Contact details are coming soon —
        for now, corrections land in the next update.
      </p>
    </div>
  );
}
