import type { OfficeKey } from "@/data/services";

/** The slice of a service the /services directory needs on the client. */
export interface ServiceIndexEntry {
  slug: string;
  name: string;
  officialTitle: string;
  aka: string[];
  office: OfficeKey;
  /** Office name, short name and topic, for matching searches like "treasurer". */
  officeText: string;
  summary: string;
  totalTime: string;
  totalFee: string | null;
  free: boolean;
}

export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Higher weight = stronger signal that this is the service the person means.
const WEIGHTS = { name: 6, aka: 5, officialTitle: 4, office: 2, summary: 1 } as const;

function matches(text: string, token: string): boolean {
  if (token.length > 2) return text.includes(token);
  return (" " + text).includes(" " + token);
}

export function searchServices(entries: ServiceIndexEntry[], query: string): ServiceIndexEntry[] {
  const q = normalizeText(query);
  if (!q) return entries;
  const tokens = q.split(" ");

  const scored: { entry: ServiceIndexEntry; score: number }[] = [];
  for (const entry of entries) {
    const fields: [string, number][] = [
      [normalizeText(entry.name), WEIGHTS.name],
      [entry.aka.map(normalizeText).join(" | "), WEIGHTS.aka],
      [normalizeText(entry.officialTitle), WEIGHTS.officialTitle],
      [normalizeText(entry.officeText), WEIGHTS.office],
      [normalizeText(entry.summary), WEIGHTS.summary],
    ];
    let score = 0;
    let everyTokenMatched = true;
    for (const token of tokens) {
      let best = 0;
      for (const [text, weight] of fields) {
        if (weight > best && matches(text, token)) best = weight;
      }
      if (best === 0) {
        everyTokenMatched = false;
        break;
      }
      score += best;
    }
    if (!everyTokenMatched) continue;
    if (fields[0][0].includes(q) || entry.aka.some((a) => normalizeText(a) === q)) score += 10;
    if (fields[0][0].startsWith(q)) score += 3;
    scored.push({ entry, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
    .map((s) => s.entry);
}
