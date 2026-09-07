import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
  body?: string;
}

interface CourseApi {
  course: {
    startDate: string;
    endDate: string;
  };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const dateOnly = (value: unknown): string => String(value).slice(0, 10);

describe("course data integrity", () => {
  // Step 20 / BUILD_PLAN §7 risk: courseMeta now spans the real 2027-07-27
  // teaching period, but sessions/lectures/assessments still carry Steps
  // 1-19's placeholder Feb-May dates. Expected red until Steps 23/24/26
  // replace those placeholders with the SLOP4000 content's real dates.
  it("keeps every scheduled date inside the teaching period", () => {
    const dated = api.nodes.filter((node) =>
      ["sessions", "lectures", "assessments"].includes(node.type),
    );
    for (const node of dated) {
      const raw = node.type === "assessments" ? node.meta?.due : node.meta?.date;
      const date = dateOnly(raw);
      expect(date, `${node.id} has no date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(date >= api.course.startDate, `${node.id} falls before teaching starts`).toBe(true);
      expect(date <= api.course.endDate, `${node.id} falls after teaching ends`).toBe(true);
    }
  });

  it("gives every assessment a non-empty brief", () => {
    const assessments = api.nodes.filter((node) => node.type === "assessments");
    expect(assessments.length).toBeGreaterThan(0);
    for (const node of assessments) {
      const brief = node.meta?.brief;
      expect(typeof brief === "string" && brief.trim().length > 0, `${node.id} has no brief`).toBe(
        true,
      );
    }
  });

  it("resolves every session's lecture/lab/assignment reference", () => {
    const idsOf = (type: string) =>
      new Set(api.nodes.filter((node) => node.type === type).map((node) => node.id.split("/")[1]));
    const lectureIds = idsOf("lectures");
    const assessmentIds = idsOf("assessments");
    const sessions = api.nodes.filter((node) => node.type === "sessions");
    expect(sessions.length).toBe(12);

    for (const node of sessions) {
      const lecture = node.meta?.lecture;
      expect(
        typeof lecture === "string" && lectureIds.has(lecture),
        `${node.id} lecture "${lecture}" does not resolve`,
      ).toBe(true);

      // Optional since Step 22 (D22): absent on Weeks 1 and 12, the two
      // weeks the brief's ten labs don't cover.
      const lab = node.meta?.lab;
      if (lab !== undefined) {
        expect(
          typeof lab === "string" && assessmentIds.has(lab),
          `${node.id} lab "${lab}" does not resolve`,
        ).toBe(true);
      }

      const assignment = node.meta?.assignment;
      if (assignment !== undefined) {
        expect(
          typeof assignment === "string" && assessmentIds.has(assignment),
          `${node.id} assignment "${assignment}" does not resolve`,
        ).toBe(true);
      }
    }
  });

  // Step 22 / D22: sessions.lab is now optional. This is the schema-level
  // contract test — a successful build already proves both shapes parse
  // (weeks with lab present, weeks 1/12 with it absent); this asserts the
  // exact split rather than just "the build didn't crash".
  it("gives every week 2-11 a lab and no session a lab-11/lab-12 reference", () => {
    const sessions = api.nodes.filter((node) => node.type === "sessions");
    for (const node of sessions) {
      const week = node.meta?.week;
      const lab = node.meta?.lab;
      if (week === 1 || week === 12) {
        expect(lab, `${node.id} (week ${week}) should have no lab`).toBeUndefined();
      } else {
        expect(typeof lab === "string", `${node.id} (week ${week}) should have a lab`).toBe(true);
      }
      if (typeof lab === "string") {
        expect(lab, `${node.id} references the unpublished lab-11/lab-12`).not.toMatch(
          /^lab-(11|12)$/,
        );
      }
    }
  });
});
