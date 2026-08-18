import type { Metadata } from "next";
import { ProjectsTable } from "@/components/projects-table";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Government projects in Surallah, South Cotabato — amounts, funding sources, and status.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue">Where the money goes</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">Projects</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Government projects in Surallah with amounts, funding sources, and
        status — starting with DILG-funded projects published by the
        municipality, and growing as new records are added.
      </p>
      <div className="mt-10">
        <ProjectsTable />
      </div>
    </div>
  );
}
