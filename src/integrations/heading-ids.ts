// Step 17 (D17): gives every #main h2/h3 a real id, including the ones
// rehype-slug never touches --- Card, RelatedContent and SpecList (all in
// astro-course-university/astro-theme-university, not editable here) render
// their heading straight into HTML with no id and no id-passthrough prop, so
// the only place left to add one is a post-build pass over the built HTML
// itself. One pass, one shared slugify call site, whole-page dedup against
// every id already on the document (markdown headings included) so a
// component heading can never collide with one rehype-slug already assigned.
// Build-only (astro:build:done): dist/ is what CI deploys and what gets
// marked, so that is the output this rewrites --- see this step's Amendment
// for why a dev-server equivalent was tried and dropped.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import type { AstroIntegration } from "astro";
import { uniqueSlug } from "../lib/slugify";

function allHtmlFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = resolve(dir, entry);
    if (statSync(path).isDirectory()) files.push(...allHtmlFiles(path));
    else if (entry.endsWith(".html")) files.push(path);
  }
  return files;
}

/** Adds a missing id to one heading, deduped against ids already on the page. */
function fillMissingIds(document: Document): boolean {
  const main = document.querySelector("#main");
  if (!main) return false;

  const used = new Set([...document.querySelectorAll("[id]")].map((el) => el.id));
  let changed = false;
  for (const heading of main.querySelectorAll("h2, h3")) {
    if (heading.id) continue;
    heading.id = uniqueSlug(heading.textContent?.trim() ?? "", used);
    changed = true;
  }
  return changed;
}

export default function headingIds(): AstroIntegration {
  return {
    name: "heading-ids",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const root = fileURLToPath(dir);
        for (const file of allHtmlFiles(root)) {
          const html = readFileSync(file, "utf8");
          const dom = new JSDOM(html);
          if (fillMissingIds(dom.window.document)) {
            writeFileSync(file, dom.serialize());
          }
        }
      },
    },
  };
}
