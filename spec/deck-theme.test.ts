// Step 33: opening deck slide's bullets must be left-aligned, not centered.
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ASTRO_DIR = resolve("dist/_astro");

/** Every built CSS asset's content, concatenated. */
function builtCss(): string {
  return readdirSync(ASTRO_DIR)
    .filter((name) => name.endsWith(".css"))
    .map((name) => readFileSync(resolve(ASTRO_DIR, name), "utf8"))
    .join("\n");
}

describe("deck theme override", () => {
  it("left-aligns only the first .impact slide's bullets", () => {
    // :first-child is what keeps this off week-12's second (closing) .impact
    // slide; a selector missing it (or targeting the section, not li) fails.
    expect(builtCss()).toMatch(
      /section\.impact:first-child\s+li\s*\{[^}]*text-align:\s*left/,
    );
  });
});
