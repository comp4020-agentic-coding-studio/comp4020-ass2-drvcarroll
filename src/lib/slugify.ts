// GitHub-slugger-compatible slug (github-slugger@2.0.0, rehype-slug's own
// dependency): lowercase, strip non-word/non-hyphen/non-space characters,
// hyphenate spaces. Matches rehype-slug's ASCII behaviour for the heading
// text this site actually renders (no divergent id scheme, per D17).
const STRIP_CHARS = /[^\w \-]/g;

/** One page's worth of slug state, for -1/-2 dedup across its headings. */
export type SlugRegistry = Set<string>;

/** Slugify text the way rehype-slug/github-slugger does, with no dedup. */
export function slugify(text: string): string {
  return text.toLowerCase().replace(STRIP_CHARS, "").replace(/ /g, "-");
}

/**
 * Slugify text and dedupe against ids already used on the page, appending
 * -1, -2, ... on repeat --- the same suffixing rehype-slug applies to a
 * repeated heading. Records the id it returns into `used`, so pass one
 * registry per page/document and reuse it across every heading on it.
 */
export function uniqueSlug(text: string, used: SlugRegistry): string {
  const base = slugify(text);
  let id = base;
  let suffix = 0;
  while (used.has(id)) {
    suffix += 1;
    id = `${base}-${suffix}`;
  }
  used.add(id);
  return id;
}
