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

      const lab = node.meta?.lab;
      expect(
        typeof lab === "string" && assessmentIds.has(lab),
        `${node.id} lab "${lab}" does not resolve`,
      ).toBe(true);

      const assignment = node.meta?.assignment;
      if (assignment !== undefined) {
        expect(
          typeof assignment === "string" && assessmentIds.has(assignment),
          `${node.id} assignment "${assignment}" does not resolve`,
        ).toBe(true);
      }
    }
  });
});
