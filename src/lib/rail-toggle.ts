export interface RailState {
  open: boolean;
}

export type RailAction = "toggle" | "open" | "close";

/** Pure open/closed transition for a gutter rail — no DOM access. */
export function nextRailState(current: RailState, action: RailAction): RailState {
  switch (action) {
    case "open":
      return { open: true };
    case "close":
      return { open: false };
    case "toggle":
      return { open: !current.open };
  }
}
