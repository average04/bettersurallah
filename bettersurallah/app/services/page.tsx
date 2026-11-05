import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DirectoryView, ServicesDirectory } from "@/components/services-directory";
import { CHARTER, FEEDBACK, OFFICE_BY_KEY, OFFICES, POPULAR_SLUGS, SERVICE_BY_SLUG, SERVICES } from "@/data/services";
import type { ServiceIndexEntry } from "@/lib/services-search";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Requirements, steps, fees and processing times for the services of the Municipality of Surallah, from its 2026 Citizen's Charter.",
};

const ENTRIES: ServiceIndexEntry[] = SERVICES.map((s) => {
  const office = OFFICE_BY_KEY[s.office];
  return {
    slug: s.slug,
    name: s.name,
    officialTitle: s.officialTitle,
    aka: s.aka,
    office: s.office,
    officeText: `${office.name} ${office.short} ${office.topic}`,
    summary: s.summary,
    totalTime: s.totalTime,
    totalFee: s.totalFee,
    free: s.free,
  };
});

const POPULAR = POPULAR_SLUGS.map((slug) => {
  const s = SERVICE_BY_SLUG.get(slug)!;
  return { slug, name: s.name };
});

export default function ServicesPage() {
  const props = { entries: ENTRIES, offices: OFFICES, popular: POPULAR };
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue">Citizen&apos;s Charter 2026</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">Government services</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        What to bring, where to go, how much it costs, and how long it takes
        for {SERVICES.length} services of the Municipality of Surallah, taken
        from the official Citizen&apos;s Charter.
      </p>

      <div className="mt-10">
        <Suspense fallback={<DirectoryView {...props} />}>
          <ServicesDirectory {...props} />
        </Suspense>
      </div>

      <section id="feedback" className="mt-16 grid gap-6 rounded-xl bg-mist/60 p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Feedback & complaints</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            The municipality&apos;s own process, from the charter (page {FEEDBACK.page}).
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm leading-6 text-ink">
          <p>
            <strong>Feedback:</strong> fill out the feedback form in the office
            lobby and drop it in the feedback and complaints box.
          </p>
          <p>
            <strong>Complaints about personnel:</strong> email{" "}
            <a href={`mailto:${FEEDBACK.email}`} className="font-semibold text-blue hover:text-blue-deep">{FEEDBACK.email}</a>{" "}
            with your full name and contact details, what happened (with or
            without evidence), and the name of the person, or submit a written
            complaint in person to the {FEEDBACK.office}.
          </p>
          <p>
            <strong>Follow-ups:</strong>{" "}
            <a href={`tel:${FEEDBACK.phone.replace(/[^\d]/g, "")}`} className="font-semibold text-blue hover:text-blue-deep">{FEEDBACK.phone}</a>
          </p>
        </div>
      </section>

      <p className="mt-8 max-w-3xl text-sm leading-6 text-ink-soft">
        Source:{" "}
        <a href={CHARTER.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue hover:text-blue-deep">
          {CHARTER.title} ↗
        </a>
        . Each service page links to the exact page of the PDF it came from.
        Barangay services such as barangay clearances are in each
        barangay&apos;s own charter, listed on the{" "}
        <Link href="/transparency" className="font-semibold text-blue hover:text-blue-deep">Transparency page</Link>.
      </p>
    </div>
  );
}
