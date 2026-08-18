import type { DocumentCategory, GovernmentProject, TransparencyDocument } from "./types";

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  budget: "Budget",
  coa_audit: "COA Audit Reports",
  full_disclosure: "Full Disclosure",
  procurement: "Procurement",
  citizens_charter: "Citizen's Charter",
  other: "Other Documents",
};

const CATEGORY_ORDER: DocumentCategory[] = [
  "budget",
  "coa_audit",
  "full_disclosure",
  "procurement",
  "citizens_charter",
  "other",
];

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

export function formatPeso(amount: number | null): string {
  return amount === null ? "—" : peso.format(amount);
}

export function groupByCategory(
  docs: TransparencyDocument[],
): [DocumentCategory, TransparencyDocument[]][] {
  return CATEGORY_ORDER.map(
    (category) =>
      [category, docs.filter((d) => d.category === category)] as [
        DocumentCategory,
        TransparencyDocument[],
      ],
  ).filter(([, list]) => list.length > 0);
}

export function documentYears(docs: TransparencyDocument[]): number[] {
  const years = docs
    .map((d) => d.year)
    .filter((y): y is number => y !== null);
  return [...new Set(years)].sort((a, b) => b - a);
}

export function sortProjects(
  projects: GovernmentProject[],
  key: "year" | "amount",
  dir: "asc" | "desc",
): GovernmentProject[] {
  return [...projects].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    return dir === "asc" ? av - bv : bv - av;
  });
}
