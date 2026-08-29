// Pure DOM-reading logic for the right gutter's page index (PageIndex.astro).
// Reads only the rendered document passed in — no collection access, no
// mutation (BUILD_PLAN.md D4, section 2's "must not read any collection").

export interface PageIndexEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Reads every `h2`/`h3` inside `#main`, in document order. `id` is read as
 * rehype-slug left it, never generated here — a heading with no `id` (e.g.
 * hand-written markup rehype-slug never touched) comes back with `id: ""`
 * rather than an invented one that could collide with its scheme.
 */
export function buildPageIndex(root: Document | Element): PageIndexEntry[] {
  const headings = root.querySelectorAll("#main h2, #main h3");

  return [...headings].map((heading) => ({
    id: heading.id,
    text: headingText(heading),
    level: heading.tagName === "H2" ? 2 : 3,
  }));
}

// rehype-autolink-headings appends a decorative, aria-hidden "#" anchor
// inside every heading (astro-theme-university/markdown.ts) — a real DOM
// child, so a plain textContent read would trail every entry with "#".
function headingText(heading: Element): string {
  const clone = heading.cloneNode(true) as Element;
  clone.querySelector(".at-heading-anchor")?.remove();
  return clone.textContent?.trim() ?? "";
}
