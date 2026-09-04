// Pure ordering logic for the Timeline page's spine (TimelineSpine.astro).
// Ordering is the spine's job, not a bead's — TimelineBead never sees its
// own position (BUILD_PLAN.md section 2).

/** The subset of an `assessments` entry this module needs. */
export interface AssessmentRef {
  id: string;
}

// Literal semester order from the brief: Labs 1-4, Assignment 1, Labs 5-8,
// Assignment 2, Labs 9-12, Final Exam — 15 beads. Kept as data here rather
// than derived from `week`/`due` because several placeholder entries share
// a `week` value (BUILD_PLAN.md D9), so a sort key can't reproduce this
// order on its own. Labs 11-12 (Step 14, D10) extend the run of labs that
// already precedes Final Exam, rather than interleaving elsewhere, since
// no other placement is named by the brief.
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
  "lab-11",
  "lab-12",
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
