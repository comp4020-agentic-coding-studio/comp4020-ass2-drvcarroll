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
- `TimelineSpine` reads the `assessments` collection and emits one
  `TimelineBead` per entry, ordered by `week` then `due`.
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

Pure vs side-effecting: `weeks.ts` and `page-index.ts` are pure functions over
data and over a `Document`, so both are unit-testable without a browser. The
components are rendering only. Nothing else holds state.

The grid: the theme's `body` is a named-line grid
(`full-start | inset-start | content-start | content-end | full-end`) that
already subtracts `--at-sidebar-inset` from the content column **on both
sides**. Setting that token is what makes room for two rails; the left rail
takes `grid-column: full-start / inset-start` and the right takes
`content-end / full-end`. No override of the theme's grid is needed, which is
the whole reason to use its tokens rather than absolute positioning.

## 6. Steps

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

### Step 6 --- Timeline page and spine

**Goal.** `/timeline/`, a thickened left-edge rule with a bead per graded
deliverable in semester order, description spans empty.

**Scope.** New `src/pages/timeline/index.astro`; new
`src/components/TimelineSpine.astro` (reads ordered bead data, renders the
rule, maps to `TimelineBead`); new `src/components/TimelineBead.astro` (circle
+ label + empty `<span class="description"></span>`); new
`src/styles/timeline.css` (the thickened rule, positioned to replace --- on
this page only --- the theme's `body::after`, per D5); new placeholder
`assessments` content entries for Labs 1--10, Assignment 1, Assignment 2, Final
Exam if they do not already exist as distinct entries (Assignment 1 already
exists in `src/content/assessments/`; Assignment 2 and the ten labs and final
exam do not and need placeholder frontmatter satisfying the existing
`assessments` schema --- `week`, `due`, `weight`; per the plan's own opening
line, "content is deliberately last", so these are structural placeholders
with minimal valid frontmatter, not written copy). Also edit
`src/site-config.ts` to add the `Timeline` nav link and
`src/pages/index.astro` to add a `Timeline` card, both deferred from Step 1
per its amendment above since `/timeline/` did not exist yet.

**Dependencies / spec.** Depends on Steps 1--3 (page shell). Serves S4's page
(the page assessment weights will need to sum to 100% once real weights land
--- Step 8's test is written to catch that at the moment weights exist, per
plan section 7's risk).

**Inputs.** Ordering rule stated in the prompt: Labs 1--4, Assignment 1, Labs
5--8, Assignment 2, Labs 9--10, Final Exam --- fourteen beads total, in that
literal order (re-derived here from "Assignment 1 after the 4th lab,
Assignment 2 after the 8th lab, and final exam at the end").

**Outputs.** `TimelineSpine.astro`, `TimelineBead.astro`, `timeline.css`,
`/timeline/` page; fourteen `assessments` entries with placeholder weights
(equal split, `100/14` rounded, flagged in frontmatter or a code comment as
temporary so Step 8's weight-sum test has something concrete to hold, without
pretending it is final content).

**Acceptance.** At 1920x1080 and 390x844: fourteen beads down the page in the
documented order, each a circle visibly intersecting the thickened rule, each
labelled, each with an empty description span beneath, each linking to its
assessment's detail page. The theme's global `body::after` rule does not
double up with the page's own spine on this route.

**Constraints.** D5, D1 (labs are not `sessions` entries and do not compete
with the twelve-week cap); "`TimelineBead` must not know its position" ---
ordering and spacing are the spine's job, the bead only renders itself.

**Testing methodology.** Unit test the ordering/mapping function that turns
the fourteen assessment entries into spine order (if extracted to
`src/lib/timeline.ts`) or, if the ordering is simple enough to live directly in
the `.astro` frontmatter, assert it at the Step 8 `dist` level instead --- the
step's own scaffold decides which, and states the choice before implementing.

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
`/timeline/index.html` has fourteen bead elements in the documented label
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
the top of long collection pages, where `render()` does supply headings.

**Assessment weights must total 100% (S4), and the beads are placeholders.**
Fourteen deliverables with no weights cannot be checked yet. The Step 8 test
should assert the sum the moment weights exist, so the check goes red until the
content lands rather than being forgotten.
