// Step 21 / BUILD_PLAN.md §6: the rename from idris-fenn/marisol-quaye to
// ivan-sidorov/fulan-al-fulani must leave no teachers: reference dangling.
// This is the same fact pnpm build's dangling-reference checker enforces,
// made explicit and fast to run without a full astro build.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

describe("people references", () => {
  it("resolves every session/lecture teachers entry to an existing person", () => {
    const peopleIds = new Set(
      api.nodes.filter((node) => node.type === "people").map((node) => node.id.split("/")[1]),
    );
    expect(peopleIds.size).toBeGreaterThan(0);

    const teams = api.nodes.filter((node) => node.type === "sessions" || node.type === "lectures");
    expect(teams.length).toBeGreaterThan(0);

    for (const node of teams) {
      const teachers = node.meta?.teachers;
      expect(Array.isArray(teachers) && teachers.length > 0, `${node.id} has no teachers`).toBe(
        true,
      );
      for (const teacher of teachers as unknown[]) {
        expect(
          typeof teacher === "string" && peopleIds.has(teacher),
          `${node.id} teacher "${teacher}" does not resolve to a person`,
        ).toBe(true);
      }
    }
  });
});
