import { describe, expect, it } from "vitest";
import { sanitizeExperienceInput, sanitizeProjectInput } from "./validation";

describe("sanitizeProjectInput", () => {
  it("rejects a missing id", () => {
    const result = sanitizeProjectInput({ title: "Test" });
    expect(result.error).toBe("id is required");
  });

  it("rejects a missing title", () => {
    const result = sanitizeProjectInput({ id: "test" });
    expect(result.error).toBe("title is required");
  });

  it("accepts minimal valid input and fills in defaults", () => {
    const result = sanitizeProjectInput({ id: "test", title: "Test" });
    expect(result.data).toEqual({
      id: "test",
      title: "Test",
      category: [],
      description: null,
      images: [],
      technology: [],
      github: null,
      demo: null,
      video: null,
      sort_order: 0,
    });
  });

  it("normalizes full input, trims strings, and drops unknown categories", () => {
    const result = sanitizeProjectInput({
      id: "  test  ",
      title: "  Test  ",
      category: ["web", "not-a-category", "mobile"],
      description: "desc",
      images: ["a.png", "", "b.png"],
      technology: ["React", "Next.js"],
      github: "https://github.com/x",
      demo: "",
      video: "",
      sort_order: 5,
    });
    expect(result.data).toEqual({
      id: "test",
      title: "Test",
      category: ["web", "mobile"],
      description: "desc",
      images: ["a.png", "b.png"],
      technology: ["React", "Next.js"],
      github: "https://github.com/x",
      demo: null,
      video: null,
      sort_order: 5,
    });
  });

  it("rejects a non-object body", () => {
    const result = sanitizeProjectInput(null);
    expect(result.error).toBe("Request body must be an object");
  });
});

describe("sanitizeExperienceInput", () => {
  it("rejects a missing name", () => {
    const result = sanitizeExperienceInput({});
    expect(result.error).toBe("name is required");
  });

  it("accepts minimal valid input and fills in defaults", () => {
    const result = sanitizeExperienceInput({ name: "Acme" });
    expect(result.data).toEqual({
      name: "Acme",
      logo: null,
      additional: null,
      type: null,
      year: null,
      duration: null,
      link: null,
      sort_order: 0,
    });
  });

  it("keeps a valid type value", () => {
    const result = sanitizeExperienceInput({ name: "Acme", type: "Contract" });
    expect(result.data?.type).toBe("Contract");
  });

  it("nulls out an invalid type value instead of rejecting the request", () => {
    const result = sanitizeExperienceInput({ name: "Acme", type: "Freelance" });
    expect(result.data?.type).toBeNull();
  });
});
