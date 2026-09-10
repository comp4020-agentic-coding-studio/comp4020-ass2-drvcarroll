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

**D10. Every week gets exactly one lecture and one lab, mapped 1:1 by week
number.** The session page's new Lecture/Lab cards need a lecture and a lab
entry for every week 1--12, but `src/content/lectures/` currently only has
`week-01`/`week-02` and `src/content/assessments/`'s ten labs
(`lab-01`--`lab-10`) cover only ten of twelve weeks. Rather than leave two
weeks with no lab card, or invent an eleventh/twelfth lab id that contradicts
the Timeline's already-committed 13-bead `BEAD_ORDER`, the missing lecture
entries (week-03--week-12) and two additional lab entries are placeholder
content, added in Step 14, under the same "content lands later" convention
already used for dates and weights (Step 6's amendment). `BEAD_ORDER` gains
the two new lab ids in sequence.

**D11. The assessment page template is one route, redesigned once, not a
second template.** The reference structure (hero, brief, submission list,
marking table, key dates, spec, related) is asked for on every lab/assignment/
exam link, not uniquely for Assignment 1. Per D2's existing "one generic
`[slug].astro`" architecture, this extension adds fields and sections to the
one shared assessments schema/template rather than forking a second one.

**D12. The Exam row leaves `WeekRail`; the Timeline is its only entry point.**
The prompt asks for `week-rail-exam` removed outright ("that will just be in
the timeline"), which revises D1's "thirteen rows... plus an Exam period row"
to twelve rows only. `TimelineSpine`'s existing Final Exam bead (D9,
`BEAD_ORDER`) already resolves to `/assessments/final-exam/`, so no link is
lost --- only the second, redundant entry point in the rail.

**D13. The Timeline's line is the shared column rule, not a page-local one.**
D5 built the spine's line as the page's own thicker rule because a page
cannot thicken a `body`-level global rule for itself alone. The prompt now
asks for the opposite: the visible vertical line on every page --- including
Timeline --- should be the one shared `body::after` column border, with the
beads repositioned onto it, rather than a second, page-specific line existing
at all. This reverses D5's suppression: Timeline stops hiding the global rule
and stops drawing its own, and `TimelineBead`'s dot shifts left to the column
border's own inline-start offset instead of `timeline.css`'s previous
independent one.

**D14. Overview, Timeline, People and Policies share one hero convention.**
Only Overview and a person's own page currently pass a `heroImage` to their
layout; the other three fall back to a plain heading, or, on People, no
heading at all. Rather than invent a second "section title" pattern, these
three pages adopt the same `heroTitle`/`heroImage` props `BaseLayout`/
`ContentLayout` already gate on. One placeholder hero image is reused across
Timeline/People/Policies (distinct `heroTitle`/`imageAlt` per page) until real
photography exists, matching this plan's placeholder-content convention.

**D15. A session's Lecture/Lab/Assignment section is subtitle, then
description, then card --- not a card carrying both.** Step 14 folded the
title and description into `Card`'s own heading and slot, so the card itself
was the entire section. The prompt corrects this: each section is a plain
subtitle heading ("Lecture 4"), a description paragraph beneath it, and then
a `Card` as the section's link/action element, distinct from the text above
it rather than a container for it. The card's own title becomes the
referenced entry's real title (e.g. the lecture's actual title), since the
description text no longer needs restating inside the card.

**D16. A timeline bead shows title, then date, then a brief description ---
not a label with an empty placeholder span.** `TimelineBead` was built
(Step 6) with a deliberately empty `.description` span, reserved for "real
copy later." That later point is now: every bead gets its assessment's own
`due` date (already real schema data, formatted with the existing
`formatCourseDate`) and its `description` field, in that order under the
title, matching the Lecture/Lab pattern's shape (title, date-or-description,
then supporting text) rather than a bare label.

**D17. Every heading a reader can jump to gets a real `id`, not just
markdown headings.** The two pre-existing documented test failures (Section
7) include headings under `#main` with no `id` --- because `rehype-slug`
only touches headings written as literal markdown, never ones a component
renders (`Card`'s title, `TeachingTeam`'s and `RelatedContent`'s `<h2>`s, and
now D15's new subtitles). `PageIndex` already renders a heading with no `id`
as inert grey text instead of a link (Step 5's documented, deliberate
fallback) --- but the prompt now asks for every index entry to be a working
link, which means the fallback path should stop being exercised at all for
these components. A small shared `slugify` helper (matching `rehype-slug`'s
own GitHub-style algorithm: lowercase, strip non-word characters, hyphenate
spaces) is applied at render time to give each component-rendered heading a
real `id`, deduplicated per page the same way `rehype-slug` deduplicates
(`-1`, `-2`, ... suffix on repeat). This closes one of the two pre-existing
red assertions in `spec/layout.test.ts`; the assessment-weights-sum-to-200
failure is untouched and remains the sole documented gap after this step.

**D18. The heading-id fix must work under `pnpm dev`, not only in the built
site.** Step 17 shipped `fillMissingIds` as an `astro:build:done` hook,
patching `dist/`'s HTML after the fact --- correct for the deployed/marked
site, but invisible to anyone browsing `pnpm dev` (that hook never fires
there), where the page index still shows inert grey text. That gap was
judged acceptable in Step 17's own Amendment on the theory that only the
built site is marked --- overridden here: a working page index has to be
observable in dev too, since that is where this was actually checked and
found broken. The fix is to reuse, not duplicate, Step 17's logic: extract
`fillMissingIds` out of `src/integrations/heading-ids.ts` into a plain,
DOM-in/DOM-out function both the existing build hook and a new Astro
middleware (`src/middleware.ts`) call — the middleware intercepts every
HTML response `pnpm dev`'s on-demand rendering produces, runs the same
`fillMissingIds`, and serves the patched HTML, so dev and the built site
share one implementation and can never drift apart on what counts as
"missing."

**D19. A session page's sections stack vertically, one column, not two
side-by-side card grids.** Step 15 rendered each session's Lecture/Lab
subtitle-and-description block in one `CardGrid`, then a second parallel
`CardGrid` of the matching cards below it --- correct per D15's
subtitle-then-description-then-card order within a section, but two
`CardGrid`s side by side reads as a cluttered, horizontally-scanned grid,
not "Lecture above, Lab underneath" as directly requested. The fix is
structural, not cosmetic: one section is one unit (subtitle, description,
card together), and the units stack in document order in a single column,
so there is exactly one thing on screen to read top to bottom. This also
removes the doubled `.at-card-grid { margin-block: var(--at-spacing-xl) }`
that was compounding non-collapsingly under `.at-main`'s grid layout (every
`.at-main` child is a grid item, so sibling margins never collapse) ---
with one container instead of two, that particular doubling is gone by
construction, not patched around. The remaining gap under `p.lead` and the
oversized space above the session `h1` are addressed by a small,
session-page-scoped global style (selector keyed off a marker class this
page alone renders, e.g. `#main:has(.session-sections) > h1`), rather than
by editing the shared, unowned theme CSS (`base.css`/`components.css`),
since the request named the session pages specifically and every other
page using `ContentLayout` should keep the theme's default spacing.

**D20. The course record becomes SLOP4000, not the template's SLOP1000.**
`git log -p --follow` on `src/course-config.ts` shows exactly one commit ---
the template's own --- so this repo's pre-assigned three digits (README's
rule: fixed per repo, never renumbered) are `000`; nothing has ever claimed
a different suffix. The supplied content names the course "SLOP4xxx"
throughout (bios, lecture decks), and the schema's own `superRefine` ties
`level` to the digit immediately after "SLOP", so the only code consistent
with both constraints is `SLOP4000` with `level: 4`. `title`, `description`
and `tags` are drawn directly from `CONTENT.md`'s course record and Process
notes (Beat 1's framing --- "a course that taught students how to make and
produce malware," "farcical," treated with deadpan seriousness) rather than
paraphrased, so the about-page copy stays traceable to one source document
instead of a second, drifting paraphrase of it.

**D21. The course runs in 2027, weekly from 27 July to 26 October, with the
gap the source dates imply kept as a real gap.** The brief gives day/month
only, no year. `2027` matches every other date already committed in this
repo's placeholder sessions (`2027-02-22` onward), so reusing it avoids a
mismatched second calendar existing beside the site's other content for no
reason. Read literally, the week dates run weekly from Week 1 (27 Jul) to
Week 6 (31 Aug), then jump three weeks to Week 7 (21 Sep, corrected from the
source's malformed "21th Sep") before resuming weekly through Week 12 (26
Oct) --- Week 7's own slide 11 calls itself a "mid-semester checkpoint,"
which is exactly what a three-week gap between Weeks 6 and 7 would be. The
gap is therefore kept, not smoothed into a continuous weekly run: smoothing
it would contradict the content's own internal description of itself.
`course-config.ts`'s `startDate`/`endDate` must span 27 Jul through the
Final Examination date decided in D24 below, since `spec/data-integrity.test.ts`
checks every dated entry falls within the course period.

**D22. Only ten of the scaffold's twelve `lab-NN` slots correspond to a real
lab in the brief, and Weeks 1 and 12 get no Lab card.** This is the exact
situation Section 7's pre-existing "D10's lab count is a guess" risk
anticipated and already named the fallback for: "a week with no Lab card,
which is a smaller, more honest gap than inventing content the brief never
asked for." The brief names exactly ten labs (Lab 1 through Lab 10), mapped
one-to-one onto Weeks 2--11; Week 1 (Introduction) and Week 12 (Review) have
no lab anywhere in the source. Inventing an eleventh and twelfth lab to keep
D10's "every week gets exactly one lecture and one lab" convention intact
would put content on the site the brief never supplied, which `CONTENT.md`'s
own content notes already flagged as the wrong move. The fix is schema-level,
mirroring the precedent already set for `assignment` (`reference("assessments")
.optional()`, present only on the weeks that have one): `sessions`'
`lab` field becomes `.optional()` in `src/content.config.ts`, and only Weeks
1 and 12's session entries omit it. `WeekRail`/the session page template
already render conditionally per-section (D19's `sections` array is built
from whichever of lecture/lab/assignment exist on that entry) so no template
code changes --- an absent `lab` produces one fewer section, not a broken
one. The two now-unreferenced files, `lab-11.md` and `lab-12.md`, are not
deleted (no removal was asked for): they are set `published: false`, the
existing documented convention for taking a placeholder out of the built
site while keeping the file and its history in place.

**D23. The two convenors replace the two existing placeholder people, and
their files are renamed rather than left under the old placeholder names.**
The brief supplies exactly two people (Professor Sidorov, Course Convenor;
Professor Al-Fulani, Co-Convenor) and the scaffold has exactly two `people`
slots (`idris-fenn`, `marisol-quaye`) referenced from every lecture's and
session's `teachers:` array --- modifying in place rather than adding two
more entries follows directly from "prefer modifying over adding," and
leaves no orphaned placeholder file. The files themselves are renamed
(`ivan-sidorov.md`, `fulan-al-fulani.md`) rather than kept under
`idris-fenn.md`/`marisol-quaye.md` with new content inside: the filename is
the `reference()` slug, and a permanent SLOP4000 course page whose person
URLs still read `/people/idris-fenn/` would misname the very people it
introduces. The rename's risk --- a missed reference among the 24
lecture/session files that cite these slugs --- is exactly what the build's
existing dangling-reference check (README, Risks) already catches loudly,
so the rename is verified by `pnpm build` failing on anything missed, not
by manual grep alone (grep is still run first, as the cheaper check).

**D24. Assessment 1 is due at the end of Week 8; Assessment 2 is due after
Week 12, in the examination-preparation window.** Neither assessment has a
stated week or due date in the brief, only a weight and a syllabus. Both
dates are fixed from evidence inside the lecture decks themselves rather
than guessed independently: Week 7's own slide 12 is titled "Assessment 1
Reminder," which only makes sense if Assessment 1's due date has not yet
passed by Week 7 --- so it is placed shortly after, at the end of Week 8,
giving the reminder a purpose instead of arriving after the fact. Assessment
2 similarly gets its own "Assessment 2 Reminder" on Week 12's slide 15, and
its brief requires content through Week 11 (Operational Security) to
attempt honestly, so it is placed after the teaching weeks end, in the same
examination-preparation window as the Final Examination, rather than during
a teaching week that has not yet covered its own prerequisites.

**D25. The Policies page borrows structure, not text, from the real course's
four policy topics, and stays one page with four anchor-linked cards rather
than four sub-pages.** The brief names no in-universe policies at all, but the
real COMP4020 course this repo sits inside publishes exactly four policy
topics (code of conduct, AI use and integrity, communication, enrolment) as
the genre a course policies page belongs to; reusing that four-topic shape
gives the page a source to be traceable to, the same reasoning D20 already
applied to the about-page copy, rather than inventing categories from
nothing. The real pages' own text is ANU- and meta-level-specific (Ed
Discussion, Canvas, Turnitin, crits, permission codes) and describes the
actual COMP4020 studio, not SLOP4000, so each topic is rewritten against
`CONTENT.md`'s own established facts instead --- direct contact with
Professors Sidorov and Al-Fulani in place of a discussion board, the
labs-build-on-each-other structure already stated in Week 1's slides, the
"benign samples and simulated environments only" framing repeated across
`CONTENT.md`, and `course-config.ts`'s real 2027-07-27--2027-11-12 dates ---
so the page reads as SLOP4000's own voice (J2) rather than a copy with the
serial numbers filed off.

