# Build plan --- structural scaffold

Named `BUILD_PLAN.md` rather than `build.md` because `CLAUDE.md` fixes the
filename and the seven sections below. Content is deliberately last: every step
here ships empty or placeholder text, and the course itself lands after the
frame stands up.

## 1. What this is

The course website for one Slop University course, seen as a student sees it. A
reader arrives on a page and is never more than one click from any teaching
week, because a sticky rail in the left gutter lists all of them on every page.
A second rail in the right gutter indexes the page currently open, so a long
week page is navigable without scrolling to find out what is on it. The top
navigation carries only three destinations --- Timeline, People, Policies ---
because the week rail has absorbed the job that a "Sessions" or "Lectures"
index page would otherwise do.

The Timeline page is the assessment view: a vertical spine on the content's left
edge with a bead for each graded deliverable, read top to bottom as the
semester. It replaces the assessments index.

Everything is built on the fixed platform: Astro, `astro-theme-university`
wearing `astro-theme-slop`, four content collections that stay as they arrived.
This plan adds pages, components, navigation and styling --- all of which the
README marks as yours --- and changes no part of the content model or build
pipeline.

## 2. The entities, and how they interact

**`GutterRail`** --- the shared shell. Owns the floating-box look (border,
radius, background, padding), the sticky behaviour, and the mobile
toggle-and-slide-out. Knows nothing about what it contains; it takes a label,
a side (`start` or `end`) and a slot.

**`WeekRail`** --- the left rail's contents. Thirteen rows: Weeks 1--12 linking
to their session pages, plus a visually distinct Exam period row. Reads the
`sessions` collection so a week that exists is a link and a week that does not
is inert text. Marks the current week with `aria-current`.

**`PageIndex`** --- the right rail's contents. The headings of the page
currently open, as in-page anchor links. Populated at runtime from the rendered
`#main`, so it works identically on MDX pages, collection pages and hand-written
`.astro` pages with no per-page wiring.

**`TimelineSpine`** --- the Timeline page's beaded rule. Owns the thick vertical
line and positions its children on it.

**`TimelineBead`** --- one graded deliverable: the circle that intersects the
spine, a label, and an empty description span.

**`PageLayout`** --- mounts both rails around the theme's `<slot />` and sets the
gutter tokens. The single place that knows the page has two rails.

**`site-config.ts`** --- the three nav links and the acknowledgement text.

Flows:

- `PageLayout` renders `GutterRail(start) > WeekRail` and
  `GutterRail(end) > PageIndex` alongside the theme's main slot.
- `WeekRail` reads `sessions` at build time; `Astro.url.pathname` decides which
  row is current.
- `PageIndex` reads the DOM on load; nothing passes it props.
- `TimelineSpine` reads the `assessments` collection, orders it with the pure
  `orderBeads` against the literal 13-id `BEAD_ORDER` (D9, not a `week`/`due`
  sort), and emits one `TimelineBead` per ordered entry.
- `Footer` reads `acknowledgement` from `siteConfig` --- no component of ours.

Couplings deliberately absent:

- `GutterRail` must not know about weeks or headings. Two different payloads
  share one shell; if the shell starts branching on its contents, the split was
  wrong.
- `PageIndex` must not read any collection. Its only input is the page it is on.
- `WeekRail` must not read page content. It is identical on every page except
  for which row is current, which is what makes it cacheable and predictable.
- `TimelineBead` must not know its position. The spine places it.

## 3. The published spec, sorted

Mechanically checkable:

- **S1** deployed and live at the public Pages URL, both marking viewports
- **S2** one niche course at Slop University, `SLOPxxxx` keeping the assigned
  three digits
- **S3** at least one lecture carries a real deck, linked from its page
- **S4** assessment adds up to 100%
- **S5** own checks in `spec/`; `pnpm check` and `pnpm check:evidence` pass

Judged by a person:

- **J1** the course is genuinely niche and coherent across the semester
- **J2** the prose has a voice rather than reading as generated filler
- **J3** the record reads as work that grew --- **S6**, process evidence, is
  45% of the mark and is judged, not tested

This plan serves S1 (both viewports, via the mobile rail behaviour), S3 and S4
(by keeping the detail routes the spec needs), and S5. It touches no content, so
it serves none of J1--J2 --- those arrive with the course.

## 4. Decisions taken

**D1. Thirteen rows, twelve weeks.** `content.config.ts` caps `week` at 12 and
the spec requires exactly twelve dated teaching weeks, so a Week 13 entry fails
both. The rail shows thirteen rows: Weeks 1--12 from the collection, plus an
Exam period row that is a link to the final assessment rather than a session.
The design intent survives; the schema and the spec are untouched.

**D2. Delete the index pages, keep the collections and detail routes.** The
README fixes all four collections because the programs-and-courses page ingests
them. Nothing in it fixes the *pages*, and navigation is explicitly ours. So
`/sessions/`, `/lectures/` and `/assessments/` index pages go; `[slug].astro`
routes for all three stay. This is what makes the removal safe: S3 needs a
lecture page to link its deck from, and the timeline beads need assessment pages
to point at.

**D3. Week pages are the `sessions` collection.** Rather than invent a parallel
`weeks` collection, the week rail links to session entries, which already carry
`week` and `date` and already appear in the API. Fewer moving parts, and the
data-integrity check keeps working unchanged.

**D4. `PageIndex` is populated client-side.** Headings are only available to a
layout when a page passes them, and the theme auto-wraps MDX pages through
`defaultLayout` without doing so. Reading `#main h2, #main h3` on load is the
one approach that behaves identically on every page type with no per-page
wiring. `rehype-slug` already puts an `id` on every markdown heading, so the
anchors exist. The cost is honest: the index is absent without JavaScript, and a
JSDOM test cannot see it in the built HTML. So the spec test asserts the
contract that makes the index possible --- every `h2`/`h3` in `dist` carries an
`id`, and the mount point is present --- rather than the generated list.

