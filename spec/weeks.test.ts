import { describe, expect, it } from "vitest";
import { buildWeekRows, type SessionRef } from "../src/lib/weeks";

const sessions: SessionRef[] = [
  { week: 1, id: "01-getting-started" },
  { week: 2, id: "02-first-review" },
  { week: 5, id: "05-midpoint" },
];

describe("buildWeekRows", () => {
  it("returns exactly 12 rows, weeks 1-12 in order, no exam row", () => {
    const rows = buildWeekRows(sessions, "/");
    expect(rows).toHaveLength(12);
    expect(rows.map((row) => row.week)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });

  it("links weeks present in the sessions collection", () => {
    const rows = buildWeekRows(sessions, "/");
    expect(rows[0]).toMatchObject({ href: "/sessions/01-getting-started/" });
    expect(rows[4]).toMatchObject({ href: "/sessions/05-midpoint/" });
  });

  it("gives a missing week null href instead of a guessed link", () => {
    const rows = buildWeekRows(sessions, "/");
    expect(rows[2]).toMatchObject({ week: 3, href: null });
    expect(rows[11]).toMatchObject({ week: 12, href: null });
  });

  it("marks the row matching currentPath as current", () => {
    const rows = buildWeekRows(sessions, "/sessions/02-first-review/");
    expect(rows[1]).toMatchObject({ week: 2, current: true });
    expect(rows[0]).toMatchObject({ week: 1, current: false });
  });

  it("never marks an href-less row as current", () => {
    const rows = buildWeekRows(sessions, "/sessions/does-not-exist/");
    expect(rows.every((row) => !row.current)).toBe(true);
  });
});