Four sub-pages under `/policies/<slug>/` were rejected: routing collection
content that way needs a fifth content collection, and §1 fixes the platform
at "four content collections that stay as they arrived." The chosen shape
instead is one page, an intro paragraph, a `CardGrid` of four `Card`s whose
`href`s are in-page anchors (`#code-of-conduct`, not an absolute path, so
`withBase()` leaves them untouched), and four `<h2>` sections below carrying
the full text. Each card's `title` is written identically to its section's
`<h2>` text, so `rehype-slug` generates the matching `id` with no new markup
(D4/D18's existing convention) and `PageIndex`'s right rail independently
lists the same four names the cards do --- one vocabulary shared by the
cards, the headings and the index, which is "fold into something already on
screen" rather than a second navigation surface built to do what the first
already does.

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

**Status: all fourteen steps are complete** --- the eight-step structural
scaffold below, plus Steps 9-14's content-stage work (assessment template,
timeline beads, and this file's Step 14 amendment above turning D10's
lecture/lab/assignment mapping into real content for every week).
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

**Steps 9 onward extend the scaffold above with the site-restructure request
below. None has been executed yet --- this is the plan only, per the loop's
own "design scaffold" phase happening before implementation.** Each still
runs the full eight-part loop when built, and each gets its own commit.

### Step 9 --- Re-run client scripts on soft navigation

**Goal.** Every route stays fully interactive after a `ClientRouter` soft
navigation, with no hard refresh required.

**Scope.** `src/components/GutterRail.astro`'s inline `<script>` (the mobile
toggle wiring); `src/components/PageIndex.astro`'s inline `<script>` (the
`buildPageIndex(document)` call and render). No change to `src/lib/
rail-toggle.ts` or `src/lib/page-index.ts` --- both are already pure; only the
moment their side-effecting callers run changes.

**Dependencies / spec.** None; independent of every other step below. Fixes
the reported "index doesn't load properly, requires a refresh" defect, traced
to both scripts running their setup once at module-evaluation time instead of
on `astro:page-load` --- the lifecycle event the theme's own `Nav.astro`/
`Footer.astro`/`SearchDialog.astro` already listen for on every soft
navigation.

**Inputs.** The existing top-level script bodies in both components; the
`astro:page-load` event, already used by four theme components for the
identical problem.

**Outputs.** Both scripts' setup logic wrapped in `document.addEventListener
("astro:page-load", () => { ... })`, matching the theme's own convention, so
first load and every later soft navigation both re-wire the toggle and
rebuild the index.

**Acceptance.** From `/`, click through to a session page, then a lecture
page, then back to `/`, using only in-page links (no manual reload), at both
viewports --- the right-rail page index shows each new page's headings, and
the mobile rail toggle opens/closes correctly on the page currently open,
with no console error.

**Constraints.** General interface rule "does every action produce visible
feedback at the object it happened to" --- a stale index has no error to
signal it. Do not disable `ClientRouter` as a shortcut --- that is a
site-wide behaviour change nobody asked for, where the theme's own components
already show the two-line fix.

**Testing methodology.** No new pure logic, so no new unit test. Acceptance
is a manual multi-page click-through at both viewports with the console open.

**Amendment (post-implementation).** The plan's literal reading ("wrapped in
one listener") would have put the `mobile.addEventListener("change", ...)` and
document-level `keydown` listener inside the per-navigation setup function,
duplicating them on every soft nav (they never got torn down, since neither
`mobile` nor `document` is replaced by a navigation). Fixed by hoisting those
two subscriptions to run once, outside `setupGutterRails`, reading a
module-level `rails` array that the per-navigation function rebuilds --- so
only the DOM query, click wiring and breakpoint sync re-run per page.
`pnpm check`'s two vitest failures (missing heading ids; assessment weights
summing to ~200) are unrelated pre-existing red, already documented in
`spec/layout.test.ts`'s own comments and confirmed unchanged by this step
(verified via `git stash`); out of this step's scope.

### Step 10 --- Remove the Exam row from WeekRail

**Goal.** `WeekRail` lists exactly the twelve teaching weeks; the exam period
is reachable only from the Timeline.

**Scope.** `src/components/WeekRail.astro` (drop the `examEntry`/`examHref`
lookup and the `week-rail-exam` row/CSS); `src/lib/weeks.ts`'s
`buildWeekRows` (drop the `examHref` parameter and the appended exam row).
Revises D1 per this extension's D12. Does not touch `TimelineSpine`/
`TimelineBead`/`src/lib/timeline.ts`, which already carry the Final Exam bead
independently.

**Dependencies / spec.** D12 only. Independent of Steps 9, 11--14.

**Inputs.** Current `buildWeekRows` signature and its one call site;
`spec/weeks.test.ts`'s existing exam-row fixtures, updated alongside the
source change rather than left red.

**Outputs.** A twelve-`<li>` `WeekRail`; `.week-rail-exam` CSS removed;
`weeks.ts` and its test updated to match.

**Acceptance.** Every page's left rail shows exactly twelve rows, none styled
as "exam"; `/assessments/final-exam/` is unreachable from the rail but still
reachable from the Timeline's Final Exam bead, unchanged.

**Constraints.** D12; the removal is the prompt's own explicit instruction,
so "never remove what you were not asked to remove" is satisfied, not
violated.

**Testing methodology.** Update `spec/weeks.test.ts`'s existing exam-row
assertions to assert twelve rows and no exam row --- a modification of an
existing test file, not a new one, per the one-file-per-concern convention.

**Amendment (post-implementation).** Step 8's `spec/layout.test.ts` also
hard-coded the old thirteen-row count in a dist-level assertion ("renders
exactly 13 WeekRail rows on every chrome page") --- not listed in this step's
own Inputs, but a direct, in-scope consequence of the row count changing, so
it was updated to 12 alongside the rest rather than left as a new red result.
`pnpm check`'s two documented pre-existing failures (missing heading ids;
assessment weights summing to ~200) were confirmed unchanged before and
after this step; no new failures were introduced.

### Step 11 --- Timeline spine on the shared column rule

**Goal.** The vertical line on the Timeline page is the same 1px accent rule
every other page already shows at the content column's left edge, not a
second, page-local line.

**Scope.** `src/styles/timeline.css` (remove `body:has(.timeline-spine)::after
{ display: none; }` and `.timeline-spine::before`'s own rule-drawing
declarations; keep only bead-positioning rules); `src/components/
TimelineBead.astro`'s styles (shift `.timeline-bead-dot`'s inline-start
offset to the shared rule's own position expression, the same one
`astro-theme-university/styles/base.css`'s `body::after` uses). Reverses D5
per this extension's D13.

**Dependencies / spec.** None; independent of Steps 9, 10, 12--14. Serves the
same S1 (both marking viewports) the original Timeline step served.

**Inputs.** `astro-theme-university/styles/base.css`'s `body::after` rule and
its custom-property inputs (`--at-gutter`, `--at-sidebar-inset`,
`--at-content-inset`, `--at-content-width`); the existing
`--timeline-rule-width`/`--timeline-rule-offset` tokens being retired.

**Outputs.** Updated `timeline.css`; updated bead offset; the global rule
visible and unbroken on `/timeline/`, exactly as on every other page.

**Acceptance.** At both viewports, `/timeline/` shows one gold vertical line
at the same horizontal position as every other page's, each bead's dot
centred on it; no double line, no gap left by the old suppression.

**Constraints.** "`TimelineBead` must not know its position" (section 2)
still holds --- the shared offset is a fixed CSS custom property the bead's
own stylesheet reads, not a value `TimelineSpine` computes or passes in.

**Testing methodology.** CSS-only; no pure logic changed. Acceptance is
visual inspection at both viewports, comparing the line's position against a
non-Timeline page in the same session.

**Amendment (post-implementation).** Reusing `body::after`'s exact inset
expression turned out unnecessary: since `.timeline-spine` sits in
`grid-column: content` with no horizontal margin of its own, the rule
always resolves to exactly `-1 * var(--at-content-inset)` from the spine's
own left edge, independent of viewport width, gutter or sidebar inset ---
proved algebraically from base.css's `grid-template-columns` and confirmed
by computed-style comparison at 1920x1080 (both pages' rule at 502.5px, dot
centre also 502.5px). So the dot's offset composes existing shared tokens
(`--at-content-inset`, `--timeline-dot-size`) rather than duplicating
`body::after`'s `max()`/`min()` formula, which would resolve against the
wrong containing-block width if copied verbatim into the bead's own CSS.
Visual inspection at 390px (the browser's minimum window width; true 390
isn't reachable, but this still sits inside base.css's `width < 640px`
breakpoint) surfaced a regression the plan didn't anticipate: below 640px
base.css hides `body::after` on every page, so the dots --- left positioned
--- floated unmoored near the viewport edge with no rule to sit on. Fixed by
hiding `.timeline-bead-dot` at the same `width < 640px` breakpoint, so
Timeline's mobile view matches every other page's (no accent decoration at
all below that width) instead of a half-broken one. `pnpm check`'s two
documented pre-existing failures were confirmed unchanged before and after;
no new failures were introduced.

### Step 12 --- Shared `at-hero` for Overview, Timeline, People, Policies

**Goal.** Timeline, People and Policies each show the same `at-hero` element
Overview already does, in place of their current plain heading (or, on
People, no heading at all).

**Scope.** `src/pages/timeline/index.astro` (add `heroTitle`/`heroImage`/
`heroImageAlt` to its `ContentLayout` call --- this removes the page's
plain-`<h1>` fallback automatically, since `ContentLayout` only falls back
when no hero image is given); `src/pages/people/index.mdx` and
`src/pages/policies/index.mdx` frontmatter (add `heroImage`/`heroImageAlt`;
`people/index.mdx` already sets `heroTitle`, `policies/index.mdx` gains one,
and its hand-written `# Policies and support` `<h1>` is removed since the
hero now supplies the page's `<h1>`); one shared placeholder hero asset if
`hero-home.avif` is not reused as-is.

**Dependencies / spec.** None; independent of every other step below.

**Inputs.** `astro-theme-university/components/Hero.astro`'s prop contract
(`title`, `image`, `imageAlt` all required); `BaseLayout`/`ContentLayout`'s
existing gate (`heroTitle && resolvedHeroImage`), confirmed to already do
what's needed once both props are supplied.

**Outputs.** Four pages (Overview unchanged, Timeline/People/Policies newly)
all rendering `<section class="at-hero">`; no page left with two `<h1>`s.

**Acceptance.** At both viewports, Timeline/People/Policies each show a hero
image with a title overlay, visually consistent with Overview's.

**Constraints.** D14; visual hierarchy --- the hero title must remain the
page's only top-level heading.

**Testing methodology.** No new pure logic. Extend `spec/layout.test.ts` with
one assertion (every built page has exactly one `<h1>`; Timeline/People/
Policies's HTML each contains `.at-hero`); visual inspection at both
viewports for the rest.

**Amendment (post-implementation).** One correction to this step's own Scope
line, found while reading `ContentLayout.astro`: `ContentLayout` never reads
a `heroTitle` prop at all --- its Hero (or fallback `<h1>`) always uses the
existing `title` prop, and any `heroTitle` passed alongside it is spread
through to `BaseLayout` where it is inert (`BaseLayout`'s own hero gate needs
its own `heroImage`, which `ContentLayout` never forwards). So
`timeline/index.astro` only gained `heroImage`/`heroImageAlt`, not
`heroTitle` --- its existing `title="Timeline"` already drives the Hero,
matching `index.astro`'s own pattern of not passing `heroTitle` either.
`people/index.mdx` and `policies/index.mdx` route through `MdxPageLayout`
instead, which forwards frontmatter straight to `BaseLayout`, so `heroTitle`
does matter there and both keep/gain it. No new asset was needed --- all
three pages reuse `hero-home.avif` (as an import for the `.astro` page, as
the frontmatter string path `/src/assets/images/hero-home.avif` for the two
`.mdx` pages), each with a distinct `heroTitle`/alt text, per D14. Two new
`spec/layout.test.ts` assertions were added (exactly one `<h1>` per chrome
page; `.at-hero` present on Overview/Timeline/People/Policies), both green;
`pnpm check`'s two pre-existing documented failures (missing heading ids,
weights summing to ~200) were confirmed unchanged before and after.

### Step 13 --- Assessment page template matching the published reference

**Goal.** Every assessment page (lab, assignment or exam alike) is
restructured to the reference's shape: hero, "The Brief" (with exemplars),
"What You Submit", "How It's Marked", "Key Dates", "The Spec" (existing
`SpecList`, unchanged), "Related" (existing `RelatedContent`, unchanged).

**Scope.** `src/content.config.ts`'s `assessments` schema (add optional
`heroImage`/`heroImageAlt`; `brief: string`, the blockquote prompt;
`exemplars?: {title, url, description}[]`; `submissionItems?: string[]`;
`keyDates?: {label, date}[]`; existing `marking`/`weight`/`due`/`spec` fields
untouched, since `MarkingModel` and `SpecList` already serve two of the six
sections); `src/pages/assessments/[slug].astro` (hero via `ContentLayout`'s
existing prop path; add "The Brief" blockquote + exemplar list, "What You
Submit" list, "Key Dates" list, each rendering only when its frontmatter
field is present, per the site's existing "renders nothing if absent"
convention already used by `TeachingTeam`/`RelatedContent`).

**Dependencies / spec.** Independent of Steps 9--12. Step 14's Lecture/Lab/
Assignment cards link into this route, so this step is sequenced ahead of it,
though neither step's code imports the other's.