**D5. The spine is the timeline page's own element, not `body::after`.** The
theme already draws a 1px accent rule at the content's left edge from `body`,
which is global and cannot be thickened for one page without a body-level
override. The Timeline page suppresses it and draws its own thicker rule inside
the page, so the beads and the line they intersect are positioned by the same
element.

**D6. The acknowledgement is configuration.** `Footer.astro` takes an
`acknowledgement` prop and renders it above the licence and the legal row that
holds the theme toggle --- the position asked for. Writing our own component
would duplicate a theme feature and land it in the wrong place.

**D7. Rail width is a clamp, not `15vw`.** `clamp(11rem, 15vw, 15rem)`. At
`15vw` a narrow laptop gives a 150px rail that wraps "Week 10" onto two lines,
and an ultrawide gives a 300px rail of mostly whitespace.

**D8. "Manipulation, not narration" and "Overall direction" target an
interactive artefact this deliverable is not.** Both sections in `CLAUDE.md`
were written against a prior week's simulation/instrument brief --- knobs,
readouts, undo, a model the visitor pokes. A2 is twenty-odd pages a student
reads for ten minutes; nothing in this scaffold is a parameter with a readout,
and treating the week rail or page index as one would invent controls the
brief never asked for. Every review pass below applies "Never remove what you
were not asked to remove", "Compress, then condense" and the general interface
rules in full; it treats "Manipulation, not narration" and "Overall direction"
as not applicable to this repo and does not check steps against them. Flagged
here rather than silently skipped, per the harness's own instruction to say
what would be cut and why.

