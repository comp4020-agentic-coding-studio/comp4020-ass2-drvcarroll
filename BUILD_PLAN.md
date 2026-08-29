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

Each step ends green on `pnpm check` and is committed on its own.

**Step 1 --- Navigation and removals.** Cut `links` in `site-config.ts` to
Timeline, People, Policies. Delete the three index pages and the grid
components. Sweep the four inbound links that would otherwise fail the build's
broken-link checker: `src/pages/index.astro:39` and `:42`, and the prose link in
`src/content/sessions/02-first-review.md:36`. *Serves D2. Asserts: build passes
with no broken links.*

**Step 2 --- `GutterRail` shell.** The box, sticky positioning under the nav,
and the two grid placements. Mount both sides in `PageLayout` with placeholder
content so the frame is visible before either payload exists. *Asserts: both
rails present on every page, content column not overlapped.*

**Step 3 --- Mobile behaviour.** Below the theme's 640px breakpoint, each rail
collapses to a toggle button and slides out over the content. Toggles are real
`<button>`s with `aria-expanded`; focus moves into the rail on open and returns
on close. *Serves S1's second viewport. Asserts: rails are not in the flow at
narrow widths.*

**Step 4 --- `WeekRail`.** `buildWeekRows` maps sessions onto Weeks 1--12 and
appends the Exam row. Rows without a session render as inert text. *Serves D1,
D3. Asserts: thirteen rows; every link resolves; current row carries
`aria-current`.*

**Step 5 --- `PageIndex`.** Mount point plus the script calling
`buildPageIndex(document)`. Empty state when a page has no subheadings. *Serves
D4. Asserts: every `h2`/`h3` in `dist` carries an `id`; the mount point is in
the built HTML.*

**Step 6 --- Timeline page and spine.** `/timeline/`, the thickened rule, and
beads for ten labs with Assignment 1 after Lab 4, Assignment 2 after Lab 8, and
the Final Exam last. Description spans render empty. *Serves S4's page.
Asserts: fourteen beads in the documented order; each links to its assessment.*

**Step 7 --- Acknowledgement.** Add `acknowledgement` to `siteConfig`. *Serves
D6. Asserts: it renders above the theme toggle.*

**Step 8 --- Spec tests.** `spec/layout.test.ts` collecting the assertions above
against `dist`. *Serves S5.*

## 7. Risks

**The broken-link checker fails the build in Step 1.** Four known inbound links
are listed above, but `related:` refs resolve through the collections and a
missed one fails the build rather than degrading. Step 1 finds out immediately,
and the fallback is to keep a stub index page at the old URL until the sweep is
complete.

**Two sticky rails plus the sticky nav can trap the content column** on short
viewports --- a rail taller than the viewport cannot scroll to its own end.
Step 2 finds out. Fallback: `max-height` on the rail with its own overflow.

**`--at-sidebar-inset` is a theme token with an existing consumer** ---
`sidebar.css` sets it for `.at-sidebar`. If we ever use the theme's own sidebar
on a page, the two will fight over the same token. Step 2 finds out. Fallback:
our own token, and set `--at-sidebar-inset` from it.

**The client-side index is invisible to the marker if JavaScript fails.** D4
accepts this. Step 5 finds out how much of the page's navigability depends on
it; if the answer is "a lot", the fallback is a static in-page index rendered at
the top of long collection pages, where `render()` does supply headings.

**Assessment weights must total 100% (S4), and the beads are placeholders.**
Fourteen deliverables with no weights cannot be checked yet. The Step 8 test
should assert the sum the moment weights exist, so the check goes red until the
content lands rather than being forgotten.
