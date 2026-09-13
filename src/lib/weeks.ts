// Pure row-building logic for the left gutter's week rail (WeekRail.astro).
// Reads only what is passed in — no collection or DOM access here.
import { withBase } from "astro-theme-university/url";

/** The subset of a `sessions` entry this module needs. */
export interface SessionRef {
  week: number;
  id: string;
}

export interface WeekRow {
  week: number;
  label: string;
  href: string | null;
  current: boolean;
}

const TOTAL_WEEKS = 12;

/**
 * Builds the week rail's 12 rows: weeks 1-12, each linked to its `sessions`
 * entry when one exists (`href: null` otherwise, rendered as inert text).
 * The exam period is not a row here — reachable only from the Timeline (D12).
 */
export function buildWeekRows(sessions: SessionRef[], currentPath: string): WeekRow[] {
  const byWeek = new Map(sessions.map((session) => [session.week, session]));

  return Array.from({ length: TOTAL_WEEKS }, (_, index) => {
    const week = index + 1;
    const session = byWeek.get(week);
    const href = session ? withBase(`/sessions/${session.id}/`) : null;
    return { week, label: `Week ${week}`, href, current: href !== null && href === currentPath };
  });
}
