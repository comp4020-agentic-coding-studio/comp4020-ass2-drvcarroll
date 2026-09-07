import { describe, expect, it } from "vitest";
import { BEAD_ORDER, orderBeads, type AssessmentRef } from "../src/lib/timeline";

describe("orderBeads", () => {
  it("reorders entries to the documented 13-bead semester order", () => {
    const shuffled: AssessmentRef[] = [
      { id: "final-exam" },
      { id: "lab-02" },
      { id: "assignment-1" },
      { id: "lab-01" },
    ];
    expect(orderBeads(shuffled).map((entry) => entry.id)).toEqual([
      "lab-01",
      "lab-02",
      "assignment-1",
      "final-exam",
    ]);
  });

  it("drops an ordered id with no matching entry, rather than inventing one", () => {
    const entries: AssessmentRef[] = [{ id: "lab-01" }];
    expect(orderBeads(entries)).toEqual([{ id: "lab-01" }]);
  });

  it("drops an entry not named in the bead order", () => {
    const entries: AssessmentRef[] = [{ id: "lab-01" }, { id: "final-project" }];
    expect(orderBeads(entries).map((entry) => entry.id)).toEqual(["lab-01"]);
  });

  it("returns all 13 documented ids when every entry exists", () => {
    const entries = BEAD_ORDER.map((id) => ({ id }));
    expect(orderBeads(entries).map((entry) => entry.id)).toEqual(BEAD_ORDER);
    expect(BEAD_ORDER).toHaveLength(13);
  });

  // Step 22 / D22: lab-11/lab-12 are unpublished and must never resurface
  // as beads even if a caller passes them in.
  it("drops lab-11 and lab-12 even when present in the input", () => {
    const entries: AssessmentRef[] = [
      { id: "lab-10" },
      { id: "lab-11" },
      { id: "lab-12" },
      { id: "final-exam" },
    ];
    expect(orderBeads(entries).map((entry) => entry.id)).toEqual(["lab-10", "final-exam"]);
  });
});
