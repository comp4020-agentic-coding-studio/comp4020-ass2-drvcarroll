import { describe, expect, it } from "vitest";
import { nextRailState } from "../src/lib/rail-toggle";

describe("nextRailState", () => {
  it("toggles closed to open", () => {
    expect(nextRailState({ open: false }, "toggle")).toEqual({ open: true });
  });

  it("toggles open to closed", () => {
    expect(nextRailState({ open: true }, "toggle")).toEqual({ open: false });
  });

  it("open is idempotent from either starting state", () => {
    expect(nextRailState({ open: false }, "open")).toEqual({ open: true });
    expect(nextRailState({ open: true }, "open")).toEqual({ open: true });
  });

  it("close is idempotent from either starting state", () => {
    expect(nextRailState({ open: true }, "close")).toEqual({ open: false });
    expect(nextRailState({ open: false }, "close")).toEqual({ open: false });
  });

  it("does not mutate the state passed in", () => {
    const state = { open: false };
    nextRailState(state, "toggle");
    expect(state).toEqual({ open: false });
  });
});
