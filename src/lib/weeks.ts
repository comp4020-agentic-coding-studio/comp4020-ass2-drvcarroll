// Pure row-building logic for the left gutter's week rail (WeekRail.astro).
// Reads only what is passed in — no collection or DOM access here.

/** The subset of a `sessions` entry this module needs. */
export interface SessionRef {
  week: number;
  id: string;
}

export interface WeekRow {
  week: number | "exam";
  label: string;
  href: string | null;
  current: boolean;
}

const TOTAL_WEEKS = 12;

/**
 * Builds the week rail's 13 rows: weeks 1-12, each linked to its `sessions`
 * entry when one exists (`href: null` otherwise, rendered as inert text),
 * plus a trailing Exam row. `examHref` is the assessments-collection link
 * for the Exam row, resolved by the caller — `null` until that entry exists.
 */
export function buildWeekRows(
  sessions: SessionRef[],
  currentPath: string,
  examHref: string | null = null,
): WeekRow[] {
  const byWeek = new Map(sessions.map((session) => [session.week, session]));

  const weekRows: WeekRow[] = Array.from({ length: TOTAL_WEEKS }, (_, index) => {
    const week = index + 1;
    const session = byWeek.get(week);
    const href = session ? `/sessions/${session.id}/` : null;
    return { week, label: `Week ${week}`, href, current: href !== null && href === currentPath };
  });

  return [...weekRows, { week: "exam", label: "Exam", href: examHref, current: false }];
}
