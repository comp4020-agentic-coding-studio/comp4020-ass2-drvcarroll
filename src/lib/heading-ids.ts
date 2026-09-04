// Step 18 (D18): fillMissingIds relocated here so both the build-time
// integration and the dev-time middleware share one implementation ---
// framework/build-agnostic, DOM-in/DOM-out only.
import { uniqueSlug } from "./slugify";

/** Adds a missing id to one heading, deduped against ids already on the page. */
export function fillMissingIds(document: Document): boolean {
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
