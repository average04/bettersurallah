import { describe, expect, it } from "vitest";
import { CATEGORY_LABELS, documentYears, formatPeso, groupByCategory, sortProjects } from "./format";
import type { GovernmentProject, TransparencyDocument } from "./types";

function doc(overrides: Partial<TransparencyDocument>): TransparencyDocument {
  return {
    id: 1,
    title: "Doc",
    category: "other",
    year: null,
    source_url: null,
    file_url: null,
    description: null,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function project(overrides: Partial<GovernmentProject>): GovernmentProject {
  return {
    id: 1,
    title: "Project",
    barangay: null,
    amount: null,
    funding_source: null,
    year: null,
    status: "unknown",
    description: null,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("formatPeso", () => {
  it("formats amounts as Philippine pesos", () => {
    expect(formatPeso(1500000)).toBe("₱1,500,000.00");
  });
  it("renders a dash for null", () => {
    expect(formatPeso(null)).toBe("—");
  });
});

describe("groupByCategory", () => {
  it("groups in fixed category order and skips empty categories", () => {
    const docs = [
      doc({ id: 1, category: "citizens_charter" }),
      doc({ id: 2, category: "budget" }),
      doc({ id: 3, category: "budget" }),
    ];
    const groups = groupByCategory(docs);
    expect(groups.map(([c]) => c)).toEqual(["budget", "citizens_charter"]);
    expect(groups[0][1]).toHaveLength(2);
  });
});

describe("documentYears", () => {
  it("returns unique years, newest first, ignoring nulls", () => {
    const docs = [
      doc({ id: 1, year: 2024 }),
      doc({ id: 2, year: 2026 }),
      doc({ id: 3, year: 2024 }),
      doc({ id: 4, year: null }),
    ];
    expect(documentYears(docs)).toEqual([2026, 2024]);
  });
});

describe("CATEGORY_LABELS", () => {
  it("labels every category", () => {
    expect(CATEGORY_LABELS.coa_audit).toBe("COA Audit Reports");
    expect(Object.keys(CATEGORY_LABELS)).toHaveLength(6);
  });
});

describe("sortProjects", () => {
  it("sorts by year ascending, nulls last", () => {
    const projects = [
      project({ id: 1, year: 2018 }),
      project({ id: 2, year: null }),
      project({ id: 3, year: 2015 }),
      project({ id: 4, year: 2020 }),
    ];
    const sorted = sortProjects(projects, "year", "asc");
    expect(sorted.map((p) => p.id)).toEqual([3, 1, 4, 2]);
  });

  it("sorts by year descending, nulls last", () => {
    const projects = [
      project({ id: 1, year: 2018 }),
      project({ id: 2, year: null }),
      project({ id: 3, year: 2015 }),
      project({ id: 4, year: 2020 }),
    ];
    const sorted = sortProjects(projects, "year", "desc");
    expect(sorted.map((p) => p.id)).toEqual([4, 1, 3, 2]);
  });

  it("sorts by amount ascending, nulls last", () => {
    const projects = [
      project({ id: 1, amount: 500 }),
      project({ id: 2, amount: null }),
      project({ id: 3, amount: 100 }),
      project({ id: 4, amount: 1000 }),
    ];
    const sorted = sortProjects(projects, "amount", "asc");
    expect(sorted.map((p) => p.id)).toEqual([3, 1, 4, 2]);
  });

  it("sorts by amount descending, nulls last", () => {
    const projects = [
      project({ id: 1, amount: 500 }),
      project({ id: 2, amount: null }),
      project({ id: 3, amount: 100 }),
      project({ id: 4, amount: 1000 }),
    ];
    const sorted = sortProjects(projects, "amount", "desc");
    expect(sorted.map((p) => p.id)).toEqual([4, 1, 3, 2]);
  });

  it("does not mutate the input array", () => {
    const projects = [project({ id: 1, year: 2018 }), project({ id: 2, year: 2015 })];
    const original = [...projects];
    sortProjects(projects, "year", "asc");
    expect(projects).toEqual(original);
  });

  it("returns a stable copy, not the same array reference", () => {
    const projects = [project({ id: 1, year: 2018 })];
    expect(sortProjects(projects, "year", "asc")).not.toBe(projects);
  });
});
