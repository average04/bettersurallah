import { describe, expect, it } from "vitest";
import { CATEGORY_LABELS, documentYears, formatPeso, groupByCategory } from "./format";
import type { TransparencyDocument } from "./types";

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
