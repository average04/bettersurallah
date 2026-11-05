import { describe, expect, it } from "vitest";
import { OFFICE_BY_KEY, OFFICES, POPULAR_SLUGS, SERVICE_BY_SLUG, SERVICES } from "./services";

describe("services data", () => {
  it("has the services from the 2026 charter", () => {
    expect(SERVICES.length).toBeGreaterThanOrEqual(90);
  });

  it("uses unique, URL-safe slugs", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("assigns every service to a known office, and every office has services", () => {
    for (const s of SERVICES) expect(OFFICE_BY_KEY[s.office]).toBeDefined();
    for (const o of OFFICES) expect(SERVICES.some((s) => s.office === o.key)).toBe(true);
  });

  it("gives every service requirements, steps and a valid PDF page", () => {
    for (const s of SERVICES) {
      expect(s.name, s.slug).not.toBe("");
      expect(s.requirements.flatMap((g) => g.items).length, s.slug).toBeGreaterThan(0);
      expect(s.steps.length, s.slug).toBeGreaterThan(0);
      for (const step of s.steps) expect(step.you, s.slug).not.toBe("");
      expect(s.page).toBeGreaterThanOrEqual(1);
      expect(s.endPage).toBeGreaterThanOrEqual(s.page);
      expect(s.endPage).toBeLessThanOrEqual(233);
    }
  });

  it("only marks a service free when no step charges a fee", () => {
    for (const s of SERVICES.filter((s) => s.free)) {
      expect(s.steps.every((st) => st.fee === "None"), s.slug).toBe(true);
    }
  });

  it("points every popular shortcut at a real service", () => {
    for (const slug of POPULAR_SLUGS) expect(SERVICE_BY_SLUG.has(slug), slug).toBe(true);
  });
});