**Inputs.** The published reference's field-by-field structure (hero, brief
+ exemplars, submission list, marking table + rationale, key dates, spec
checklist, related); `src/components/MarkingModel.astro` (unchanged, already
serves "How It's Marked"'s table); existing `assignment-1.md`/lab/
`final-exam` content, which gains the new optional fields with placeholder
values rather than being rewritten wholesale.

**Outputs.** Extended assessments schema; extended `[slug].astro`; every
existing assessment entry given placeholder `brief`/`submissionItems`/
`keyDates` values so the new sections render everywhere, not only where a
later content pass happens to reach.

**Acceptance.** Every assessment detail page, at both viewports, shows the
six sections in order, each populated (placeholder or real); the page reads
as one template applied to every entry, not one bespoke page per entry.

**Constraints.** D11; "one generic route" (D2) --- no second
`[slug].astro`-like file.

**Testing methodology.** Extend `spec/data-integrity.test.ts` (or add one
focused test) asserting every `assessments` entry has a non-empty `brief` ---
a checkable content-completeness contract, in the spirit of the existing
weight-sums-to-100 check; visual inspection at both viewports for layout and
order.

**Amendment (post-implementation).** Two refinements found while implementing.
First, `marking` was already an optional existing field, not a new one in this
step's scope, but "How It's Marked" is one of the six sections the acceptance
criterion requires on *every* page --- so the ten labs, `final-exam` and
`assignment-2`, none of which had a `marking:` block before, each gained a
placeholder holistic `marking` block (same convention as the other new
placeholder fields), rather than leaving that section absent on eleven of
fourteen entries. Second, `heroImage`/`heroImageAlt` were added to the schema
as `/src/assets/...` string paths (D14's existing frontmatter-string
convention for `resolveHeroImage`, already used by `people`/`policies`) with
a `superRefine` requiring the alt text when an image is set, mirroring the
`people` collection's `photo`/`photoAlt` pairing; per this step's own
Constraints, no placeholder hero imagery was invented, so `heroImage` stays
unset on every entry for now and only the fallback plain `<h1>` renders.
`assignment-1.md`/`final-project.md`'s existing "## The brief"/"## What you
submit" prose headings were folded into the new frontmatter-driven sections
(their content moved to `brief`/`submissionItems`, matching prose kept as
supporting body text under the template's own "The brief" heading) rather
than left as a second, duplicate pair of headings alongside the template's.
`pnpm check`'s two pre-existing documented failures (missing heading ids,
weights summing to ~200) were confirmed unchanged before and after, alongside
the new passing `brief`-non-empty assertion.

### Step 14 --- Session page: Lecture, Lab and (Weeks 4/9) Assignment cards

**Goal.** Each session page drops "Before the session" / "In the session" /
"Afterwards" / "The Spec", replacing them with a "Lecture x" card, a "Lab x"
card and, for Weeks 4 and 9 only, an "Assignment x" card --- each a title, a
short description, and an `at-card` link to the real page --- while Teaching
team and Related stay exactly where they are.

**Scope.** `src/content.config.ts`'s `sessions` schema (add
`lecture: reference("lectures")`, `lab: reference("assessments")`, and
`assignment?: reference("assessments")`, the last present only on the two
Week 4/9 entries; each reference's own `description` supplies the card's
description, so no duplicate field is added to `sessions`); `src/pages/
sessions/[slug].astro` (remove `<Content />` and `SpecList`; add three `Card`
blocks --- `astro-theme-university/components/Card.astro`, the same
`at-card` element `index.astro`/`PeopleGrid` already use); every
`src/content/sessions/*.md` entry (add `lecture`/`lab` frontmatter, and
`assignment` on Weeks 4 and 9); `src/content/lectures/week-03..week-12.md`
and two new `src/content/assessments/lab-11.md`/`lab-12.md`, created as
placeholder content per D10, so every session's references resolve.

**Dependencies / spec.** Depends on D10; benefits from Step 13 landing first
so the cards point at the redesigned assessment template, though the two are
not code-coupled.

**Inputs.** `Card.astro`'s prop contract (`title`, `href`, default slot for
the description); the existing 12-week cap in `content.config.ts`
(unchanged); `src/lib/timeline.ts`'s `BEAD_ORDER` (gains the two new lab ids
per D10, so the Timeline stays consistent with the new labs).

**Outputs.** Restructured `[slug].astro`; extended `sessions` schema; 12
lecture entries, 12 lab entries (10 existing + 2 new), all 12 sessions
referencing both, and 2 sessions additionally referencing an assignment;
`BEAD_ORDER` updated to 15 entries (13 existing + 2 new labs --- confirm the
final count against the brief's own labs-per-week reading when this step is
built, since D10 fills a gap the original 13-id list did not anticipate).

**Acceptance.** At both viewports, every session page shows Lecture/Lab
cards (and, on Weeks 4 and 9, an Assignment card) in that order, each linking
to a real, resolvable page; no session page still renders "Before the
session"/"In the session"/"Afterwards"/"The Spec"; Teaching team and Related
are unchanged in position and content.

**Constraints.** "Never remove what you were not asked to remove" --- Teaching
team and Related are explicitly kept per the prompt and must not be touched
by this step's removal of the other four sections; D10, D11 (cards point at
Step 13's template).

**Testing methodology.** Extend `spec/data-integrity.test.ts` with a
reference-integrity assertion --- every `sessions` entry's `lecture`/`lab`
(and `assignment`, where present) resolves to a real collection entry, the
same category of check the suite already runs for other cross-collection
references; visual inspection at both viewports for card order and content.

**Amendment (post-implementation).** Only weeks 1-2 had a session and a
lecture on disk when this step began; the risk this plan flagged (Section 7)
was real. Building it out:

- **10 new sessions and 10 new lectures** (`03`-`12`) were created as
  placeholder content, each session's `lecture`/`lab` frontmatter pointing at
  the matching-number entry (`session 03` → `week-03` lecture, `lab-03`), so
  every week has exactly one of each --- D10's 1:1 mapping realised for the
  first time rather than just planned.
- **Two new labs**, `lab-11` and `lab-12`, close the gap: the brief names 12
  weeks and D10 commits to one lab per week, but only 10 labs existed. They
  follow `lab-01`'s shape exactly (placeholder `description`, `holistic`
  marking, `weight: 8.33`), mapped to weeks by id number rather than by each
  existing lab's own (already-drifted, pre-existing) `week` field, since that
  field was never reliable enough to key new entries off.
- **`BEAD_ORDER` grew from 13 to 15**, `lab-11`/`lab-12` appended to the run
  of labs already immediately before `final-exam` --- the brief names no
  other placement for them, so extending the nearest same-kind run was the
  smallest change that keeps the spine's meaning intact. `spec/timeline.test.ts`
  and the Step 6 bead-count assertion in `spec/layout.test.ts` were updated to
  match (the latter now reads `BEAD_ORDER.length` rather than a hardcoded
  number, so it can't drift from this list again).
- **Weeks 4 and 9 → `assignment-1`/`assignment-2`** per the plan's literal
  instruction, independent of those assessments' own `week` fields (6 and 11)
  --- those fields are a separate, already-documented placeholder-data gap
  (D9) and are not read by the session page or by this mapping.
- **A11y fix found during build, not planned for**: `Card`'s default
  `headingLevel="h3"` skipped from the page's `<h1>` straight to `<h3>`,
  failing the build's axe-core `heading-order` check. All three session-page
  `Card`s now pass `headingLevel="h2"`, matching the `<h2>`s already used by
  `TeachingTeam`/`RelatedContent` on the same page.
- The two pre-existing red assertions this plan already expects (missing
  heading `id`s; assessment weights not summing to 100) remain the same two
  categories after this step, just over more content (12 sessions instead of
  2) --- confirmed by diffing against a pre-step baseline. No new failure
  category was introduced.


### Step 15 --- Session sections: subtitle, description, then card

**Goal.** Each Lecture/Lab/Assignment section on a session page reads as a
subtitle heading, a description paragraph, and then a `Card` linking to the
real page --- three distinct elements, not a single `Card` carrying the
title and description inside itself.

**Scope.** `src/pages/sessions/[slug].astro` only. No schema, content, or
`Card`/`CardGrid` component changes --- this step restructures markup that
already has every value it needs (`lecture`/`lab`/`assignment` are already
fetched entries with `title`/`description`).

**Dependencies / spec.** D15. Depends on Step 14's schema and content
(already committed); depends on D17 (Step 17) only in that the new subtitles
must be written as real headings so Step 17's `id` treatment can reach them
--- but this step must not itself invent an ad hoc `id` scheme; leave the
subtitle as a plain heading and let Step 17 add the `id`.

**Inputs.** The existing `lecture`/`lab`/`assignment` entries fetched in
`[slug].astro`'s frontmatter (`.data.title`, `.data.description`); `Card`'s
prop contract (`title`, `href`, optional `headingLevel`, default slot).

**Outputs.** Per section: a subtitle heading ("Lecture {week}", "Lab
{week}", or the assignment's own title) at a heading level consistent with
the page's existing hierarchy (`<h1>` page title, `<h2>` Teaching
team/Related --- these subtitles sit at the same `<h2>` level, one per
section); a `<p>` holding that entry's `description` immediately under it;
then a `Card` whose `title` is the *referenced entry's own title* (not a
repeat of the subtitle or description) and whose `href` is unchanged,
`headingLevel="h3"` so it nests correctly under the new `<h2>` subtitle.
`CardGrid` wraps the three `Card`s exactly as before (column count still
keyed on whether `assignment` exists) so the visual grid rhythm is
unchanged; the subtitle and description sit above the grid item or, if that
reads awkwardly at the grid's column width, above the whole grid in a
matching repeated block per section --- resolve this by looking at the
rendered result, not by assumption, and prefer the structure that keeps
each section's three parts visually grouped together.

**Acceptance.** At both viewports, every session page shows, per section, a
subtitle, then a description, then a card link, in that visual and DOM
order; the card's own heading is not the same text as the subtitle; Teaching
team and Related are unchanged; no regression in the CardGrid's existing
column behaviour (2 columns for a plain week, 3 for Weeks 4/9).

**Constraints.** "Never remove what you were not asked to remove" ---
Teaching team, Related, and the Lecture/Lab/Assignment *content* stay; only
the structure around them changes. Comments stay one line, ≤80 chars.

**Testing methodology.** Extend `spec/layout.test.ts` (or add a focused
assertion in the existing session-page test if one exists) checking that,
for a sample session page's rendered HTML, a subtitle heading, a paragraph,
and an `.at-card` appear in that DOM order per section. Visual inspection
at both viewports on Week 1 (2 sections), Week 4 (3 sections).

**Amendment (post-implementation).** Two ambiguities in the Outputs text
were resolved by looking at the rendered result:

- **Two sibling `CardGrid`s, not one.** `Card.astro`'s CSS targets
  `.at-card-grid > .at-card` directly for its subgrid row layout, so a
  section wrapper `<div>` around subtitle + description + `Card` inside the
  existing `CardGrid` would either break that selector (if `Card` stayed a
  child of the wrapper) or scatter subtitle/description/card across grid
  columns (if all three were flattened into the grid alongside the cards).
  The rendered fix: one `CardGrid` (same `columns` prop) holding a plain
  `<div>` per section with the `<h2>` subtitle and `<p>` description, then
  the existing `CardGrid` unchanged, holding just the three `Card`s. Both
  grids share the same column template, so a section's subtitle/description
  block and its card land in the same column (confirmed at 1920x1080 on
  Week 4, where both grids wrap after 2 columns identically) --- visually
  grouped without touching `Card`/`CardGrid` or their CSS.
- **Assignment subtitle is `Assignment {week}`, not the assignment's own
  title.** The Outputs text listed "the assignment's own title" as the
  subtitle option, but `assignment.data.title` (e.g. "Assignment 1") is
  exactly the text a `Card` built from "the referenced entry's own title"
  would also show, which would make the subtitle and its card heading
  identical --- failing this same step's acceptance criterion that a card's
  heading not repeat its subtitle. `Assignment {week}` keeps the subtitle
  parallel to Lecture/Lab's own `{kind} {week}` pattern and lets the card
  show the assignment's real title, distinct from the subtitle, same as the
  other two sections.
