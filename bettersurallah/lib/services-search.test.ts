import { describe, expect, it } from "vitest";
import { normalizeText, searchServices, type ServiceIndexEntry } from "./services-search";

function entry(overrides: Partial<ServiceIndexEntry>): ServiceIndexEntry {
  return {
    slug: "x",
    name: "Service",
    officialTitle: "Issuance of Service",
    aka: [],
    office: "mto",
    officeText: "Municipal Treasurer's Office MTO Taxes, cedula & payments",
    summary: "",
    totalTime: "10 minutes",
    totalFee: null,
    free: false,
    ...overrides,
  };
}

const cedula = entry({ slug: "cedula", name: "Cedula (community tax certificate)", officialTitle: "Issuance of Community Tax Certificate", aka: ["cedula", "CTC"] });
const birth = entry({
  slug: "birth", name: "Birth registration", officialTitle: "Registration of Certificate of Live Birth",
  aka: ["birth certificate", "late registration"], office: "mcro", officeText: "Municipal Civil Registrar's Office MCRO",
  summary: "Parents provide the details needed to register a birth.",
});
const senior = entry({
  slug: "senior", name: "Senior citizen ID & purchase booklet", officialTitle: "Availing of Senior Citizen's ID Card",
  aka: ["OSCA"], office: "mswdo", officeText: "Municipal Social Welfare and Development Office MSWDO",
  summary: "Provide identification for persons aged 60 and above.",
});
const business = entry({
  slug: "business", name: "Business permit (new & renewal)", officialTitle: "Business Permit (BOSS New & Renewal)",
  aka: ["mayor's permit"], office: "bplo", officeText: "Business Permits and Licensing Office BPLO",
  summary: "Requires a community tax certificate (cedula) from the barangay.",
});
const all = [business, cedula, birth, senior];

describe("normalizeText", () => {
  it("lowercases, strips accents and punctuation", () => {
    expect(normalizeText("  Señior Citizen's I.D.! ")).toBe("senior citizen s i d");
  });
});

describe("searchServices", () => {
  it("returns every entry, in order, for an empty query", () => {
    expect(searchServices(all, "   ").map((e) => e.slug)).toEqual(["business", "cedula", "birth", "senior"]);
  });

  it("ranks a name or alias match above a summary mention", () => {
    expect(searchServices(all, "cedula").map((e) => e.slug)).toEqual(["cedula", "business"]);
  });

  it("matches aliases people actually type", () => {
    expect(searchServices(all, "birth certificate")[0].slug).toBe("birth");
    expect(searchServices(all, "OSCA")[0].slug).toBe("senior");
  });

  it("requires every word to match somewhere", () => {
    expect(searchServices(all, "senior id").map((e) => e.slug)).toEqual(["senior"]);
    expect(searchServices(all, "senior permit")).toEqual([]);
  });

  it("is case and accent insensitive", () => {
    expect(searchServices(all, "CÉDULA")[0].slug).toBe("cedula");
  });

  it("matches the office", () => {
    expect(searchServices(all, "civil registrar").map((e) => e.slug)).toEqual(["birth"]);
  });

  it("only matches very short words at the start of a word", () => {
    // "id" must not match inside "provide" or "identification"-like substrings mid-word.
    expect(searchServices([birth, senior], "id").map((e) => e.slug)).toEqual(["senior"]);
  });

  it("prefers a service whose name starts with the query", () => {
    const psa = entry({ slug: "psa", name: "PSA documents on security paper", aka: ["PSA"] });
    const appt = entry({ slug: "appt", name: "Online appointment assistance (PSA, NBI)", aka: ["PSA"] });
    expect(searchServices([appt, psa], "psa").map((e) => e.slug)).toEqual(["psa", "appt"]);
  });

  it("returns nothing when nothing matches", () => {
    expect(searchServices(all, "zzz")).toEqual([]);
  });
});
