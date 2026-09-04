// Step 17: slugify matches rehype-slug/github-slugger's own conventions.
import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "../src/lib/slugify";

describe("slugify", () => {
  it.each([
    ["Related", "related"],
    ["The spec", "the-spec"],
    ["Lecture 1", "lecture-1"],
    ["Marisol Quaye", "marisol-quaye"],
    ["What you will do?", "what-you-will-do"],
    ["Week 4 lecture", "week-4-lecture"],
    ["  Trim me  ", "--trim-me--"],
  ])("slugifies %s to %s", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});

describe("uniqueSlug", () => {
  it("returns the plain slug the first time a heading text is seen", () => {
    const used = new Set<string>();
    expect(uniqueSlug("Related", used)).toBe("related");
  });

  it("suffixes -1, -2, ... on each repeat, per github-slugger", () => {
    const used = new Set<string>();
    expect(uniqueSlug("Related", used)).toBe("related");
    expect(uniqueSlug("Related", used)).toBe("related-1");
    expect(uniqueSlug("Related", used)).toBe("related-2");
  });

  it("records every id it returns, across different source text", () => {
    const used = new Set<string>();
    uniqueSlug("Related", used);
    expect(used.has("related")).toBe(true);
    expect(uniqueSlug("The spec", used)).toBe("the-spec");
  });
});