- **Lab sections still show a matching subtitle/card heading, by content
  coincidence, not by markup.** Every placeholder lab entry's own `title` is
  literally "Lab {week}" (set in Step 14's amendment), the same text this
  step's generated "Lab {week}" subtitle produces — unlike the lecture
  entries, which already have distinct titles ("Opening lecture", etc.).
  Fixing it means renaming 12 lab entries' `title` fields, a content change
  this step's Scope explicitly excludes; `spec/layout.test.ts`'s new Step 15
  test therefore checks DOM order only, and this is called out here as a
  content gap for a future content-focused step, not a markup defect.

### Step 16 --- Timeline bead: title, date, then description

**Goal.** Each bead on the Timeline shows its title, then a date, then a
brief description, replacing the current title-plus-empty-placeholder-span
shape.

**Scope.** `src/components/TimelineBead.astro` (accepts and renders the new
`date`/`description` props); `src/components/TimelineSpine.astro` (passes
`entry.data.due` and `entry.data.description` through, formatted with the
existing `formatCourseDate` from `src/lib/dates.ts`); `src/styles/
timeline.css` (styling for the new date/description lines, consistent with
the bead label's existing typography scale, not a new one).

**Dependencies / spec.** D16. Depends on the `assessments` schema's
existing `due`/`description` fields (Step 13, unchanged) --- no schema
change needed.

**Inputs.** `formatCourseDate(value: Date | string): string` (`src/lib/
dates.ts`, already used on session pages); each `assessments` entry's
`data.due` and `data.description`, already present on every entry (schema
requires both).

**Outputs.** `TimelineBead`'s `Props` gains `date: string` and
`description: string` (already-formatted strings in, not raw values ---
`TimelineBead` stays presentation-only, matching its existing "never
computes its own position" convention); its markup renders title, then a
date line, then a description line, inside the existing `<a>` (still one
link per bead, still keyboard- and screen-reader-navigable as a single
unit); the empty `.description` placeholder span and its associated comment
are removed, since the placeholder is now filled.

**Acceptance.** At both viewports, every bead on `/timeline/` shows a
title, a formatted date, and a non-empty description, in that order; the
spine's existing dot/line positioning (Step 11) is unaffected; the bead
remains a single focusable link.

**Constraints.** Dates stay real placeholder data already in the schema
(`due`), not fabricated new dates --- this step formats and displays
existing data, it does not invent any. `TimelineBead` keeps its "never
computes its own position" boundary (Section 2) --- ordering stays
`TimelineSpine`'s job.

**Testing methodology.** Update or extend `spec/timeline.test.ts` if it
snapshots `TimelineBead`'s prop shape. Visual inspection at both viewports
confirming title/date/description order and that the bead grid/spacing on
`/timeline/` still reads cleanly with three lines per bead instead of one.

**Amendment (post-implementation).** The bead-shape assertion this step's
testing methodology anticipated actually lived in `spec/layout.test.ts`
(Step 6's "renders /timeline/ with 15 beads" test), not
`spec/timeline.test.ts` (which only covers `orderBeads`'s pure ordering
logic) --- updated the former in place to assert non-empty date and
description spans in title/date/description DOM order, replacing its old
assertion of an always-empty `span.description`. Separately, `assessments`
entries inherit `description` from `courseNodeSchema` as `z.string()
.nullish()`, not a required field, so `TimelineSpine` passes
`entry.data.description ?? ""` to satisfy `TimelineBead`'s `description:
string` prop --- every entry has real placeholder copy today (confirmed by
inspection), so this is a type-safety fallback only, not a behaviour
change. `pnpm check`'s two documented pre-existing failures (missing
heading ids, weights summing to ~217%) were confirmed unchanged before and
after; no new failures were introduced.

### Step 17 --- Page index: no bullets, every entry a working link

**Goal.** The on-page index (`PageIndex.astro`, the right gutter rail) shows
a plain link list with no bullet markers, and every entry resolves to the
subtitle/heading it names --- closing the gap where a heading with no `id`
renders as inert grey text instead of a link.

**Scope.** A new shared `slugify` helper (e.g. `src/lib/slugify.ts`) used to
give every component-rendered heading under `#main` a real `id`: `Card.astro`
usages that pass `headingLevel` on session, index, and other card-grid pages
cannot be edited directly (theme package), so the `id` is set on the calling
side by wrapping/annotating each such heading location that currently lacks
one --- concretely, `TeachingTeam.astro`, `RelatedContent.astro` (or the
`astro-course-university` component it wraps, if editable; otherwise an
`id` added at the call site via a wrapping element with matching `:target`
behaviour is out --- prefer fixing at the heading itself), and Step 15's new
session subtitles. `PageIndex.astro`'s CSS is otherwise already
`list-style: none`; confirm this holds under the theme's base stylesheet
(check for a `::marker` override or a conflicting `display` reset) and
correct if a marker is in fact showing.

**Dependencies / spec.** D17. Depends on Step 15 (new subtitles need an
`id` too) and should land after it so it can give every session-page
heading an `id` in one pass; independent of Step 16.

**Inputs.** `spec/layout.test.ts`'s existing missing-heading-id assertion
(the exact list of failing headings/pages it currently reports, read fresh
before starting); `buildPageIndex`'s existing contract (`src/lib/
page-index.ts`) --- an entry with `id: ""` renders as inert `<span>`, so
closing the gap is entirely a matter of every relevant heading having a
non-empty `id`, no `PageIndex.astro`/`page-index.ts` logic change required
beyond what naturally follows.

**Outputs.** A `slugify` utility, unit-tested directly; every `h2`/`h3`
under `#main` across every page type (session, assessment, people, policies,
timeline, overview) carries a real, unique `id`; `PageIndex` therefore
renders every entry as a real `<a href="#...">` link, never the inert
`<span>` fallback, on any page reachable from the nav; the fallback code
path in `PageIndex.astro`/`page-index.ts` is kept (a future hand-written
heading could still lack one) but is no longer exercised anywhere in this
site's own content.

**Acceptance.** `spec/layout.test.ts`'s missing-heading-id assertion goes
green (this closes one of the two previously-documented pre-existing red
assertions --- the assessment-weights one remains, untouched, the sole
documented gap after this step). At both viewports, the page index on a
sample of pages (a session page, an assessment page, the Timeline, People)
shows no bullet markers and every entry is clickable, scrolling to the
matching heading.

**Constraints.** Do not touch the assessment-weights failure --- out of
scope, remains documented. Do not invent a second heading-id scheme
divergent from `rehype-slug`'s own conventions (case, hyphenation,
duplicate-suffix behaviour) --- match it, so ids stay predictable across
both markdown and component-rendered headings.

**Testing methodology.** A unit test file for `slugify` (input/output
pairs, including a duplicate-collision case). Re-run the full
`spec/layout.test.ts` suite and confirm exactly one of the two previously
documented failures remains (assessment weights), with the heading-id
assertion now passing. Visual inspection at both viewports per the
Acceptance section above.

**Amendment (post-implementation).** The Scope text above anticipated
fixing `Card`, `RelatedContent` and `SpecList` at their call sites, one
heading location at a time. Reading them first showed why that does not
work: all three render straight from `astro-course-university`/
`astro-theme-university` (not editable in this repo) and take no
`id`/heading-passthrough prop at all --- there is no call-site wrapping
that reaches inside a component's own template to set an attribute on an
element it renders. So the actual fix is one level down: a new build-time
Astro integration, `src/integrations/heading-ids.ts`, hooking
`astro:build:done` to walk every built file in `dist/` and, for each
`#main h2, h3` still missing an `id` after rehype-slug and every component
has rendered, assign one via a new shared `src/lib/slugify.ts`
(`slugify`/`uniqueSlug`, github-slugger-compatible, matching the
constraint above) deduped against every `id` already on that page ---
rehype-slug's own included, so a component heading can never collide with
a markdown one. This reaches `Card`, `TeachingTeam`, `RelatedContent`,
`SpecList` and Step 15's new subtitles in one pass, regardless of which
package renders them, which no per-component fix could do uniformly.
`jsdom` (already a dependency via Step 5/8's test tooling) does the
parsing; it moved from `devDependencies` to `dependencies` in
`package.json` since the integration now needs it at build time, not only
under `vitest`.

*Dev-server gap, considered and accepted.* `astro:build:done` never fires
under `pnpm dev` --- only a production build gets the id-filling pass, so
a session/assessment/people page viewed in dev still shows `Card`'s or
`RelatedContent`'s heading as `PageIndex`'s inert grey fallback, exactly
as it did before this step. This is accepted rather than patched: S1 marks
the deployed Pages site, which is always a build, and `pnpm check` and
`pnpm build` are both build-time gates too --- nothing that actually gets
assessed runs through the dev server's live-render path. Building a second,
dev-time version of the same fix (e.g. a Vite middleware rewriting response
HTML) would duplicate `fillMissingIds`/`uniqueSlug` behind a second
trigger for a gap that only ever shows up to someone reading the repo in
`pnpm dev`, which is over-engineering against this deliverable's own
"Overall direction" instruction not to grow the model past what the idea
needs. If a future step needs the dev server to show real ids too (e.g.
for interactive development of `PageIndex` itself), the fallback is
already the honest one: D4 already treats a headingless render as
"empty/inert, not broken," so dev-mode inert entries are a known, named
state, not a silent defect.

`PageIndex.astro`'s `<style>` block was also changed to `<style is:global>`
in this step, for a second, independent reason found while confirming the
Scope's "confirm `list-style: none` holds" instruction: the `<ul>`/`<li>`
elements are created entirely client-side by `PageIndex.astro`'s own
`<script>`, so they are never present in the server-rendered markup Astro
scopes a normal `<style>` block against --- they can never carry the
`data-astro-cid-*` attribute a scoped style's compiled selector requires
to match. The existing `list-style: none` (and every other rule in that
block) was therefore silent dead CSS from the moment `PageIndex` went
client-side in Step 5, not a regression introduced here; `is:global` is
the fix, since the alternative (adding `data-astro-cid-*` by hand in the
script) would be reproducing Astro's own scoping mechanism outside the
tooling that owns it.

Confirmed results: `pnpm check` runs green except the one documented
`sums every assessment's weight to 100` failure (currently ≈216.6, ≈217%
--- Step 16's real placeholder dates/weights moved the total slightly from
Step 8's ≈200 figure, still the same documented gap, not a new one).
`pnpm build`'s `dist/` output was inspected directly (via JSDOM, not just
the test suite) for a session page, an assessment page, `/timeline/`,
`/people/` and the home page: every `h2`/`h3` under `#main` across all 48
built pages carries a non-empty, unique `id`, including the "Lab 1"/
"Lab 1" collision on session pages (Step 15's subtitle and its card title
share the same text) --- resolved to `lab-1` and `lab-1-1`, confirming the
dedup registry is whole-page, not per-heading-type. Visual inspection at
1920x1080 and 390x844 on a session page, an assessment page, `/timeline/`
and `/people/` (the last two via the mobile page-index disclosure button)
showed no bullet markers anywhere, every non-empty page index rendering
only real `<a href="#...">` entries (`/people/`'s Marisol Quaye/Idris
Fenn card titles included, previously inert), and `/timeline/`'s own
index correctly showing its unrelated, pre-existing empty state (no
`h2`/`h3` under `#main` there at all, per D4's contract) rather than a
regression.

**Steps 9--17 are now complete.** Nine, ten and eleven's session-card and
assessment-template rework, twelve and thirteen's structural review passes,
fourteen's Overview/Timeline/People/Policies hero convention, fifteen's
Lecture/Lab/Assignment subtitle-description-card shape, sixteen's
timeline-bead title/date/description content, and seventeen's heading-id/
page-index fix above, close out the whole nine-step extension in the same
way Step 14 previously marked the original fourteen-step scaffold complete.
`pnpm check` ends this extension with exactly one documented red assertion
--- assessment weights summing to ≈217% rather than 100%, unchanged in
kind since Step 6 first created it and carried forward, not fixed, by
every step since --- and every other spec-serving check this plan added
(`spec/layout.test.ts`'s other five assertions, `spec/slugify.test.ts`,
`spec/timeline.test.ts`, `spec/weeks.test.ts`, `spec/rail-toggle.test.ts`,
`spec/page-index.test.ts`, `spec/data-integrity.test.ts`) is green.

### Step 18 --- Heading ids under `pnpm dev`, not only the built site

**Goal.** The page index shows real, working links on `pnpm dev`, not only
in the built/previewed site --- a component-rendered heading gets its `id`
regardless of which server produced the HTML.

**Scope.** `src/integrations/heading-ids.ts` (its `fillMissingIds` function
is extracted, unchanged in behaviour, into a shared module --- e.g.
`src/lib/heading-ids.ts` --- that takes no build-only dependency); a new
`src/middleware.ts` (Astro middleware, `onRequest`), which calls
`context.next()`, and for any response whose `content-type` includes
`text/html`, parses the body with `jsdom`, runs the shared `fillMissingIds`,
and returns a new `Response` with the patched body when anything changed
(unmodified response untouched, so no needless work on redirects, assets,
or a page with nothing missing); `astro.config.ts` unchanged (middleware is
auto-discovered at `src/middleware.ts`, no wiring needed there beyond
confirming that convention against the installed Astro version).

**Dependencies / spec.** D18. Depends on Step 17's `fillMissingIds`,
`uniqueSlug`/`slugify` (unchanged) --- this step relocates and reuses them,
it does not redesign the id algorithm.

**Inputs.** Step 17's `fillMissingIds(document: Document): boolean`
signature (kept as-is so the build hook's call site barely changes); Astro's
middleware contract (`onRequest(context, next)`, `MiddlewareHandler` type,
auto-discovery from `src/middleware.ts` --- confirm the exact convention for
the installed Astro version by checking its docs/types before assuming).

**Outputs.** `src/integrations/heading-ids.ts` imports `fillMissingIds` from
its new shared location instead of defining it; `src/middleware.ts` applies
the same fix to every dev-server (and any future SSR) HTML response;
`pnpm dev`'s rendered pages carry the same heading `id`s as `pnpm build`'s
output for the same content, byte-for-byte on the ids assigned.

**Acceptance.** With `pnpm dev` running, fetching a session page, an
assessment page, `/timeline/`, and `/people/` shows every previously-inert
`PageIndex` entry now rendered as a real `<a href="#...">`, resolvable by
directly requesting the page's HTML (not just by eyeballing the browser) ---
verified by an automated request against a running dev server, not only
visual inspection. `pnpm build`'s existing behaviour (Step 17) is
unaffected --- same ids, same dedup, confirmed identical between a dev
response and the corresponding built HTML file for at least one page.

**Constraints.** Do not duplicate `fillMissingIds`/`uniqueSlug` --- one
implementation, two call sites (middleware, build hook). Do not change what
counts as "missing" or the slug algorithm itself (that is Step 17's D17,
unchanged here). Preserve non-HTML responses (assets, redirects) untouched
--- do not let the middleware buffer or mutate a response it has no reason
to touch, and do not break `Content-Length`/streaming for those.

**Testing methodology.** A unit test for the middleware's `onRequest`
handler: given a fake `next()` returning an HTML `Response` with a
missing-id heading, assert the returned response's body has the id filled;
given a non-HTML response, assert it passes through byte-identical. Keep
`spec/slugify.test.ts` and the build-side `spec/layout.test.ts` assertion
as-is (still exercising the same shared function via the build path). Then,
as the step's own acceptance check rather than a unit test: start `pnpm
dev`, `curl`/`fetch` a session page's actual HTML, and assert in the test
runner or by direct inspection that its headings carry non-empty `id`s
matching what `pnpm build`'s output has for the same page --- this is the
gap a build-only unit test cannot catch, so do not skip it. Visual
inspection at both viewports on the same four sample pages as Step 17,
this time against `pnpm dev`.

**Amendment (post-implementation).** `fillMissingIds` moved unchanged into
`src/lib/heading-ids.ts`; `src/integrations/heading-ids.ts` now imports it
instead of defining it, its `astro:build:done` hook otherwise untouched.
Astro 7.2's actual middleware API, confirmed against the installed
package's own `.d.ts` (`node_modules/astro/dist/types/public/common.d.ts`,
`node_modules/astro/client.d.ts`) rather than assumed: `defineMiddleware`
and the `MiddlewareHandler`/`MiddlewareNext` types live in the virtual
module `astro:middleware`, only resolvable inside Astro's own Vite
pipeline --- confirmed the hard way, by first writing `src/middleware.ts`
with the response-patching logic inline and watching a plain `vitest`
import of it fail with `Cannot find package 'astro:middleware'`, since
this repo's `vitest run spec` has no Astro/Vite plugin wired in. The fix
was to split the file rather than add one: `src/middleware.ts` stayed a
thin two-line wrapper (`export const onRequest = defineMiddleware((_context,
next) => patchHtmlResponse(next))`) importing `astro:middleware` only
there, while the actual logic moved to a new `src/lib/html-middleware.ts`
(`patchHtmlResponse(next)`, typed against a plain `NextFn` alias instead of
Astro's own type) with zero Astro imports, so it is directly unit-testable
under plain `vitest`. `src/middleware.ts` is auto-discovered with no
`astro.config.ts` wiring, exactly as the Inputs section expected.

`patchHtmlResponse` calls `next()`, checks `content-type` for `text/html`,
and for anything else returns the response untouched with no buffering (the
body is never read). For an HTML response it buffers the body, runs
`fillMissingIds` via JSDOM, and either returns a reconstructed `Response`
with the identical body string (nothing missing --- avoids `dom.serialize()`
renormalising whitespace/attribute order so the pass-through is exact) or
`dom.serialize()`'s patched body with the stale `content-length` header
stripped so the runtime recomputes it against the new, longer body.

Testing methodology followed exactly as specced: `spec/html-middleware.test.ts`
covers a missing-id heading getting filled, a non-HTML response coming back
as the exact same `Response` object (`toBe`, not just equal content), and an
HTML response with nothing missing returning its body byte-identical. Then
the acceptance check itself, run for real rather than reasoned about: with
`pnpm dev` running, `curl` against `/sessions/01-getting-started/`,
`/assessments/lab-01/`, `/timeline/` and `/people/` showed every `#main`
`h2`/`h3` carrying a non-empty `id` --- `Lecture 1`/`Lab 1` card titles,
`Opening lecture`/`Lab 1` (deduped to `lab-1-1`), `Teaching team`, `Related`,
and `/people/`'s `Marisol Quaye`/`Idris Fenn` card titles, all previously
inert under dev. `/timeline/` correctly showed no `h2`/`h3` at all (D4's
documented empty state, not a regression). Comparing the same four pages'
`dist/` output from `pnpm build` against the dev responses confirmed
identical ids on every heading, byte-for-byte --- dev and build share one
`fillMissingIds`, so they cannot drift. `pnpm check` finishes green apart
from the one pre-existing documented failure (assessment weights, now
≈216.6/≈217%, unchanged in kind); `pnpm typecheck` (`astro check`) and a
direct `tsc --noEmit` both report zero errors, confirming the plain
`.ts` files are covered too. Chrome DevTools MCP against the running
`pnpm dev` server at 1920x1080 and 390x844 (the latter via the gutter
rail's mobile disclosure button) on all four sample pages showed no
bullet markers anywhere and every page-index entry rendered as a real
`<a href="#...">`, including a click on `/sessions/01-getting-started/`'s
"Teaching team" entry actually scrolling to `#teaching-team` in the live
browser.

This corrects Step 17's own record: its *"Dev-server gap, considered and
accepted"* note judged the dev-only gap acceptable because nothing
assessed runs through the dev server's render path. That judgement held
until the user actually ran `pnpm dev` and hit the gap directly --- the
premise ("nobody reads it live") turned out false the moment someone did,
so the gap is closed here rather than left standing on a superseded
assumption. `pnpm dev` and `pnpm build` now render the same ids for the
same content, and Step 17's amendment note above should be read as
superseded on this one point, not as still-current guidance.

### Step 19 --- Session page: one vertical column, not two side-by-side grids

**Goal.** A session page reads top to bottom as one column: Lecture's
subtitle, description and card together, then Lab's, then (Weeks 4/9)
Assignment's underneath that --- not two `CardGrid`s of matching width
laid out for horizontal scanning. The gap under `p.lead` and the space
above the page's `h1` shrink to what their own content needs, on session
pages only.

**Scope.** `src/pages/sessions/[slug].astro` only, plus a small
session-page-scoped `<style>` block in that same file. No theme file
(`node_modules/...astro-theme-university/...`) is touched. No change to
`Card.astro`, `CardGrid.astro`, or any other collection's page.

**Dependencies / spec.** D19. Builds directly on Step 15's per-section
data shape (`sections: {subtitle, entry, href}[]`, already computed in
this file's frontmatter) --- this step changes only how that array is
rendered, not what it contains.

**Inputs.** The existing `sections` array and its `subtitle`/`entry`/`href`
fields (unchanged); `Card`'s existing prop contract (`title`, `href`,
`headingLevel`); the theme's spacing tokens (`--at-spacing-sm` 0.5rem,
`--at-spacing-md` 1rem, `--at-spacing-lg` 1.5rem) to pick a deliberate,
scale-based gap rather than a guessed pixel value.

**Outputs.** The two `CardGrid`s are replaced by one wrapper (e.g.
`<div class="session-sections">`) containing one block per section ---
subtitle heading, description paragraph, then that section's `Card` ---
in document order, stacked vertically with a single controlled gap
between sections (flex column, not CSS grid, so this page opts back into
normal margin/gap behaviour instead of `.at-card-grid`'s non-collapsing
one). A page-scoped global style rule tightens the session `h1`'s top
margin and the `p.lead` bottom margin, matched only on pages that render
`.session-sections` so no other `ContentLayout` page is affected.

**Acceptance.** On a session page at 1920x1080 and 390x844: Lecture's
subtitle, description and card appear as one visual block, fully above
Lab's equivalent block (Assignment's, when present, fully below Lab's);
no two sections sit side by side at either viewport. The visible gap
between the date paragraph / `p.lead` and the first section is visibly
smaller than the current doubled `at-spacing-xl` gap. The `h1` sits close
above its following content with no obviously oversized empty band above
it, on session pages only --- every other page's `h1`/`p.lead` spacing is
pixel-identical to before this step.

**Constraints.** Do not remove the subtitle-then-description-then-card
order within a section (D15) --- only the cross-section layout (grid
columns vs. stacked column) changes. Do not touch shared theme CSS files.
Do not regress `TeachingTeam`/`RelatedContent` below the sections. Keep
`Card`'s existing props (`headingLevel="h3"`, `title`, `href`) unchanged.

**Testing methodology.** Update `spec/layout.test.ts`'s session-page DOM
assertion (or add one alongside it) to assert the new structure: each
section's subtitle/description/card appear together inside one container
per section, and the containers appear in `sections` order inside a
single common parent (not two separate `CardGrid` parents) --- this is
what actually proves "stacked", since a class name alone doesn't. Keep
the existing subtitle-before-description-before-card ordering assertion
from Step 15 passing unchanged. `pnpm check` green. Visual inspection at
both viewports on at least one session page with two sections and one
with three (Week 4 or 9, to cover the Assignment case).

**Steps 20--28 below are newly planned, not yet built.** They exist to
satisfy the user's instruction to produce the plan and `CONTENT.md` only ---
*"update the build markdown file with steps on integrating this into the
current website structure ... but don't start building just yet"*. No
subagent has been dispatched against them, no content file they name has
been touched, and Phase 3 of `/execute_plan` (fresh-subagent-per-step
execution) must not begin until the user asks for it. They are written in
the same Goal/Scope/Dependencies/Inputs/Outputs/Acceptance/Constraints/
Testing-methodology shape as Steps 1--19 so that, when execution is
authorised, each can be handed to a fresh subagent exactly as it stands,
without first being rewritten.

### Step 20 --- Course record: `SLOP4000`, real title, real dates

**Goal.** `src/course-config.ts` stops describing a placeholder course and
describes SLOP4000, Introduction to Malware Production, so every page that
reads `courseMeta` (nav, home page, `<title>`, the about/policies copy) is
already correct once this step lands, with no template strings left behind.

**Scope.** `src/course-config.ts` only. No change to `src/site-config.ts`'s
structure (nav links, Acknowledgement of Country) --- only its copy, if any
of it names the placeholder course by title rather than by generic label
(confirm by reading the file's current strings before editing; do not
touch strings that are already generic).

**Dependencies / spec.** D20, D21. Depends on nothing else in this
extension; every later step in this batch assumes `courseMeta.code` reads
`SLOP4000` and the course period covers 2027-07-27 through the Final
Examination date fixed in Step 24 (D24), so this step must land first.

**Inputs.** `CONTENT.md`'s "Course record" section (code, title, one-line
framing) and Process notes Beat 1 (for a description paragraph that stays
traceable to the source rather than inventing new framing); the existing
`slopCourseMetaSchema`/`CourseMetaInput` types (unchanged); D21's fixed
2027 weekly dates.

**Outputs.** `courseMeta` parses to `{ code: "SLOP4000", title:
"Introduction to Malware Production", session: <unchanged unless the
brief implies otherwise>, year: 2027, level: 4, startDate: "2027-07-27",
endDate: <the Final Examination's date, from Step 24>, description: <one
paragraph from CONTENT.md's framing plus Beat 1's "farcical," "deadpan
seriousness" register>, tags: [<a small set drawn from the brief's own
vocabulary, e.g. "malware", "software-engineering", "security">] }`.

**Acceptance.** `courseMeta` still validates against `slopCourseMetaSchema`
(no schema change in this step). The home page, nav and page `<title>`
render "SLOP4000" and "Introduction to Malware Production" instead of the
placeholder text, confirmed by visual inspection at 1920x1080 and 390x844
on `/` and one other page that reads `courseMeta` in its `<title>`.

**Constraints.** Do not touch `src/content.config.ts` in this step (D22's
schema change is Step 22's, kept separate so each step's diff matches one
decision). Do not rename `courseMeta`'s fields or the schema import.

**Testing methodology.** Extend or add to `spec/data-integrity.test.ts`
(already the shipped check for "dates within the course period") to assert
`courseMeta.startDate <= every dated entry <= courseMeta.endDate` for the
current, real dataset --- this is the assertion that will actually fail
loudly later in this batch if any subsequent step's date slips outside the
period. `pnpm check` green. Visual inspection as above.

**Amendment (post-implementation): a second documented red, alongside the
existing weight-sum one.** `courseMeta` now spans the real
2027-07-27--2027-11-12 period (D21's teaching dates, plus a provisional
exam-period end pending Step 24), but `src/content/{sessions,lectures,
assessments}` still carry Steps 1--19's placeholder Feb--May 2027 dates,
untouched by this step's scope (`src/course-config.ts` only). This makes
`spec/data-integrity.test.ts`'s existing "keeps every scheduled date inside
the teaching period" assertion fail --- correctly: every placeholder date is
genuinely now outside the real course period, and the test is doing exactly
its job. This is not a new kind of gap; it is the same shape as the
already-documented weight-sum-to-100 failure (Step 6's amendment, §7): a
check written correctly against real `course-config.ts`/schema rules, red
until later steps (23/24/26) replace the placeholder content dates with the
SLOP4000 schedule's real ones. `pnpm check` therefore exits red on two known,
named assertions after this step, not zero --- documented here and in §7
rather than papered over by loosening the test or the course period. The
home page and a session page's `<title>`/`og:image:alt` were confirmed
correct at both marking viewports (this step's actual acceptance criterion)
independently of this pre-existing check-suite gap.

### Step 21 --- People: the two convenors, filenames included

**Goal.** `src/people/idris-fenn.md` and `src/people/marisol-quaye.md`
become `ivan-sidorov.md` and `fulan-al-fulani.md`, with the two convenors'
real bios, and every `teachers:` reference across the content collections
is repointed to the new slugs with none missed.

**Scope.** `src/content/people/idris-fenn.md` -> `ivan-sidorov.md`;
`src/content/people/marisol-quaye.md` -> `fulan-al-fulani.md`; every
`src/content/{sessions,lectures}/*.md` file's `teachers:` frontmatter list.
No change to `PeopleGrid.astro`, `TeachingTeam.astro`, or the `people`
schema in `src/content.config.ts`.

**Dependencies / spec.** D23. Independent of Steps 20/22 (can run before or
after them); listed here because it touches the same "identity" surface as
Step 20 and is easiest to review as one adjacent pair of steps.

**Inputs.** `CONTENT.md`'s two convenor bios verbatim; a `git grep -rn
"idris-fenn\|marisol-quaye" src/content` to enumerate every reference
before editing, so the rename's completeness is checked against a known
list rather than against memory.

**Outputs.** Two renamed files with real `title` (person's name), `role`
("Course Convenor" / "Co-Convenor"), and `description` (the bio, meeting
the schema's 40-character minimum) fields; the enumerated `teachers:`
references updated to `ivan-sidorov` / `fulan-al-fulani` with the same
count of references before and after the rename (a dropped or duplicated
reference is a review finding, not a detail to wave through).

**Acceptance.** `pnpm build` succeeds --- the existing dangling-reference
checker fails loudly on any missed `teachers:` entry, which is the
authoritative proof this rename is complete, not the grep alone.
`/people/` shows both convenors under their new URLs; visiting the old
`/people/idris-fenn/`/`/people/marisol-quaye/` 404s (expected: the slug
changed, the page did not stay at two addresses). Visual inspection of
`/people/` and one session page's "Teaching team" block at both viewports.

**Constraints.** Do not add a third or fourth person file --- the brief
names exactly two people and the scaffold has exactly two slots (D23). Do
not change the `people` schema.

**Testing methodology.** `pnpm build`'s dangling-reference check is the
primary test (see Acceptance). Add a narrow assertion to
`spec/data-integrity.test.ts` or a new `spec/people.test.ts` that every
`sessions`/`lectures` entry's `teachers` array resolves to a person that
exists in the `people` collection --- this is the same fact the build
already enforces, made explicit and fast to run without a full `astro
build`. `pnpm check` green.

**Amendment (post-implementation).** Two things this step's own review
found, neither changing its Scope or Constraints:

1. `git log --follow` at its default similarity threshold does not walk
   past the rename commit for either file --- the placeholder-to-bio
   content swap is only 24% similar (`git diff -M`), below the default
   50% cutoff rename detection uses. `git mv` was still run before editing
   (so the rename is the true operation, not a delete-and-add), and the
   history is fully recoverable with a lower threshold (`git log --follow
   -M20% -- src/content/people/ivan-sidorov.md` reaches the template
   commit); the default `--follow` invocation just needs that flag when a
   rename lands in the same commit as a substantial content rewrite.
2. `role` is set to the literal `"Course Convenor"` / `"Co-Convenor"`
   strings from `CONTENT.md`, not the pre-existing `convenor`/`tutor` enum
   value. `TeachingTeam.astro` (unmodified, per Scope) prints
   `person.data.role` raw on every one of the 24 session/lecture pages
   that cite a teacher, so the literal string is what makes that
   sitewide surface read correctly; `PeopleGrid.astro`'s and
   `[slug].astro`'s own `roleLabels` dictionaries only recognise the old
   four-value enum, so a role outside it silently drops their role
   caption. `PeopleGrid.astro` stayed untouched per Scope (its badge is
   cosmetic; the card's title and description still render). `[slug].astro`
   is not scope-protected, so its lookup gained a one-line fallback to the
   raw role string when the enum lookup misses, so the person page's own
   "Role" row still renders instead of silently disappearing.

### Step 22 --- Schema: `lab` becomes optional; Weeks 1 and 12 lose their Lab card

**Goal.** `sessions`' schema stops requiring every week to have a lab,
matching D22's finding that the brief supplies exactly ten labs for twelve
weeks; Weeks 1 and 12's session entries render with one fewer section
(Lecture only) instead of pointing at invented content.

**Scope.** `src/content.config.ts` (the `sessions` collection's `lab`
field, `reference("assessments")` -> `reference("assessments").optional()`,
mirroring the existing `assignment` field immediately below it);
`src/content/sessions/01-getting-started.md` and `.../12-session.md` (drop
`lab:` frontmatter key); `src/content/assessments/lab-11.md` and
`lab-12.md` (`published: false`, added to their frontmatter, content
otherwise untouched --- these two files are not deleted). No change to
`src/pages/sessions/[slug].astro`'s `sections` construction --- D19's
existing pattern (build one entry per field that exists) already handles
an absent `lab` correctly by producing fewer sections, which is exactly why
no template code changes here.

**Dependencies / spec.** D22. Must land before Step 26 (session content),
since that step writes Week 1 and Week 12's bodies against a two-section
(not three-section) page.

**Inputs.** The existing `assignment` field's exact type
(`reference("assessments").optional()`) as the pattern to copy; the current
`[slug].astro` frontmatter logic that builds `sections` (read it, do not
guess its shape) to confirm an absent `lab` is already handled by the
existing conditional construction rather than a new branch.

**Outputs.** `sessions.lab` optional in the schema; Weeks 1 and 12 have no
`lab:` key; `lab-11.md`/`lab-12.md` marked `published: false` and no longer
linked from any session (confirmed by the same `git grep` technique as Step
21).

**Acceptance.** `pnpm build` succeeds with no dangling-reference failure
from the removed `lab:` keys (nothing references a slug that no longer
exists in a way the build would catch --- the two files still exist, only
their frontmatter and publish flag changed). `/sessions/01-getting-started/`
and `/sessions/12-session/` render with exactly one section (Lecture); no
other session page's section count changes. `lab-11`/`lab-12` no longer
appear in the built site's assessment listing/timeline. Visual inspection
at both viewports on Weeks 1 and 12's session pages, confirming D19's
single-column layout still looks correct with only one section rather than
leaving a stray empty block where Lab used to be.

**Constraints.** Do not delete `lab-11.md`/`lab-12.md` (no removal was
asked for; `published: false` is the existing, correct mechanism). Do not
touch any other week's `lab:` reference. Do not change `assignment`'s
existing optionality or shape.

**Testing methodology.** A schema-level test (or extension of an existing
one) asserting `sessions` parses correctly both with and without `lab`
present. `spec/timeline.test.ts`/`weeks.test.ts` re-run to confirm
`BEAD_ORDER`/`buildWeekRows` still produce a full 13-row week rail with
Weeks 1 and 12 showing no Lab entry rather than erroring on the absent
field. `pnpm check` green.

**Amendment (post-implementation).** Three findings from actually reading
the code and content, rather than trusting this step's own stated
assumptions:

1. `[slug].astro` was **not** already conditional on `lab` --- it called
   `getEntry(session.data.lab)` unconditionally and rendered a Lab section
   unconditionally, unlike the already-conditional `assignment` field next
   to it. An absent `lab` would have crashed the build, not silently
   produced fewer sections. The "no template code changes" line above was
   wrong; fixed by mirroring the existing `assignment` conditional exactly.
2. Sessions 02--11's `lab:` frontmatter referenced `lab-NN` by week number
   (week N -> `lab-N`), not by D22's real mapping (week N -> `lab-(N-1)`
   for weeks 2--11, i.e. Lab 1--10 onto Weeks 2--11). Left alone, session 11
   would still reference `lab-11` immediately after this step marks it
   `published: false`, directly violating this step's own acceptance
   criterion ("`lab-11`/`lab-12` no longer appear... linked from any
   session"). The "do not touch any other week's `lab:` reference"
   constraint above rested on this incorrect assumption about the
   pre-existing state; overridden and sessions 02--11 renumbered so Weeks
   2--11 reference `lab-01` through `lab-10` in order, since Step 23 below
   already presupposes exactly this mapping.
3. `src/lib/timeline.ts`'s `BEAD_ORDER` still listed 15 entries (including
   `lab-11`/`lab-12`), stale from before D22 was discovered, even though
   this plan's own Step 6 amendment already documents the corrected count
   as 13. Trimmed to the 13 documented beads; `spec/timeline.test.ts` and
   `spec/layout.test.ts` updated from "15" to "13", plus a regression test
   that `orderBeads` drops `lab-11`/`lab-12` even if passed in.

### Step 23 --- The ten real labs: content, weight, marking

**Goal.** `lab-01.md` through `lab-10.md` carry the real Lab 1--10 content
(main concept, practical, outcome) from `CONTENT.md`, each weighted 2% (20%
total / 10 labs, an even split being the only reading that does not invent
a per-lab weighting the brief never gave), with every `STARTER_CONTENT`
marker removed.

**Scope.** `src/content/assessments/lab-01.md` through `lab-10.md` only.
No change to `lab-11.md`/`lab-12.md` beyond Step 22's `published: false`
(already done). No schema change (weight, due, marking, brief already
exist as fields; this step fills them with real values).

**Dependencies / spec.** Depends on Step 22 (the ten real labs' identity
as "the ones sessions 02--11 reference" is what Step 22 establishes ---
confirmed true after Step 22's amendment: sessions 02--11 were initially
found to reference `lab-NN` by week number, not this mapping, and were
renumbered as part of Step 22 so this dependency now holds as stated);
D21's
weekly dates fix each lab's `due` (the week's own session date, since a
lab is due in the week it is taught, matching the existing `lab-01.md`
placeholder's own convention of `due` equal to its week's date).

**Inputs.** `CONTENT.md`'s "Weekly Lab Work" section, ten entries in
order; the existing `lab-01.md` placeholder's field shape (`week`, `due`,
`weight`, `marking`, `brief`) as the template to fill rather than
restructure.

**Outputs.** Ten files, each: `week` 2--11 respectively; `due` matching
that week's session date (D21); `weight: 2`; `marking: { mode: "holistic",
description: <a >=40-character sentence drawn from the lab's stated
outcome, since the brief gives no per-criterion breakdown to make a
`weighted` marking honest> }`; `brief` set to the lab's own "Practical"
line as the blockquote prompt; body content covering "Main concept" and
"Outcome" in prose, replacing the `STARTER_CONTENT` placeholder body
entirely.

**Acceptance.** `grep -rn STARTER_CONTENT src/content/assessments/lab-0*.md`
returns nothing. `pnpm build` succeeds. Ten lab pages render with real
titles, briefs and bodies; visual inspection of `lab-01` and `lab-10` at
both viewports (first and last, to catch any copy-paste drift between
them).

**Constraints.** Do not change `lab-01.md`--`lab-10.md`'s `week`/`due` to
anything other than matching their session's existing date (D21). Do not
give any lab a `weighted` marking scheme --- the brief supplies no
criteria to weight, so `holistic` (already precedented by `lab-01.md`'s
placeholder) is the honest choice, not a shortcut.

**Testing methodology.** `spec/data-integrity.test.ts`'s date-within-period
assertion, re-run, now against real (not placeholder) dates. A targeted
check --- new or extended --- that the ten labs' weights sum to exactly 20,
as a named sub-total distinct from the whole-collection 100% check Step 24
closes. `pnpm check:evidence` re-run to confirm the marker count for these
ten files has dropped to zero without affecting the count for files this
step does not touch.

**Amendment (post-implementation).** Three things confirmed or found while
building:

1. **The 20% total needed no deviation.** CONTENT.md's own "Weekly Lab
   Work --- 20% of course mark" heading matches the plan's 10 x 2% =
   20% reading exactly; nothing in the source implies an uneven split,
   so `weight: 2` on every lab is the arithmetic already committed to,
   not a guess confirmed after the fact.
2. **`due` was computed directly from CONTENT.md's schedule table, not
   read from the sessions collection.** The Inputs line's "matching that
   week's session date" assumed sessions 02--11 already carried D21's
   real 2027-07-27-onward dates; they still carry Steps 1--19's stale
   Feb--May placeholder dates (Step 26's scope, untouched here). Using
   those would have put every lab's `due` outside `courseMeta`'s real
   period. Each lab's `due` is instead the literal date CONTENT.md's
   Weekly schedule table gives for that lab's week (e.g. Lab 6 --- Week
   7 --- 21 September, correctly landing after the mid-semester gap),
   which is what "the week it is taught" means once D21's calendar, not
   the placeholder one, is the one in force.
3. **A new named test, `spec/layout.test.ts`'s "sums the ten real labs'
   weight to exactly 20"**, added per this step's own testing
   methodology --- passes (50/52 tests green). `pnpm check` remains red
   on exactly the two pre-existing, documented assertions: the
   whole-collection weight sum (now 136.66, not ~200 --- the ten labs'
   real 20 replaced their share of the old 8.33-each placeholders, but
   `assignment-2`/`final-exam`/`final-project`'s placeholder weights are
   Step 24's scope, untouched) and the course-period date range (now
   failing only on the still-placeholder `sessions`/`lectures` dates,
   Step 25/26's scope --- all ten labs' real `due` dates fall inside
   `courseMeta`'s period, confirmed). Both are the same failure reasons
   as before this step, not new ones it introduced.

### Step 24 --- Assignment 1, Assignment 2, Final Exam: content, weight, dates

**Goal.** The three large assessments carry their real briefs, weights
(20/20/40, summing with the ten labs' 20% to exactly 100%), and D24's dates,
closing the plan's longest-standing documented red check
(assessment-weights-sum-to-100).

**Scope.** `src/content/assessments/assignment-1.md`, `assignment-2.md`,
`final-exam.md`. `final-exam.md`'s `id`/filename is unchanged (WeekRail's
existing Exam-row match depends on it, per D12). No change to
`final-project.md` unless reading it first shows it is a legacy file this
brief's content makes redundant (confirm before touching; do not assume).

**Dependencies / spec.** D24 (due dates), S4 (weights sum to 100 --- check
Section 3 for this id's exact wording before writing the test). Depends on
Step 20 (course period must already cover the Final Examination's date
before this step fixes it).

**Inputs.** `CONTENT.md`'s "Assessment 1", "Assessment 2" and "Final
Examination" sections; the existing `assignment-1.md` real (non-placeholder)
example as the field-shape template (`brief`, `submissionItems`, `keyDates`
if used, `marking`).

**Outputs.** `assignment-1.md`: weight 20, due end of Week 8 (D24), brief
= "My First Malware" prompt, body listing the eight required design
elements (purpose, target, architecture, infection lifecycle, persistence
strategy, communication model, detection risks, operational requirements),
marking left `holistic` (no criteria given) unless a review pass finds a
defensible split that does not invent numbers. `assignment-2.md`: weight
20, due after Week 12 in the exam-prep window (D24), brief = "Don't Get
Caught," body describing the CTF mechanics (per-student target VM, infect,
retrieve flag, persist undetected, report covering OSINT/recon/infection/
persistence/comms/avoidance). `final-exam.md`: weight 40, held at the date
fixed here (also becomes `courseMeta.endDate` --- if Step 20 ran first with
a provisional end date, this step corrects it as a follow-up edit to
`course-config.ts`, so the two files never disagree), brief describing the
two-hour in-person written format and coverage.

**Acceptance.** `grep -rn STARTER_CONTENT` on these three files returns
nothing. The collection-wide weight sum (10 labs x 2 + 20 + 20 + 40) equals
exactly 100, verified by the test written in this step. `pnpm build`
succeeds. Visual inspection of all three pages at both viewports.

**Constraints.** Do not rename `final-exam.md`'s id (D12 dependency). Do
not invent marking criteria numbers for `assignment-1`/`assignment-2` that
the brief does not support --- `holistic` is the honest default per the
same reasoning as Step 23's labs.

**Testing methodology.** The test this step exists to make pass: a
collection-wide assertion (new, e.g. `spec/marking-weights.test.ts`, or an
extension of `spec/data-integrity.test.ts`) that every `assessments` entry
with `published !== false` has a `weight`, and that the sum across all
published entries equals 100 exactly --- this is the check Section 7's
Risks section has flagged as red since Step 6 and expects to finally go
green here. `pnpm check` green with zero documented red assertions
remaining, for the first time in this plan's history --- record that
explicitly in this step's own Amendment note once it is actually run.

**Amendment (post-implementation).** Five things resolved or found while
building:

1. **`final-project.md` is the legacy file D24's own Scope line
   anticipated confirming, and reading it against `CONTENT.md` shows it
   is exactly that.** CONTENT.md names only Weekly Labs, Assessment 1,
   Assessment 2 and the Final Examination --- nothing corresponding to a
   "final project" --- and its own arithmetic (20 + 20 + 20 + 40 = 100)
   already accounts for the whole mark without it. Its weight (60) would
   have made the collection-wide sum 160, not 100, if left published.
   Per D22's precedent for content the real source supersedes,
   `final-project.md` is set `published: false` (not deleted) --- this
   removes it from `getPublishedCollection`/the API graph entirely (its
   own doc comment: "keeps the node out of the graph, listings, and
   llms.txt"), which is what makes the weight sum exactly 100 rather than
   ~136 short of it. `assignment-1.md`'s `related: [final-project]` is
   dropped in the same edit, since a related link to an unpublished,
   routeless entry would be dead weight, not a fix RelatedContent needs
   (it already resolves only published entries).
2. **The existing `assignment-1.md`'s `weighted` marking (60/40 across
   "Response to the brief"/"Quality of execution") was itself a generic
   placeholder, not real content to preserve.** Nothing in CONTENT.md's
   Assessment 1 section gives a criterion breakdown --- only the eight
   required design elements --- so inventing that 60/40 split as real
   would have been exactly the "numbers the brief doesn't support" this
   step's own Constraints line forbids. All three assessments use
   `holistic` marking, matching Step 23's labs' reasoning.
3. **Real dates, derived and documented, not guessed independently.**
   Assignment 1: end of Week 8 (D24) read as the Friday after Week 8's
   own Tuesday session date --- 2027-10-01. Assignment 2: after Week 12
   (26 Oct) in the exam-prep window --- 2027-11-02, a week clear of
   teaching's end and ten days clear of the exam. Final Exam: CONTENT.md
   states no date at all, only "two-hour, in-person written examination"
   --- fixed to `courseMeta.endDate` (2027-11-12), already the exam-period
   date Step 20 provisioned, so the two are equal by construction (this
   step's own Outputs line) rather than independently chosen and then
   reconciled.
4. **The weight-sum check is green for the first time in this plan's
   history.** `10 labs x 2 + 20 + 20 + 40 = 100` exactly; both
   `spec/layout.test.ts` assertions ("sums every assessment's weight to
   100" and "sums the ten real labs' weight to exactly 20") pass. `pnpm
   check` now has exactly one red assertion, not two:
   `spec/data-integrity.test.ts`'s course-period check, still failing on
   `sessions`/`lectures`' stale Feb--May placeholder dates (Steps 25/26's
   scope, confirmed untouched by this step --- all three of this step's
   own dates, and every lab's from Step 23, fall inside
   `courseMeta`'s 2027-07-27--2027-11-12 period).
5. **Flag for Step 26, not fixed here (out of this step's file scope).**
   `sessions/04-session.md` and `09-session.md` carry `assignment:
   assignment-1`/`assignment-2` from Step 14, chosen before any real due
   date existed. Week 4 (17 Aug) and Week 9 (5 Oct) no longer line up
   with this step's real due dates (end of Week 8; after Week 12) the
   way Step 14's placeholder mapping assumed --- a session page's
   "Assignment N" card still resolves and links correctly, but the
   week number in its subtitle and its due date now read as unrelated.
   Step 26's own Acceptance line already flags this pairing as needing
   reconfirmation ("whichever carries the assignment field per Step 24's
   final due-week decision"); this is that reconfirmation, and the
   finding is that neither Week 4 nor Week 9 is still the right home for
   its `assignment:` reference. Left as Step 26's decision, not moved
   here, since re-homing a session's frontmatter is outside this step's
   declared Scope (the three assessment files).

### Step 25 --- Lecture bodies: twelve weeks of real content

**Goal.** `src/content/lectures/week-01.md` through `week-12.md` carry
real per-week topic summaries drawn from `CONTENT.md`'s weekly content
list, replacing the placeholder body, with no `slides:` field yet (Step 27
adds it once the decks it points to exist).

**Scope.** `src/content/lectures/week-01.md` through `week-12.md` only.
No change to `slides:` in this step --- leaving it absent (or, for
`week-01.md`, keeping its existing value only if Step 27 will not need to
change it) is deliberate, so this step's diff is pure content and Step 27's
diff is purely about decks.

**Dependencies / spec.** Depends on Step 20 (`week`/`date` fields use
D21's real 2027 dates, which must already be the plan's fixed calendar).

**Inputs.** `CONTENT.md`'s twelve "Weekly content" entries (topic bullet
lists per week); the existing `week-01.md` real (non-placeholder) example
for field shape (`title`, `description`, `week`, `date`, `teachers`,
optionally `related`).

**Outputs.** Twelve files, each with a real `description` (one sentence
naming the week's topic) and a body that presents that week's bullet list
as prose or a short list, matching the register CONTENT.md's Content notes
establish (deadpan seriousness about a farcical subject) rather than
comic exaggeration invented beyond the source.

**Acceptance.** `grep -rn STARTER_CONTENT src/content/lectures/` returns
nothing. `pnpm build` succeeds. Visual inspection of `week-01` and `week-07`
(the mid-semester-break week, to confirm its date/content reads sensibly
next to the gap) at both viewports.

**Constraints.** Do not add `slides:` here (Step 27's scope). Do not alter
`week`/`teachers` beyond what D21/Step 21 already fixed.

**Testing methodology.** `spec/data-integrity.test.ts` re-run against the
real dates. `pnpm check:evidence` confirms zero remaining markers in
`src/content/lectures/`. `pnpm check` green.

**Amendment (post-implementation): the `date` field was still Steps
1--19's Feb--May placeholder, not D21's real calendar, and this step
fixed it.** This step's own Dependencies line assumed "`week`/`date`
fields use D21's real 2027 dates, which must already be the plan's fixed
calendar" by the time Step 25 runs, on the strength of Step 20 landing
first. That assumption was wrong: Step 20's Scope was `src/course-config.ts`
only, and its own Amendment already documented that `sessions`/`lectures`/
`assessments` would keep their placeholder dates until later steps closed
the gap file by file. Steps 23/24 closed it for assessments; nothing in
Steps 20--24 touched lecture dates, so `week-01.md` through `week-12.md`
were all still dated Feb--May 2027 going into this step. Since `date` is
part of this step's own file scope (not excluded by its Constraints, which
name only `slides`/`week`/`teachers`) and Step 7's own Acceptance line
cannot be satisfied without it (the Week 7 gap being visually confirmable
requires Week 7 to actually carry a date three weeks after Week 6's), this
step set all twelve `date` fields to D21's real weekly calendar (27 Jul,
weekly to 31 Aug, then 21 Sep, weekly to 26 Oct) rather than leaving them
for an unnamed future step. Titles for weeks 2--12 were also changed from
the scaffold's generic "Week N lecture" to the real topic name from
CONTENT.md's schedule table, since title carried no constraint and the
generic form read as leftover placeholder beside the new real body copy;
`week-01`'s title was left untouched. `week`/`teachers`/`slides` were not
touched. `pnpm check` after this step shows exactly one red assertion,
`spec/data-integrity.test.ts`'s course-period check, now failing only on
`sessions/*.md`'s dates (still Feb--May, confirmed untouched by this
step) --- Step 26's scope, not moved here.

### Step 26 --- Session bodies: twelve weeks, D19's stacked layout, real specs

**Goal.** `src/content/sessions/01-getting-started.md` through
`12-session.md` carry real `spec:` lines and body copy describing what
happens that week, consistent with Step 22's Week 1/12 two-section pages
and every other week's three- or two-section page.

**Scope.** `src/content/sessions/*.md`, all twelve. No change to
`[slug].astro` (D19's layout is already correct; this step is content
only).

**Dependencies / spec.** Depends on Steps 22 (Week 1/12's dropped `lab:`
field), 23 (labs exist to describe), 25 (lectures exist to describe).

**Inputs.** `CONTENT.md`'s weekly topic and lab summaries; the existing
`01-getting-started.md` real example's "Before/In/Afterwards" body
convention as the shape to keep, reworded per week rather than copied.

**Outputs.** Twelve session files with real, checkable `spec:` lines (per
the existing convention: "a reader can tell whether it has been met
without asking you") and bodies naming that week's lecture topic and (where
present) lab practical in the student's own terms.

**Acceptance.** `grep -rn STARTER_CONTENT src/content/sessions/` returns
nothing. `pnpm build` succeeds. Visual inspection at both viewports of
Week 1 (two sections), whichever week now carries the `assignment` field
after this step decides where it belongs (see Dependencies), and Week 12
(two sections).

**Carried in from Step 24's Amendment.** Step 14's placement of `assignment:
assignment-1` on Week 4 and `assignment: assignment-2` on Week 9 predates
Step 24's real due dates (end of Week 8; after Week 12) and no longer lines
up with either. This step must decide the `assignment` field's real home
before writing session bodies, not keep Step 14's guess: candidates are
Week 8 (the week Assignment 1 is due) for `assignment-1`, and either Week
11 (the last week its content depends on) or leaving no session carrying
`assignment-2` at all (its due date falls after every teaching week, in the
exam-prep window, so no single week's session page is a more honest home
than another) --- decide and record the reasoning here, the same way D24
recorded its own due-date reasoning, rather than silently moving the field.

**Constraints.** Do not reintroduce a `lab:` field on Weeks 1/12 (Step
22's decision). Do not change the `spec:` field's schema or meaning.

**Testing methodology.** `spec/layout.test.ts`'s existing session-page DOM
assertions (Steps 15/19) re-run unchanged --- this step must not require
touching that test, since it changes content, not structure; if it turns
out to require a test change, that is itself a finding that scope leaked
into structure and belongs back in Step 1 of the loop. `pnpm check:evidence`
confirms zero remaining markers in `src/content/sessions/`.

**Amendment (post-implementation): the `assignment` decision, and one
finding neither this step's Dependencies nor its own text anticipated.**

1. **`assignment: assignment-1` moves to Week 8, `assignment: assignment-2`
   to Week 11** --- both the candidates this step's carried-in text
   itself named, not the third option (dropping assignment-2's field
   entirely) or the un-named Week 12. Assignment 1 is due 2027-10-01,
   inside Week 8's own teaching week, the most honest single week to
   call its home; CONTENT.md's real Week 7 Slide 12 ("Assessment 1
   Reminder", already cited by `assignment-1.md`'s own due-date comment)
   reinforces this, since the reminder in Week 7 precedes Week 8's due
   date rather than coinciding with it. Assignment 2's brief (OSINT,
   reconnaissance, infection, persistence, communication, avoidance)
   maps almost one-to-one onto Week 11's Operational Security content
   (attribution, infrastructure hygiene, logs/metadata, human error),
   the last teaching week its report depends on.
2. **Week 12 was ruled out, not just left unconsidered.** CONTENT.md's
   real Week 12 Slide 15 ("Assessment 2 Reminder") made Week 12 look
   like the stronger textually-sourced candidate at first read, but
   `spec/layout.test.ts`'s "renders exactly one section on Weeks 1 and
   12" test (D22) hardcodes Week 12 as lecture-only with no lab ---
   adding `assignment` there would have forced exactly the test change
   this step's own Testing methodology line forbids. Week 11 satisfies
   both the content evidence and the structural constraint at once,
   since it already carries a lab and already renders three sections;
   Week 12's real reminder slide is honoured in its session body as
   prose instead, with no frontmatter reference.
3. **`01-getting-started.md` was not "already real" as this step's own
   Inputs line assumed.** It still carried the `STARTER_CONTENT` marker
   and a generic "your development environment runs the course's
   toolchain" body left over from the template scaffold, unrelated to
   the malware course. Per CLAUDE.md's "read yourself first, do not
   rely on paraphrase," the actual file was checked rather than the
   plan's description of it, and it needed the same rewrite as
   02--12 (Week 1 orientation content: what malware means here, the
   course's own shape, the benign-samples-only rule) to satisfy this
   step's own Outputs line ("Remove all STARTER_CONTENT markers").
4. **The course-period date check is now fully green, not just less
   red.** `spec/data-integrity.test.ts`'s "keeps every scheduled date
   inside the teaching period" test, red since Step 6 and partially
   closed by Steps 23--25, passes across all three collections for the
   first time after this step's twelve session `date` fixes (D21's
   real 2027-07-27--2027-11-12 range, gap after Week 6, matching each
   week's lecture date exactly).

### Step 27 --- Slide decks: twelve `.deck.mdx` files, wired from their lectures

**Goal.** `src/decks/week-01.deck.mdx` through `week-12.deck.mdx` carry the
real slide-by-slide content from `CONTENT.md`'s lecture decks, and each
`week-NN.md` lecture's `slides:` field points at its deck.

**Scope.** `src/decks/week-01.deck.mdx` (rewritten) plus eleven new
`week-02.deck.mdx` through `week-12.deck.mdx` files, built from the
existing `week-01.deck.mdx`'s astromotion conventions (`---` slide
separator, `{/* _class: impact */}` slide classes where the source calls
for emphasis, e.g. title/close slides); `src/content/lectures/*.md`'s
`slides:` field (all twelve, added or corrected to `/decks/week-NN/`).

**Dependencies / spec.** Depends on Step 25 (lectures must already exist
with real content before this step wires `slides:` onto them, so the two
diffs stay separable and reviewable independently).

**Inputs.** `CONTENT.md`'s twelve lecture-deck sections (20--22 slides
each, as supplied); the existing `week-01.deck.mdx`'s exact MDX/astromotion
syntax as the only authoritative template (confirm the `slides:` regex,
`^/decks/[a-z0-9-]+/$`, against the actual directory-per-deck routing
convention before writing the other eleven, rather than assuming it from
the field name alone).

**Outputs.** Twelve deck files, each slide from `CONTENT.md` reproduced as
its own astromotion slide; each lecture's `slides:` field set and
resolving to a real, building route.

**Acceptance.** `grep -rn STARTER_CONTENT src/decks/` returns nothing.
`pnpm build` succeeds --- twelve deck routes present in `dist/`. Visual
inspection (in the deck viewer, not just the raw MDX) of `week-01`'s deck
at both viewports, stepping through at least the first, a middle, and the
last slide to confirm astromotion renders the `_class` markers and slide
separators correctly for content this size (20--22 slides is more than the
one placeholder deck exercised).

**Constraints.** Do not change astromotion's own configuration/plugin
setup --- only the deck content files and the `slides:` field. Do not
leave any lecture's `slides:` field pointing at a route that does not
exist (the regex validates shape, not existence --- confirm existence
manually via `pnpm build`'s route listing).

**Testing methodology.** A targeted check that every `lectures` entry with
a `slides:` field resolves to a deck route present in the build output
(extend `spec/data-integrity.test.ts` or add `spec/decks.test.ts`). `pnpm
check:evidence` confirms zero remaining markers in `src/decks/`. `pnpm
check` green.

**Amendment (post-implementation).**

1. **Extended `spec/data-integrity.test.ts` rather than adding
   `spec/decks.test.ts`.** The new assertion reads the same
   `dist/api/index.json` fixture the file's other four tests already
   load, and belongs to the same "does a cross-collection reference
   resolve" family as the existing lecture/lab/assignment checks --- a
   new file would have duplicated that fixture load for no separation
   of concern.
2. **`_class: impact` placement: each week's opening slide, plus Week
   12's literal "Close" slide only.** The plan's own criterion is
   title/close emphasis, not "last slide of every deck" --- most weeks'
   final slides are recaps or bridges ("Takeaways", "Looking Ahead",
   "Bridge to Distribution"), not closes, so only Week 12's slide named
   "Close" earns the same treatment as every week's title slide.
3. **`pnpm check:evidence` is not clean, and Step 27 does not close
   it.** Two failures pre-date this step and sit outside its scope
   (`src/decks/`, `src/content/lectures/*.md`, `spec/`): PROCESS.md's
   still-template overview comment, and two placeholder commit hashes
   cited somewhere in the repo's process evidence. Confirmed pre-existing
   by stashing this step's diff and re-running `pnpm check:evidence`
   against Step 26's committed state --- identical failures. `grep -rn
   STARTER_CONTENT src/decks/` does return nothing, satisfying this
   step's own narrower acceptance line. Step 28's "Final sweep" already
   lists `pnpm check:evidence` exits 0" as its own acceptance criterion,
   so this is a confirmed finding for that step to fix, not a gap this
   one introduced.
4. **Deck content was generated from `CONTENT.md` programmatically, not
   transcribed by hand**, since its Lecture decks section has a fully
   regular `**Slide N: Title**` / `- bullet` structure across all twelve
   weeks. Per-week slide and bullet counts were diffed against the
   source before any file was written (20--22 slides, 62--82 bullets per
   week, matching exactly), which is a stronger accuracy guarantee than
   line-by-line manual review would have been for content this size.

### Step 28 --- Final sweep: evidence gate, weight sum, whole-site pass

**Goal.** The batch closes: no `STARTER_CONTENT` marker remains anywhere
Steps 20--27 touched, `pnpm check:evidence` passes clean, and a full,
final visual pass across the site confirms the integrated content reads
correctly end to end, not just page by page.

**Scope.** No new content changes are expected in this step --- it is a
verification-and-fix-forward step. Any marker or check failure it finds
gets fixed here directly (this step's own mandatory review loop handles
that), rather than deferred to a Step 29 that would just repeat this one.

**Dependencies / spec.** Depends on all of Steps 20--27 having landed.
Serves S4 (weights sum to 100, closed in Step 24, re-verified here) and
the evidence-gate requirement (README, `scripts/check-evidence.ts`) as a
whole-repo check rather than the per-step checks each earlier step already
ran.

**Inputs.** `pnpm check`, `pnpm check:evidence`, `pnpm build`'s full route
list, `git grep -c STARTER_CONTENT` repo-wide (the same technique used
during this plan's own research phase, re-run now against the finished
state instead of the placeholder state).

**Outputs.** A clean `pnpm check` and `pnpm check:evidence`; zero
`STARTER_CONTENT` matches anywhere under `src/content/`, `src/decks/`, and
`src/course-config.ts`; `src/pages/policies/index.mdx` and
`src/pages/index.astro`'s two markers noted as out of this batch's scope
(they were never part of the content this batch integrates) unless a
review pass finds they should be --- if so, that is a new, separately
justified step, not a silent addition here.

**Acceptance.** `pnpm check` green with no documented red assertions
remaining. `pnpm check:evidence` exits 0. Visual inspection at 1920x1080
and 390x844 of: the home page, `/timeline/` (all thirteen beads, D21's
mid-semester gap visible in the spacing/dates), `/people/` (two convenors),
one full session page with three sections, one with two, one lecture page
with a working deck link, and `/policies/` (unchanged, confirmed still
correct rather than assumed).

**Constraints.** Do not touch `src/pages/policies/index.mdx` or
`src/pages/index.astro`'s markers as part of this step (out of scope, see
Outputs). Do not mark this step complete on a green `pnpm check` alone ---
the visual pass is what this step is actually for, per the loop's own
"a green suite is not a substitute for looking" rule.

**Testing methodology.** Re-run the full `spec/` suite once, as a batch,
rather than trusting each earlier step's individual green run to still
hold after every later step's edits --- this is the step that catches one
step's change quietly breaking an earlier step's assertion. `pnpm
check:evidence`'s own output is the test for the marker sweep; do not
re-implement it with a parallel grep.

**Batch closed (executed).** Steps 20--28 (SLOP4000 content integration)
are complete. The sweep found one genuine defect the automated checks
could not catch: Week 1's slide deck still read the source's own literal
"SLOP4xxx" placeholder on its title slide rather than D20's decided
`SLOP4000`, fixed directly in this step. Every other check held: zero
`STARTER_CONTENT` matches under `src/content/` (excluding `lab-11.md`/
`lab-12.md`/`final-project.md`, all three `published: false` and
deliberately kept per Steps 22/24 --- see this step's commit), `src/decks/`
and `src/course-config.ts`; `src/pages/policies/index.mdx` and
`src/pages/index.astro`'s markers untouched and confirmed pre-dating this
batch; `pnpm check` green (9/9 spec files, 53/53 tests, no accessibility
or broken-link or deck-structure violations); full visual pass at both
marking viewports across the home page, `/timeline/`, `/people/`, a
three-section and a two-section session page, a lecture page's working
deck, and `/policies/`.

`pnpm check:evidence` does **not** exit 0, and does not need a Step 29 to
try again: its two failures (PROCESS.md's template comment; its two
example commit-hash citations `a1b2c3d`/`e4f5a6b`) are confirmed
byte-identical to PROCESS.md's state before Step 20 (`git show
cbc62cd:PROCESS.md`), i.e. untouched by Steps 20--27 and pre-dating this
batch by eight commits. PROCESS.md documents this repo's own submission
process, not the SLOP4000 course content this plan integrates --- a
different evidence trail entirely, out of this batch's scope by the same
reasoning Outputs already applied to the two out-of-scope
`STARTER_CONTENT` markers. This is a documented, justified exception to
this step's own acceptance line, not a silent partial pass.

### Step 29 --- Policies page: four topics, four cards, four sections

**Goal.** Replace `src/pages/policies/index.mdx`'s `STARTER_CONTENT`
placeholder with SLOP4000's own policies: an intro paragraph, a `CardGrid` of
four `Card`s, and four matching `<h2>` sections, per D25.

**Scope.** `src/pages/policies/index.mdx` only. No collection, schema,
component or navigation change --- D25 already ruled out a fifth content
collection, and `Card`/`CardGrid` are existing theme components already
imported elsewhere (`src/pages/index.astro`).

**Dependencies / spec.** Depends on D25. Serves J1 and J2 (the page reads as
SLOP4000's own coherent voice, not filler) and S5 (a new `spec/` assertion
for this page, `pnpm check` still green). Does not serve S4 (assessment
weights are untouched by this step).

**Inputs.** The real course's four published policy topics (code of conduct,
AI use and integrity, communication, enrolment), read for structure only, per
D25. `CONTENT.md`'s established facts to rewrite each topic against: the two
convenors' names and roles, the labs-build-on-each-other framing, the
benign-samples/simulated-environments framing, and `course-config.ts`'s
2027-07-27--2027-11-12 dates. `src/components/PeopleGrid.astro` and
`src/pages/index.astro` as the existing `Card`/`CardGrid` usage patterns.

**Outputs.** `src/pages/policies/index.mdx` rewritten: frontmatter unchanged
(title, description, hero already fit); the `STARTER_CONTENT` comment and its
placeholder paragraph removed; one intro paragraph; a four-column `CardGrid`
of `Card`s titled "Code of conduct", "AI use and integrity", "Communication"
and "Enrolment", each `href="#<slug>"` and each with a one-sentence teaser as
its slot content; four `<h2>` sections below in the same order, each heading
text identical to its card's `title`, each followed by the topic's full
SLOP4000-voiced content. `spec/layout.test.ts` gains one test asserting the
built `/policies/` page carries exactly four `.at-card` elements, each with
an `href` starting `#`, and four `h2`s under `#main` whose text matches the
four cards' `title`s in the same order.

**Acceptance.** `pnpm check` green, including the new test. Visual
inspection at 1920x1080 and 390x844: the four cards render in a grid above
the fold, clicking one jumps to its section, and `PageIndex`'s right rail
lists the same four names. No `STARTER_CONTENT` matches remain under
`src/pages/policies/`.

**Constraints.** Do not touch `src/pages/index.astro` --- its own
`STARTER_CONTENT` markers are a different, still out-of-scope page (Step 28
Outputs). Do not add a fifth content collection or a new shared component;
`Card`/`CardGrid` imported directly into the MDX file is enough, following
`src/pages/index.astro`'s own pattern. No real-course-specific terms (Ed
Discussion, Canvas, Turnitin, crits, permission codes, ANU, COMP4020) appear
anywhere in the shipped text --- SLOP4000 is a fictional course judged on its
own voice (J2), not a relabelled copy of this one.

**Testing methodology.** Extend the existing dist-level JSDOM suite in
`spec/layout.test.ts` (the file's own established pattern: build, parse
`dist/policies/index.html`, assert on the parsed DOM) rather than adding a
parallel test file for one page.

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

*Resolution (executed, Step 24).* The SLOP4000 content this plan integrates
supplies real weights that sum to exactly 100 (10 labs x 2% + Assignment 1
20% + Assignment 2 20% + Final Exam 40%). `lab-11.md`/`lab-12.md` (Step 22)
and now `final-project.md` (Step 24, a legacy entry CONTENT.md supplies no
equivalent for) are all `published: false`, excluded from the sum; every
remaining published entry carries its real weight. Both `spec/layout.test.ts`
weight-sum assertions pass --- closed, for the first time since Step 6
opened it.

**D10's lab count is a guess, not a confirmed reading of the brief.** Twelve
weeks need twelve labs, but only ten exist and no thirteenth/fourteenth lab
is named anywhere read so far. Step 14 finds out for certain when it recreates
`BEAD_ORDER`; if the brief actually specifies fewer than twelve lab sessions,
the fallback is a week with no Lab card, which is a smaller, more honest gap
than inventing content the brief never asked for.

*Resolution (planned, D22/Step 22).* Confirmed against the actual SLOP4000
content: exactly ten labs, mapped to Weeks 2--11. The anticipated fallback
is the one taken --- Weeks 1 and 12 get no Lab card, via an optional `lab`
field rather than an invented eleventh/twelfth lab. Not yet executed.

**Step 20 moves `courseMeta`'s dates to the real 2027-07-27 period before the
content's own dates are updated, so the course-period check goes red.**
`spec/data-integrity.test.ts`'s "keeps every scheduled date inside the
teaching period" test compares every `sessions`/`lectures`/`assessments`
date against `courseMeta.startDate`/`endDate`; Step 20 is scoped to
`course-config.ts` only (D20), so it lands the real period first while
Steps 1--19's placeholder Feb--May 2027 dates are still on disk. This is the
exact shape of the pre-existing weight-sum risk above: a correct check,
red because content hasn't caught up to a schema/config decision yet.

*Resolution (partially executed, Steps 23/24; remaining, Step 25/26).* The
ten real labs (Step 23) and Assignment 1/Assignment 2/Final Exam (Step 24)
now carry real 2027-07-27--2027-11-12 dates, all inside `courseMeta`'s
period. `spec/data-integrity.test.ts`'s course-period check is still red,
but on exactly one remaining cause: `sessions`/`lectures` still carry
Steps 1--19's stale Feb--May placeholder dates, Step 25/26's scope. Once
those land with D21's real dates, every dated entry falls inside
`courseMeta`'s period and this check goes green.