**D9. The spine's order is an explicit id list, not a `week`/`due` sort.**
`src/lib/timeline.ts` exports `BEAD_ORDER`, the 13 assessment ids in the
brief's literal sequence, and a pure `orderBeads(entries)` that filters and
reorders any entries array to match it. Several of Step 6's placeholder
labs deliberately share a `week` value (see that step's amendment), so a
sort key over `week`/`due` cannot reproduce the brief's order on its own;
an explicit list is the one representation that is exactly the specified
order, independent of what placeholder scheduling data an entry happens to
carry. `TimelineBead` still never sees its own position — `orderBeads`
does the ordering, `TimelineSpine` maps the result, in the same
division of labour as `buildWeekRows`/`WeekRail`.

## 5. Architecture

```
src/
  layouts/
    PageLayout.astro        # mounts both rails; sets gutter tokens
  components/
    GutterRail.astro        # shared shell: box, sticky, mobile toggle
    WeekRail.astro          # 13 rows, reads sessions
    PageIndex.astro         # mount point + the script that fills it
    TimelineSpine.astro     # thick rule, places beads
    TimelineBead.astro      # circle + label + empty description span
  lib/
    weeks.ts                # buildWeekRows(sessions) -> WeekRow[]
    page-index.ts           # the DOM-reading function, imported by the script
    timeline.ts             # BEAD_ORDER, orderBeads(entries) -> ordered entries
  styles/
    rails.css               # both gutters, the box, the mobile slide-out
    timeline.css            # spine and beads
  pages/
    timeline/index.astro    # the timeline page
spec/
  layout.test.ts            # our contract tests (new)
```

Deleted: `src/pages/sessions/index.astro`, `src/pages/lectures/index.mdx`,
`src/pages/assessments/index.mdx`, and the three grid components they used
(`SessionsGrid`, `LecturesGrid`, `AssessmentsGrid`) once nothing imports them.

Pure vs side-effecting: `weeks.ts`, `page-index.ts` and `timeline.ts` are pure
functions over data (or, for `page-index.ts`, over a `Document`), so all three
are unit-testable without a browser. The components are rendering only.
Nothing else holds state.

The grid: the theme's `body` is a named-line grid
(`full-start | inset-start | content-start | content-end | full-end`) that
already subtracts `--at-sidebar-inset` from the content column **on both
sides**. Setting that token is what makes room for two rails; the left rail
takes `grid-column: full-start / inset-start` and the right takes
`content-end / full-end`. No override of the theme's grid is needed, which is
the whole reason to use its tokens rather than absolute positioning.

## 6. Steps

**Status: all eight steps of the structural scaffold are complete.**
`spec/layout.test.ts` (Step 8) now runs the six dist-level contracts from
Steps 1, 4, 5, 6 and 7 on every `pnpm check`. Four of six are green
(index-page removal, WeekRail's 13 rows + `aria-current`, the timeline's 13
beads in order, footer acknowledgement-before-toggle). Two are red by
design, not defect: every `h2`/`h3` under `#main` having a non-empty `id`
(Step 5's documented theme-heading gap --- `SpecList`/`RelatedContent`/`Card`
titles and a few hand-written page headings) and assessment weights summing
to 100 (currently ≈200%, Step 6's documented placeholder-weight risk). Both
are content-stage follow-ups deferred by the plan itself, not scaffold
defects, and `pnpm check` is expected to exit red until real content lands.

Each step ends green on `pnpm check` and is committed on its own. Every step's
own testing methodology is unit tests over the pure functions it adds
(`src/lib/**`), per "Test at every stage" --- Step 8 additionally adds the
`dist`-level contract tests that answer the spec ids directly, since those
assertions need the built site and cross several steps' output.

### Step 1 --- Navigation and removals

**Goal.** Cut the nav down to Timeline, People, Policies and remove the three
index pages the week rail and timeline replace.

**Scope.** `src/site-config.ts` (`links`); delete
`src/pages/sessions/index.astro`, `src/pages/lectures/index.mdx`,
`src/pages/assessments/index.mdx`, `src/components/SessionsGrid.astro`,
`src/components/LecturesGrid.astro`, `src/components/AssessmentsGrid.astro`.
Does not touch `[slug].astro` detail routes, the four content collections, or
`content.config.ts`.

**Dependencies / spec.** Serves D2. Precondition for every later step: nothing
after this one should re-link the deleted pages.

**Inputs.** Current `site-config.ts`; the four known inbound links
(`src/pages/index.astro:39`, `:42`; `src/content/sessions/02-first-review.md:36`;
recheck `lectures/week-02.md` and `sessions/*.md` `related:` frontmatter for
any ref into `sessions/`, `lectures/` or `assessments/` index paths, since
`related:` refs resolve through the collections, not the deleted pages, and
should be unaffected --- confirm rather than assume).

**Outputs.** Nav with three links. No file imports a deleted component. No
inbound link or `related:` ref points at a deleted route.

**Acceptance.** `pnpm build` succeeds; `astro-broken-links-checker` output
shows zero broken links; `dist/sessions/index.html`,
`dist/lectures/index.html`, `dist/assessments/index.html` do not exist; a
session, lecture and assessment detail page each still build.

**Constraints.** D2. "Never remove what you were not asked to remove" is
satisfied here because the removal was explicitly requested ("remove the
sessions section", "remove the lectures page, and the assessment page") ---
this step is the one place deletion is in scope; no other step deletes
anything.

**Testing methodology.** No new pure logic yet, so no unit test from this step;
correctness is the build and link-checker output. Step 8 later asserts the
absence of the three index routes at the `dist` level as a durable regression
test.

**Amendment (found while implementing).** `astro-broken-links-checker` is real
and active --- it ships transitively through `astro-theme-university` and
fails the build on any unresolved internal link, confirmed by running
`pnpm build` with a `/timeline/` link present before that page exists. So the
nav in this step is `People`, `Policies` only, not the three named in the
goal text; the `Timeline` entry is added in Step 6 once `/timeline/` exists,
never before. Likewise, `src/pages/index.astro`'s "Where to go next" cards
lose the `Sessions` and `Assessment` cards rather than being repointed at
`/timeline/` early --- no valid non-broken target exists for them until
Step 6, and there is no session-schedule page to point the former at, ever
(that job moves to `WeekRail`, not a page). Step 6's scope now includes
adding the `Timeline` nav link and a `Timeline` card on the home page
alongside the page itself.

### Step 2 --- `GutterRail` shell

**Goal.** A shared, empty rail shell mounted on both sides of every page, using
the theme's grid tokens rather than an override of them.

**Scope.** New `src/components/GutterRail.astro` (props: `side: "start" |
"end"`, `label: string`, default slot); new `src/styles/rails.css`; edit
`src/layouts/PageLayout.astro` to set `--at-sidebar-inset` and mount
`<GutterRail side="start">` / `<GutterRail side="end">` with placeholder text
in each slot.

**Dependencies / spec.** Depends on Step 1 (nav settled, so the rail is not
built alongside pages about to disappear). No spec id directly; it is the
scaffold Steps 4--5 fill.

**Inputs.** `--at-gutter`, `--at-content-width`, `--at-content-inset`,
`--at-nav-height` from `astro-theme-university/styles/tokens.css`; the
`full-start`/`inset-start`/`content-end`/`full-end` grid lines from
`styles/base.css`.

**Outputs.** `GutterRail.astro`; `rails.css` imported once from
`PageLayout.astro`; both rails visible with placeholder text on every route.

**Acceptance.** At 1920x1080: both rails visible, positioned in the outer
columns, content column not overlapped or narrowed unexpectedly. Sticky:
scrolling the page keeps each rail's top edge pinned at
`var(--at-nav-height)`. At 390x844 (pre-Step-3): rails may still occupy layout
space --- Step 3 is what removes them from flow below the breakpoint, so this
step's mobile acceptance is only "does not crash the layout", not "collapses".

**Constraints.** D7 (`clamp(11rem, 15vw, 15rem)` width, not bare `15vw`); the
risk in plan section 7 about `--at-sidebar-inset` colliding with
`sidebar.css` --- confirm no page in this repo uses the theme's own
`.at-sidebar` before relying on the token being free.

**Testing methodology.** `GutterRail` is rendering-only (no pure logic), so no
unit test. Visual inspection at both viewports is the acceptance check for
this step, per the loop's step 7.

**Amendment (post-implementation).** Three things the plan's own text got
wrong or left open, found while building:

1. *`PageLayout.astro` was not on most pages' render path.* Only the three MDX
   pages (`people/index.mdx`, `policies/index.mdx`, `404.md`) reach a
   `defaultLayout`; `index.astro` and the four `[slug].astro` routes import
   `ContentLayout` directly and never touched `PageLayout`. Fixed by splitting
   the layout in two: `PageLayout.astro` is now content-agnostic (mounts the
   rails around its slot, nothing else) and a new `src/layouts/
   MdxDefaultLayout.astro` is the actual `defaultLayout` target (wraps
   `MdxPageLayout`, nests `PageLayout` inside it). `astro.config.ts` points at
   the new file; `index.astro` and all four `[slug].astro` files now import
   `PageLayout` and wrap their existing children in it. Every route mounts the
   rails through the one place named in the plan's Outputs line.
2. *Sticky only pinned within one grid row.* `.gutter-rail` had no explicit
   `grid-row`, so auto-placement's monotonic cursor gave the start rail row 1
   and the end rail the last row --- each sticky only within that row's height.
   Fixed with `grid-row: 1 / -1` on `.gutter-rail`.
3. *At 390x844 the layout did crash*, contrary to this step's "does not crash"
   floor: `--at-sidebar-inset` on both sides pushed the outer grid tracks'
   combined floor past the viewport width, squeezing the content column to
   zero and wrapping text one character per line. `sidebar.css` hits the exact
   same shape of problem for `.at-sidebar` and resolves it at `width <= 768px`
   by zeroing the inset, widening `.at-main` back to `inset-start /
   content-end`, and hiding the sidebar --- `rails.css` now does the same for
   `.gutter-rail` at the same breakpoint. This is a static `display: none`,
   not Step 3's toggle/focus-management/slide-out; Step 3 now builds its
   interactive collapse starting from "hidden below 768px", not "in flow".
   (One subtlety: the override selector inside that media query has to repeat
   the full `body:has(.gutter-rail):not(:has(.at-sidebar))` compound, not the
   bare `body:has(.gutter-rail)` --- both are unlayered, so the more specific
   selector wins regardless of the media query, and a bare version loses the
   cascade silently.)

**`--at-sidebar-inset` risk, resolved.** `grep -rn "at-sidebar" src` found no
consumer of the theme's own sidebar anywhere in this repo today --- the risk is
dormant, not live. `rails.css` still guards every rule that writes the token
with `:not(:has(.at-sidebar))`, so if a future step ever mounts `.at-sidebar`
alongside `GutterRail`, this rule stops applying by selector rather than
racing `sidebar.css` on source order.

### Step 3 --- Mobile rail behaviour

**Goal.** Below 768px, each rail collapses to a toggle button and slides out
over the content on demand, accessibly.

**Scope.** Extends `GutterRail.astro` with a `<button aria-expanded>` toggle
and an inline `<script>` (or a tiny `src/lib/rail-toggle.ts` imported by it)
that opens/closes the rail, moves focus into it on open, and returns focus to
the toggle on close (Escape and toggle-click both close it). Extends
`rails.css`'s existing `@media (width <= 768px)` block (added in Step 2 to
stop the rails crashing the content column, currently a static `display:
none`) with the toggle button and slide-out transform.

**Dependencies / spec.** Depends on Step 2. Serves S1 (both marking
viewports).

**Inputs.** `rails.css`'s `@media (width <= 768px)` block from Step 2 ---
reuse that breakpoint, not `base.css`'s separate 640px one, so there is no gap
band between 640 and 768px where the rail is hidden with no toggle to reopen
it.

**Outputs.** `rail-toggle.ts` (pure: given a rail element and open/closed
state, computes the next state and the focus target --- side effects of
actually moving focus/toggling `aria-expanded` stay in the `.astro` script);
updated `rails.css`.

**Acceptance.** At 390x844: neither rail occupies layout space at rest; two
toggle buttons are visible, at or above 44px; activating one slides the rail
in, sets `aria-expanded="true"`, and moves focus to the rail's first link;
Escape or a second activation closes it and returns focus to the toggle. At
1920x1080: unchanged from Step 2 --- both rails open, no toggle visible.

**Constraints.** General interface rules: usability (44px targets, keyboard
parity) and interaction design (affordance signified, visible feedback at the
object). D8 --- this is ordinary responsive disclosure, not a "stage" in the
narration-principle sense; it is not reviewed against that section.

**Testing methodology.** Unit test `rail-toggle.ts`'s pure state transition
(open→closed, closed→open, focus target selection) with no DOM. The
open/close DOM wiring itself is exercised by visual inspection, since it is
side-effecting glue rather than logic.

**Amendment (post-implementation).** Two things found while building and
testing this step with chrome-devtools MCP tools:

1. *Both rails open independently.* No mutual exclusion --- opening one does
   not close the other. They sit on opposite screen edges and share no
   state, so coupling them would be an addition the brief never asked for
   (section 2's "GutterRail must not know about its contents" extends
   naturally to "must not know about its sibling rail").
2. *Escape is a `document`-level listener, not scoped to the panel.* The
   scaffold's first cut attached `keydown` to `.gutter-rail-panel` itself,
   reasoning that focus moves inside it on open. That broke immediately
   under interactive testing: both rails' slot content is still Step 2's
   placeholder text with no `<a>` in it, so `panel.querySelector("a")?.focus()`
   is a no-op and focus stays on the toggle button --- outside the panel ---
   where the panel's own `keydown` listener never sees the keypress. Fixed
   by moving the listener to `document` and closing whichever rail(s) report
   `open`. This also fixes the general case once Steps 4/5 land real links:
   a visitor who tabs elsewhere after opening a rail should still be able to
   press Escape and have it close.

**Note for Steps 4 and 5.** `GutterRail`'s slot now renders inside
`<div class="gutter-rail-panel" id="gutter-rail-panel-{side}">`, and opening
a rail moves focus to `panel.querySelector("a")` --- the *first* anchor
element in that div, in DOM order. `WeekRail` and `PageIndex` must each
render their first navigable row as a real `<a>` (not a heading, a button,
or inert text) at or before that position, or the open-focus behaviour
silently does nothing (focus stays on the toggle, which is harmless but
misses the acceptance criterion this step met against placeholder content).
D1's inert "week that does not exist" rows are fine to follow the first
link, never precede it.

### Step 4 --- `WeekRail`

**Goal.** The left rail's real content: thirteen rows, Weeks 1--12 linked from
the `sessions` collection plus an Exam row, current week marked.

**Scope.** New `src/lib/weeks.ts` (`buildWeekRows(sessions, currentPath):
WeekRow[]`, pure); new `src/components/WeekRail.astro` (renders the rows,
`<ul>`/`<li>`, mounted inside the start `GutterRail`'s slot in
`PageLayout.astro`, replacing its Step 2 placeholder).

**Dependencies / spec.** Depends on Steps 1--3 (needs the shell and the
removed sessions index out of the way). Serves D1, D3.

**Inputs.** `getCollection("sessions")` (`week`, `date`, `id` per entry);
`Astro.url.pathname` for the current-row check; the assessments collection
entry the Exam row points at (the row links out, but the row-building logic
does not otherwise touch `assessments` --- keeps `WeekRail` reading one
collection, per the "must not know about weeks or headings" boundary in
section 2, extended here to "must not read `assessments` beyond the one Exam
link target").

**Outputs.** `weeks.ts`; `WeekRow = { week: number | "exam"; label: string;
href: string | null; current: boolean }`; a week with no matching session
entry gets `href: null` and renders as inert text, per section 2's "a week
that does not [exist] is inert text".

**Acceptance.** Thirteen `<li>` in the rendered rail on every route; each
`href` that is non-null resolves (checked by the broken-link checker on
build); the row matching the current page's `week` carries
`aria-current="page"`; the Exam row is visually distinct (per D1, "the design
intent survives") and last.

**Constraints.** D1, D3; "`WeekRail` must not read page content" (section 2).

**Testing methodology.** Unit test `buildWeekRows`: given a fixture list of
sessions (some weeks present, some absent), asserts thirteen rows in order,
correct `href`/`null` split, and correct `current` flag for a given path.

**Amendment (post-implementation).** Three things resolved while building:

1. *Real signature.* `buildWeekRows(sessions: {week, id}[], currentPath,
   examHref: string | null = null): WeekRow[]`. `examHref` was added as a
   third parameter rather than read from `assessments` inside the pure
   function --- the architecture section fixes `weeks.ts` as "pure over
   data", so the assessments lookup lives in `WeekRail.astro` (a side
   effect at the edge) and is passed in, not fetched by `weeks.ts` itself.
   The Exam row's `current` is hardcoded `false` per this step's own
   Outputs line, never computed from `currentPath`.
2. *URL convention confirmed from `sessions/[slug].astro`.* Session pages
   are keyed by `session.id` (the loader's slug, e.g.
   `01-getting-started`), and `trailingSlash: "always"` in
   `astro.config.ts` means the href is `` `/sessions/${id}/` `` ---
   matched against `Astro.url.pathname` exactly (no prefix/trim needed).
3. *No Exam entry exists yet.* `src/content/assessments/` currently holds
   only `assignment-1` and `final-project` --- no final exam --- so
   `examHref` is `null` on every route today. `WeekRail.astro` looks for
   one by `entry.id === "final-exam"` or a case-insensitive `/exam/i`
   match on `title`, so Step 6's placeholder entry picks up a real link
   automatically as long as its id or title names "exam"; if Step 6 gives
   it neither, amend this match rather than hardcoding a guessed slug.

**Amendment (shell bug found under review, fixed in `rails.css`).** The
mobile `.gutter-rail-panel`'s `padding: var(--at-spacing-md)` left its
first rows directly underneath the fixed toggle button (same top offset,
44px tall) --- invisible, though still first in DOM and still reachable by
keyboard, since Step 2/3 never had real content there to notice. Fixed with
`padding-block-start: calc(var(--at-spacing-md) * 2 + 44px)` inside the
existing `@media (width <= 768px)` block, clearing the toggle. This is a
`GutterRail`/shell fix, not scope creep into Step 5's territory: it applies
to both rails identically and neither rail's content model changed.

### Step 5 --- `PageIndex`

**Goal.** The right rail's real content: an in-page index of the current
page's headings, generated identically on every page type.

**Scope.** New `src/lib/page-index.ts` (`buildPageIndex(doc: Document):
{ id: string; text: string; level: 2 | 3 }[]`, pure, reads `#main h2, #main
h3`); new `src/components/PageIndex.astro` (a mount `<nav>` plus an inline
`<script>` that calls `buildPageIndex(document)` on load and renders the
links), mounted inside the end `GutterRail`'s slot, replacing its Step 2
placeholder.

**Dependencies / spec.** Depends on Steps 1--3. Serves D4.

**Inputs.** The rendered `#main` DOM; `rehype-slug`'s existing heading `id`s
(no change needed there --- confirm they are present rather than adding a
second slug pass).

**Outputs.** `page-index.ts`; the mount `<nav aria-label="On this page">`;
empty-state markup (a short muted line, not a blank box) when a page has no
`h2`/`h3`.

**Acceptance.** On a page with subheadings: the rail lists them as links,
clicking one scrolls to and focuses that heading. On a page with none (e.g. the
home page, if it has no `h2`): the empty state renders, not an empty `<ul>`.
`dist`-level: every `h2`/`h3` under `#main` on every built page carries a
non-empty `id` (this is what Step 8 asserts, since the generated list itself
is only visible with JS per D4's accepted cost).

**Constraints.** D4 (client-side by design; the honest cost is written down,
not hidden); "`PageIndex` must not read any collection" (section 2).

**Testing methodology.** Unit test `buildPageIndex` against a JSDOM fixture
document with a mix of `h1`/`h2`/`h3`/no-heading content, asserting the
`h1` is excluded, `h2`/`h3` order and text are captured, and an empty
document yields `[]`.

**Amendment (post-implementation).** Four things confirmed or found while
building this step:

1. *`#main` is the real selector, confirmed rather than assumed.*
   `astro-theme-university/layouts/BaseLayout.astro` sets `id="main"` on the
   theme's own `<main class="at-main">`, the same element `ContentLayout` and
   `MdxPageLayout` both render into. `buildPageIndex` queries `#main h2,
   #main h3` as the plan specified, and this is the selector Step 6 and
   Step 8 should both build on --- it is not going to change.
2. *`rehype-autolink-headings` appends a real DOM node, not a CSS
   pseudo-element.* `astro-theme-university/markdown.ts` appends an
   `aria-hidden`, `tabindex="-1"` anchor containing the literal text `"#"`
   inside every markdown heading. A naive `textContent` read would have
   trailed every entry with `"#"`; `buildPageIndex` clones the heading and
   removes `.at-heading-anchor` before reading text. Worth knowing for
   anyone touching heading markup later --- the permalink is real content,
   not decoration a stylesheet can hide from `textContent`.
3. *The home page is not the headingless example --- `/policies/` is.*
   `src/pages/index.astro`'s own hand-written `<h2>`s ("What you will do",
   etc.) have no `id` (rehype-slug never touches literal JSX/Astro markup),
   so the home page's index lists three unlinkable, muted entries rather
   than being empty. The same is true of `SpecList`'s "The spec" heading and
   `RelatedContent`'s "Related" heading --- both theme components, both
   render an `<h2>` with no `id` --- so every session/lecture/assessment
   detail page's index carries two inert rows alongside its real, linked
   markdown headings (see the Week 1 session page in this step's visual
   check). `Card.astro`'s title (`h2` or `h3` depending on `headingLevel`)
   is the same story on `/people/` and the home page's card grid. None of
   this is a bug: `buildPageIndex` does exactly what D4 asks --- reads every
   `id` as it finds it, invents none --- and `PageIndex.astro` renders an
   entry with no `id` as inert text, the same convention `WeekRail` already
   uses for a week with no session. It is a real content gap (those
   headings could carry an `id`, and rendering as inert text is a reasonable
   fallback, not a fix), noted here rather than silently patched, since
   fixing it would mean adding `id`s to theme components and hand-written
   pages outside this step's scope. `/policies/` (`<h1>` only, no `<h2>`) is
   the one page in this repo that is genuinely headingless today, and is
   what the empty-state check used.
4. *`jsdom` added as an explicit devDependency.* It was already resolved
   transitively as vitest's optional peer, but not installed or declared;
   `pnpm add -D jsdom` makes `// @vitest-environment jsdom` in
   `spec/page-index.test.ts` work without relying on an undeclared
   transitive install.

**Step 8's dist-level assertion (handed forward).** For every built
`*.html` file, parse the `#main ... </main>` region and assert every
`<h2`/`<h3` tag inside it carries a non-empty `id="..."` attribute. This is
the contract D4 accepts in place of asserting the generated list itself.
Given finding 3 above, this assertion will currently fail on
`dist/index.html`, every `dist/sessions/*`, `dist/lectures/*` and
`dist/assessments/*` page (via `SpecList`/`RelatedContent`), and
`dist/people/index.html` (via `Card`) --- Step 8 should either write the
test to go red until those `id`s are added, or that content work should
land before Step 8 does, per this plan's own "a check goes red until the
content lands rather than being forgotten" convention (already used for S4
in section 7).

### Step 6 --- Timeline page and spine

**Goal.** `/timeline/`, a thickened left-edge rule with a bead per graded
deliverable in semester order, description spans empty.

**Scope.** New `src/pages/timeline/index.astro`; new
`src/components/TimelineSpine.astro` (reads ordered bead data, renders the
rule, maps to `TimelineBead`); new `src/components/TimelineBead.astro` (circle
+ label + empty `<span class="description"></span>`); new
`src/styles/timeline.css` (the thickened rule, and the rule under D5 that
suppresses the theme's `body::after` wherever the spine is present); new
placeholder `assessments` content entries for Labs 1--10, Assignment 2 and
Final Exam (Assignment 1 already exists in `src/content/assessments/` and is
untouched). Also edit `src/site-config.ts` to add the `Timeline` nav link and
`src/pages/index.astro` to add a `Timeline` card, both deferred from Step 1
per its amendment above since `/timeline/` did not exist yet. In the same
edit, add an `Overview` nav link pointing at `/` (home), placed first, so the
top nav reads Overview, Timeline, People, Policies --- `at-nav-logo-full`
already links to the home page, but clicking a wordmark to mean "go to the
overview" is not a discoverable affordance, and a named link removes the
ambiguity at negligible cost (one more `<li>`, same pattern as the other
three). This does not replace the logo's own link, it duplicates the
destination under a legible label.

**Dependencies / spec.** Depends on Steps 1--3 (page shell). Serves S4's page
(the page assessment weights will need to sum to 100% once real weights land
--- Step 8's test is written to catch that at the moment weights exist, per
plan section 7's risk).

**Inputs.** Ordering rule stated in the prompt: Labs 1--4, Assignment 1, Labs
5--8, Assignment 2, Labs 9--10, Final Exam. **Corrected count: 13 beads, not
fourteen.** The plan's original Inputs line said "fourteen beads total" ---
an arithmetic error, caught while re-deriving the list: 10 labs + 2
assignments + 1 final exam = 13, and the literal sequence above lists exactly
13 names. No 14th deliverable is named anywhere else in the brief, so 13 is
final, not a further guess.

**Outputs.** `TimelineSpine.astro`, `TimelineBead.astro`, `timeline.css`,
`/timeline/` page; 12 new `assessments` entries (Assignment 1 already
existed) with placeholder weights --- equal split across the 12 new entries,
`100 / 12 ≈ 8.33` each, each flagged with a code comment in its frontmatter as
temporary. This is a split of the 12 *new* entries' own share, not a
recomputed split across the full collection: Assignment 1's existing 40 and
`final-project`'s existing 60 are untouched (already-existing content, per
"never remove/rewrite what you were not asked to"), so the collection's
total is 40 + 60 + 12x8.33 ≈ 200, not 100. This is expected and not a defect
of this step --- Step 8's weight-sum-to-100 test (section 7's documented
risk) is written to go red the moment weights exist and stays red until real
weights replace every placeholder, which is a later step's job, not this
one's.

**Acceptance.** At 1920x1080 and 390x844: 13 beads down the page in the
documented order, each a circle visibly intersecting the thickened rule, each
labelled, each with an empty description span beneath, each linking to its
assessment's detail page. The theme's global `body::after` rule does not
double up with the page's own spine on this route. Top nav reads Overview,
Timeline, People, Policies (in that order) on every page, and the Overview
link resolves to the same destination as the logo.

**Constraints.** D5, D9, D1 (labs are not `sessions` entries and do not
compete with the twelve-week cap); "`TimelineBead` must not know its
position" --- ordering and spacing are the spine's job, the bead only
renders itself.

**Testing methodology.** The ordering/mapping logic is non-trivial (D9: an
explicit id list, filtered and reordered against whatever the collection
returns, with missing-id and extra-entry cases to get right), so it is
extracted to a pure `src/lib/timeline.ts` (`BEAD_ORDER`, `orderBeads`) and
unit tested in `spec/timeline.test.ts`: reorders shuffled input to
`BEAD_ORDER`, drops an ordered id with no matching entry rather than
inventing one, drops an entry not named in the order, and confirms
`BEAD_ORDER` itself has length 13.

**Amendment (post-implementation).** Four things resolved while building:

1. **D5's coexistence answer.** The spine and the theme's global 1px
   `body::after` accent rule would otherwise draw two vertical lines on this
   page at slightly different offsets. `timeline.css` adds
   `body:has(.timeline-spine)::after { display: none; }` --- the same
   `:has()` convention `rails.css` already uses, so no route-level body
   class is needed and every other page keeps the global rule unchanged.
   Confirmed visually at both viewports: only the spine's own thicker rule
   is visible on `/timeline/`.
2. **The Exam bead / WeekRail cross-link, confirmed working.** The new
   `final-exam.md` entry's id is literally `final-exam`, which is one of
   WeekRail's two match conditions (Step 4). Built output confirms both the
   WeekRail Exam row and the timeline's Final Exam bead resolve to the same
   `/assessments/final-exam/` URL.
3. **`spec/data-integrity.test.ts` caught an out-of-range placeholder
   date.** The first draft of `final-exam.md` used a due date after
   `courseMeta.endDate` (2027-05-28); the existing data-integrity test
   failed on it immediately. Moved the placeholder due date to
   2027-05-28T09:00 (same day as `final-project`'s existing due date, both
   inside the teaching period) --- a real regression the existing suite
   caught as designed, not a new check written for this step.
4. **A stale process from the previous, killed attempt at this step held
   ports 4321/4322**, serving an old build with one bead. Killed both PIDs
   before the visual check; not a defect in this step's code, but worth
   naming since it could otherwise look like one.

### Step 7 --- Acknowledgement of Country

**Goal.** A generic Acknowledgement of Country in the footer, above the
light/dark toggle.

**Scope.** Edit `src/site-config.ts` to add `acknowledgement: { title, text }`
to `siteConfig`. No new component --- `Footer.astro` already renders this prop
in the required position (D6).

**Dependencies / spec.** None; independent of Steps 2--6.

**Inputs.** `AcknowledgementInfo` type in
`node_modules/astro-theme-university/types.ts` (`title?`, `text`, optional
`logo`/`logoAlt` --- logo omitted, since the brief asks for text only).

**Outputs.** `acknowledgement` in `siteConfig`.

**Acceptance.** Every page's footer shows the acknowledgement text above the
licence/legal row and the theme toggle, at both viewports.

**Constraints.** D6; generic wording (no invented institution or place name
beyond "the land" framing appropriate to a placeholder-content stage --- kept
brief and non-specific since the course's own location/context has not been
decided yet).

**Testing methodology.** No new pure logic; acceptance is visual plus a
Step 8 `dist`-level assertion that the acknowledgement text appears before the
theme-toggle button in DOM order.

**Amendment (post-implementation).** D6 confirmed exactly as assumed, by
reading `Footer.astro`: it renders `<div class="at-footer-acknowledgement">`
(an `<h2>` from `acknowledgement.title` and a `<p>` from `.text`) as the first
child of `<div class="at-footer-inner at-footer-bottom">`, before the licence
`<hr>`/`<p>` and before `<nav class="at-footer-legal">`, which is what holds
`<button class="at-footer-theme-toggle">`. No component or CSS reorder was
needed --- the whole step is the `acknowledgement` field added to
`siteConfig` in `src/site-config.ts`:

```ts
acknowledgement: {
  title: "Acknowledgement of Country",
  text: "Slop University acknowledges the Traditional Owners of the "
    + "land on which it operates, and pays respect to their Elders "
    + "past and present.",
},
```

Generic by construction: it names no real nation, people or place, only "the
land" the fictional Slop University sits on --- the register a placeholder
acknowledgement should have before the course's real location is decided.

Confirmed by DOM inspection of the built `dist/` output (checked on
`/index.html`, and by live-DOM check on `/timeline/`, `/people/`,
`/policies/` and a session detail page, at both 1920x1080 and 390x844): in
document order, `.at-footer-acknowledgement` precedes
`.at-footer-legal button.at-footer-theme-toggle`, both nested under
`footer.at-footer .at-footer-bottom`. **Step 8's selector**: query
`.at-footer-acknowledgement` and `.at-footer-theme-toggle` on any page and
assert the former's position in the parsed HTML precedes the latter's
(e.g. via `compareDocumentPosition` or a raw index comparison on the
`.at-footer-bottom` innerHTML) --- both classes are stable theme markup, not
ours, so the assertion is on structure the theme contracts to keep.

### Step 8 --- Spec tests

**Goal.** `spec/layout.test.ts`, collecting the `dist`-level contracts named as
acceptance criteria in Steps 1, 4, 5, 6 and 7 into one committed test file
that runs with `pnpm check`.

**Scope.** New `spec/layout.test.ts` only; no application code changes.

**Dependencies / spec.** Depends on Steps 1--7 all being committed. Serves S5
directly, and is how S1/S3/S4 stay checked going forward rather than verified
once by hand.

**Inputs.** The built `dist/` tree (`pnpm build` runs before `vitest run
spec` in `pnpm test`, per `package.json`).

**Outputs.** Assertions, each traceable to one acceptance criterion above:
no `dist/sessions|lectures|assessments/index.html`; every page's `WeekRail`
has thirteen `<li>`; every `h2`/`h3` under `#main` has a non-empty `id`;
`/timeline/index.html` has 13 bead elements in the documented label
order, each with a link and an empty description span; the acknowledgement
text precedes the theme-toggle button in footer DOM order; assessment weights
across all `assessments` entries sum to 100 (red until Step 6's placeholder
weights are replaced with real ones --- expected, per plan section 7).

**Constraints.** Assert the **contract** (counts, order, presence, structure),
not implementation detail (class names chosen for styling), so the suite
survives a restyle. Follows the pattern already in
`spec/data-integrity.test.ts` (reads `dist/api/index.json` and built HTML with
`JSDOM`, same as `spec/invariants.test.ts`).

**Acceptance.** `pnpm check` runs `spec/layout.test.ts` alongside the existing
suites; every assertion above passes except the weight-sum one, which fails
with a clear message naming the current total --- a deliberate, documented red,
not an oversight.

**Testing methodology.** This step *is* the tests; no further unit test wraps
it. Confirm each assertion fails if the feature it checks is reverted (a quick
sanity check, not a permanent mutation test), so the suite is known to bite.

**Amendment (post-implementation).** Three things resolved while building:

1. *`spec/invariants.test.ts` does not exist* --- the repo's existing suite is
   `data-integrity.test.ts`, `page-index.test.ts`, `rail-toggle.test.ts`,
   `timeline.test.ts` and `weeks.test.ts`. `layout.test.ts` follows
   `data-integrity.test.ts`'s pattern (`readFileSync` + a small parse helper,
   one `describe` block) instead.
2. **`/decks/week-01/` is a separate template**, rendered by `astromotion`
   with no `PageLayout`, no `WeekRail`, no `#main` and no footer --- confirmed
   against the built HTML. It is excluded from the WeekRail, heading-id and
   footer assertions (all three are chrome the deck page never carries), and
   is not a scope gap: those assertions cover every page the site chrome
   actually renders on, which is what the acceptance criteria describe.
3. **Astro's scoped-style output required a `data-astro-cid-*`-tolerant
   selector.** `<ul class="week-rail" data-astro-cid-...>` still matches
   `ul.week-rail` (an attribute selector on class, unaffected by the extra
   attribute) --- no change needed once confirmed, just noted since a plain
   string match on the raw HTML (as opposed to a CSS-selector query) would
   have needed the same care.

**Confirmed results (all six assertions run for real against `pnpm build`
output):**

- Step 1 (no `sessions`/`lectures`/`assessments` index) --- **green**.
- Step 4 (13 `<li>` per WeekRail; current row `aria-current="page"`) ---
  **green**.
- Step 5 (every `h2`/`h3` under `#main` has a non-empty `id`) --- **red**,
  exactly as Step 5's amendment predicted: 30 headings across 16 pages lack
  one (`dist/index.html`'s three hand-written `h2`s and three card `h3`s;
  `SpecList`'s "The spec" `h2` on all 12 assessment detail pages and both
  session pages; `RelatedContent`'s "Related" `h2` on 2 assessment pages,
  both lecture pages and both session pages; `Card`'s title `h2` on both
  `/people/` entries). Documented content gap, not fixed here.
- Step 6 (`/timeline/` has 13 beads, documented order, link + empty
  `span.description` each) --- **green**.
- Step 7 (`.at-footer-acknowledgement` precedes
  `.at-footer-legal button.at-footer-theme-toggle` in every page's
  `.at-footer-bottom`) --- **green**.
- S4 / §7 risk (assessment weights sum to 100) --- **red**: current total is
  199.96 (Assignment 1's 40 + `final-project`'s 60 + twelve placeholder
  entries at 8.33 each). Documented, expected red until real weights land.

**Mutation spot-check** (temporary edits to built `dist/` files, reverted
immediately after, no source changes): deleting a removed index page back in
made assertion 1 fail; deleting one WeekRail `<li>` made assertion 2 fail;
swapping the first two timeline beads' hrefs made assertion 4 fail; moving
the footer acknowledgement after the theme toggle made assertion 5 fail. All
four bite as designed.

`pnpm check`'s exit code is **non-zero** with this step committed, because
two of `layout.test.ts`'s six assertions are red by design (Step 5's and
Step 6's own documented content gaps, not this step's). That is the correct
end state per this plan's own "a check goes red until the content lands
rather than being forgotten" convention (§7) --- fixing the two gaps is
explicitly out of this step's scope and belongs to the content-writing stage.

