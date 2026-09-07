// Pure ordering logic for the Timeline page's spine (TimelineSpine.astro).
// Ordering is the spine's job, not a bead's — TimelineBead never sees its
// own position (BUILD_PLAN.md section 2).

/** The subset of an `assessments` entry this module needs. */
export interface AssessmentRef {
  id: string;
}

// Literal semester order from the brief: Labs 1-4, Assignment 1, Labs 5-8,
// Assignment 2, Labs 9-10, Final Exam — 13 beads (D9). Kept as data here
// rather than derived from `week`/`due` because several placeholder
// entries share a `week` value, so a sort key can't reproduce this order
// on its own. Labs 11-12 are excluded (Step 22, D22): the brief supplies
// exactly ten real labs, and orderBeads already drops any id with no
// matching (published) entry, so removing them here keeps this list
// exactly the specified order rather than a superset filtered elsewhere.
export const BEAD_ORDER: readonly string[] = [
  "lab-01",
  "lab-02",
  "lab-03",
  "lab-04",
  "assignment-1",
  "lab-05",
  "lab-06",
  "lab-07",
  "lab-08",
  "assignment-2",
  "lab-09",
  "lab-10",
  "final-exam",
];

/**
 * Filters and reorders `entries` to `BEAD_ORDER`. An id in the order with
 * no matching entry is skipped (never invents a bead); an entry not named
 * in the order is dropped (the spine shows graded deliverables only).
 */
export function orderBeads<T extends AssessmentRef>(entries: T[]): T[] {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  return BEAD_ORDER.map((id) => byId.get(id)).filter((entry): entry is T => entry !== undefined);
}
