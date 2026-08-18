import { describe, expect, it } from "vitest";
import { searchOfficials } from "./search";
import type { Official } from "@/data/officials";

const sample: Official[] = [
  { name: "Ely T. Todoc", position: "Municipal Budget Officer", group: "department_head", phone: "2383-100" },
  { name: "Haddy S. Glamado", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Buenavista" },
];

describe("searchOfficials", () => {
  it("returns everyone for an empty query", () => {
    expect(searchOfficials(sample, "  ")).toHaveLength(2);
  });
  it("matches name case-insensitively", () => {
    expect(searchOfficials(sample, "todoc")).toHaveLength(1);
  });
  it("matches position and detail", () => {
    expect(searchOfficials(sample, "budget")[0].name).toBe("Ely T. Todoc");
    expect(searchOfficials(sample, "buenavista")[0].name).toBe("Haddy S. Glamado");
  });
  it("returns empty for no match", () => {
    expect(searchOfficials(sample, "zzz")).toHaveLength(0);
  });
  it("matches the group label", () => {
    expect(searchOfficials(sample, "captain")[0].name).toBe("Haddy S. Glamado");
    expect(searchOfficials(sample, "barangay captains")[0].name).toBe("Haddy S. Glamado");
  });
});