**Note on devDependencies.** `@types/jsdom` was added (`pnpm add -D
@types/jsdom`) so `astro check` can type `import { JSDOM } from "jsdom"` in
`layout.test.ts` --- `jsdom` itself was already an explicit devDependency
(Step 5's amendment), but its types were only ever resolved transitively.

## 7. Risks

**The broken-link checker fails the build in Step 1.** Four known inbound links
are listed above, but `related:` refs resolve through the collections and a
missed one fails the build rather than degrading. Step 1 finds out immediately,
and the fallback is to keep a stub index page at the old URL until the sweep is
complete.

**Two sticky rails plus the sticky nav can trap the content column** on short
viewports --- a rail taller than the viewport cannot scroll to its own end.
Step 2 found out and applied the fallback: `max-height: calc(100dvh -
var(--at-nav-height))` with `overflow-y: auto` on `.gutter-rail`.

**`--at-sidebar-inset` is a theme token with an existing consumer** ---
`sidebar.css` sets it for `.at-sidebar`. If we ever use the theme's own sidebar
on a page, the two will fight over the same token. Step 2 found out: no page
uses `.at-sidebar` today (dormant risk), and applied the fallback anyway ---
`rails.css` sets the token under `body:has(.gutter-rail):not(:has(.at-sidebar))`
so the two rules are mutually exclusive by selector rather than by luck.

**At mobile widths, two rails' reserved space alone can exceed the viewport**
--- found in Step 2, not anticipated when this plan was written: at 390px,
`--at-sidebar-inset` on both sides pushed the outer grid tracks' combined
floor past the viewport width, squeezing the content column to zero. Fixed by
reusing `sidebar.css`'s own `width <= 768px` breakpoint to zero the inset and
hide the rails there (see Step 2's amendment); Step 3 builds its toggle on top
of that breakpoint instead of `base.css`'s 640px one.

**The client-side index is invisible to the marker if JavaScript fails.** D4
accepts this. Step 5 finds out how much of the page's navigability depends on
it; if the answer is "a lot", the fallback is a static in-page index rendered at
the top of long collection pages, where `render()` does supply headings. Found
while building it: navigability without JS is unaffected either way, since
every session/lecture/assessment page's markdown headings are still real
in-page anchors in the static HTML (rehype-slug), and the week rail (no JS
needed) already gets a reader to the page --- the index is a convenience for
a long page already open, not the only path to a heading.

**Assessment weights must total 100% (S4), and the beads are placeholders.**
13 timeline deliverables plus the pre-existing `final-project` now carry
weights, but Step 6's 12 new placeholder weights (`100/12 ≈ 8.33` each,
documented in that step's amendment) were deliberately not netted against
Assignment 1 and `final-project`'s existing 40+60 --- the collection's total
is currently ≈200, not 100. The Step 8 test should assert the sum the moment
it is written, so the check goes red until real weights replace every
placeholder across all 14 `assessments` entries, rather than being
forgotten.
