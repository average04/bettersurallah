import { GROUP_LABELS, type Official } from "@/data/officials";

export function searchOfficials(
  officials: Official[],
  query: string,
): Official[] {
  const q = query.trim().toLowerCase();
  if (!q) return officials;
  return officials.filter((o) =>
    [o.name, o.position, o.detail ?? "", o.phone ?? "", GROUP_LABELS[o.group]].some((field) =>
      field.toLowerCase().includes(q),
    ),
  );
}
