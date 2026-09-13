// Collects the dist-level contracts named as acceptance criteria in
// BUILD_PLAN.md Steps 1, 4, 5, 6 and 7 (§6, Step 8) into one committed suite.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { JSDOM } from "jsdom";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { BEAD_ORDER } from "../src/lib/timeline";
import { gitOrigin, resolveDeployment } from "../scripts/pages-base";

const DIST = resolve("dist");
const BASE = resolveDeployment(process.env, gitOrigin).base.replace(/\/$/, "");

/** Every built *.html file under dist/, as an absolute path. */
function allHtmlFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = resolve(dir, entry);
    if (statSync(path).isDirectory()) files.push(...allHtmlFiles(path));
    else if (entry.endsWith(".html")) files.push(path);
  }
  return files;
}

const htmlFiles = allHtmlFiles(DIST);

// /decks/ pages are astromotion slide decks, a separate template with no
// PageLayout, no WeekRail, no #main and no footer (confirmed against the
// built output) — excluded from the site-chrome assertions below.
const chromePages = htmlFiles.filter((path) => !path.includes(`${resolve(DIST, "decks")}/`));

function parse(path: string): Document {
  return new JSDOM(readFileSync(path, "utf8")).window.document;
}

describe("layout contracts (BUILD_PLAN.md Step 8)", () => {
  // Step 1: the three replaced index pages must not be in the built output.
  it("removes the sessions, lectures and assessments index pages", () => {
    for (const route of ["sessions", "lectures", "assessments"]) {
      expect(existsSync(resolve(DIST, route, "index.html"))).toBe(false);
    }
  });

  // Step 10 (D12): every page carries the 12-row WeekRail (Weeks 1-12);
  // the Exam row moved to the Timeline.
  it("renders exactly 12 WeekRail rows on every chrome page", () => {
    expect(chromePages.length).toBeGreaterThan(0);
    for (const path of chromePages) {
      const rail = parse(path).querySelector("ul.week-rail");
      expect(rail, `${path} has no ul.week-rail`).not.toBeNull();
      const rows = rail!.querySelectorAll(":scope > li");
      expect(rows.length, `${path} has ${rows.length} week-rail rows`).toBe(12);
    }
  });

  // Step 4: the matching session page's row carries aria-current="page".
  it("marks the current week's WeekRail row with aria-current", () => {
    const rail = parse(resolve(DIST, "sessions/01-getting-started/index.html")).querySelector("ul.week-rail");
    const current = rail!.querySelectorAll('li[aria-current="page"]');
    expect(current.length).toBe(1);
  });

  // Step 5 (D4): every h2/h3 under #main should carry a non-empty id.
  // Known gap (Step 5 amendment): theme-rendered SpecList/RelatedContent/
  // Card titles and some hand-written page headings currently lack one —
  // this is expected to fail today, not a bug in the assertion.
  it("gives every h2/h3 under #main a non-empty id", () => {
    const missing: string[] = [];
    for (const path of chromePages) {
      const main = parse(path).querySelector("#main");
      if (!main) continue;
      for (const heading of main.querySelectorAll("h2, h3")) {
        if (!heading.id) {
          missing.push(`${path}: <${heading.tagName.toLowerCase()}> "${heading.textContent?.trim()}"`);
        }
      }
    }
    expect(missing, `headings with no id:\n${missing.join("\n")}`).toEqual([]);
  });

  // Step 6/14 (D9's documented order); Step 22 (D22) drops lab-11/lab-12,
  // the two weeks the brief's ten real labs don't cover, to 13 beads.
  // Step 16 (D16): each bead now shows title, date, then description.
  it("renders /timeline/ with 13 beads in the documented semester order", () => {
    const beads = parse(resolve(DIST, "timeline/index.html")).querySelectorAll(
      "ol.timeline-spine > li.timeline-bead",
    );
    expect(beads.length).toBe(BEAD_ORDER.length);

    for (const [index, bead] of [...beads].entries()) {
      const link = bead.querySelector("a[href]");
      expect(link, `bead ${index} has no link`).not.toBeNull();
      expect(link!.getAttribute("href")).toBe(`${BASE}/assessments/${BEAD_ORDER[index]}/`);

      const label = bead.querySelector("span.timeline-bead-label");
      const date = bead.querySelector("span.timeline-bead-date");
      const description = bead.querySelector("span.timeline-bead-description");
      expect(label, `bead ${index} has no label span`).not.toBeNull();
      expect(date, `bead ${index} has no date span`).not.toBeNull();
      expect(description, `bead ${index} has no description span`).not.toBeNull();
      expect(date!.textContent).not.toBe("");
      expect(description!.textContent).not.toBe("");

      // title, then date, then description, in DOM order.
      const order = [...bead.querySelectorAll("span")].filter((span) =>
        [label, date, description].includes(span),
      );
      expect(order).toEqual([label, date, description]);
    }
  });

  // Step 7: acknowledgement text precedes the theme toggle in DOM order.
  it("puts the footer acknowledgement before the theme toggle on every page", () => {
    for (const path of chromePages) {
      const bottom = parse(path).querySelector(".at-footer-bottom");
      expect(bottom, `${path} has no .at-footer-bottom`).not.toBeNull();

      const acknowledgement = bottom!.querySelector(".at-footer-acknowledgement");
      const toggle = bottom!.querySelector(".at-footer-legal button.at-footer-theme-toggle");
      expect(acknowledgement, `${path} has no acknowledgement`).not.toBeNull();
      expect(toggle, `${path} has no theme-toggle button`).not.toBeNull();

      // 4 = Node.DOCUMENT_POSITION_FOLLOWING: acknowledgement comes first.
      const position = acknowledgement!.compareDocumentPosition(toggle!);
      expect(position & 4, `${path}: toggle precedes acknowledgement`).toBeTruthy();
    }
  });

  // Step 12 (D14): every chrome page has exactly one h1, and Overview,
  // Timeline, People and Policies each render the shared at-hero element.
  it("has exactly one h1 per chrome page", () => {
    for (const path of chromePages) {
      const h1s = parse(path).querySelectorAll("h1");
      expect(h1s.length, `${path} has ${h1s.length} h1 elements`).toBe(1);
    }
  });

  it("shows a hero on Overview, Timeline, People and Policies", () => {
    for (const route of ["", "timeline", "people", "policies"]) {
      const path = resolve(DIST, route, "index.html");
      const hero = parse(path).querySelector(".at-hero");
      expect(hero, `${path} has no .at-hero`).not.toBeNull();
    }
  });

  // Step 15 (D15): each session section is subtitle, then description,
  // then a card, in that DOM order, one card per subtitle.
  //
  // Step 32 (D28): subtitle/title number match was never a coincidence —
  // it was a week-number bug (D22 broke 1:1 lab/week numbering). Fixed by
  // deriving the subtitle from the entry's own id; asserted directly below.
  // Step 30 (D26): the description moved into the card's own slot, so a
  // section is now subtitle immediately followed by its card, one card per
  // subtitle, with the card's own body carrying real, non-title text.
  it("orders each session section as subtitle, then card, with a described card body", () => {
    const paths = [
      resolve(DIST, "sessions/01-getting-started/index.html"),
      resolve(DIST, "sessions/08-session/index.html"),
    ];
    for (const path of paths) {
      const main = parse(path).querySelector("#main")!;
      const subtitles = [...main.querySelectorAll("h2")].filter((h) =>
        /^(Lecture|Lab|Assignment) \d+$/.test(h.textContent?.trim() ?? ""),
      );
      const cards = [...main.querySelectorAll(".at-card")];
      expect(subtitles.length, `${path}: section/card count mismatch`).toBe(cards.length);

      for (const [index, subtitle] of subtitles.entries()) {
        const card = subtitle.nextElementSibling;
        expect(card?.classList.contains("at-card"), `${path}: "${subtitle.textContent}" not followed by its card`).toBe(
          true,
        );
        expect(card, `${path}: "${subtitle.textContent}"'s card is not in card order`).toBe(cards[index]);

        const title = card!.querySelector(".at-card-title")?.textContent?.trim();
        const body = card!.querySelector(".at-card-body p")?.textContent?.trim();
        expect(body, `${path}: "${subtitle.textContent}"'s card has no description`).toBeTruthy();
        expect(body, `${path}: "${subtitle.textContent}"'s card body just repeats the title`).not.toBe(title);

        // Step 32 (D28): a Lab/Assignment subtitle's number must equal the
        // number parsed from its own card's title, not just look plausible.
        const kind = subtitle.textContent?.trim().match(/^(Lab|Assignment) (\d+)$/);
        if (kind) {
          const [, label, subtitleNumber] = kind;
          const titleNumber = title?.match(/^\D*(\d+)/)?.[1];
          expect(
            titleNumber,
            `${path}: "${label} ${subtitleNumber}"'s card title "${title}" has no leading number`,
          ).toBeTruthy();
          expect(
            titleNumber,
            `${path}: subtitle "${label} ${subtitleNumber}" disagrees with card title "${title}"`,
          ).toBe(subtitleNumber);
        }
      }
    }
  });

  // Step 19 (D19): sections stack in one column, not two side-by-side
  // CardGrids — each section's subtitle/card share one container, and
  // those containers sit in `sections` order inside a single common
  // parent. Step 30 (D26): a section is now two children, not three —
  // the description moved into the card's own slot.
  it("stacks each session section in one column, not two card grids", () => {
    const paths = [
      resolve(DIST, "sessions/02-first-review/index.html"), // Lecture + Lab
      resolve(DIST, "sessions/08-session/index.html"), // + Assignment
    ];
    for (const path of paths) {
      const main = parse(path).querySelector("#main")!;
      const wrapper = main.querySelector(".session-sections")!;
      expect(wrapper, `${path} has no .session-sections wrapper`).not.toBeNull();
      expect(main.querySelectorAll(".at-card-grid"), `${path} still renders a CardGrid`).toHaveLength(0);

      const sectionEls = [...wrapper.children];
      expect(sectionEls.length, `${path}: expected at least 2 sections`).toBeGreaterThanOrEqual(2);

      for (const section of sectionEls) {
        expect(section.parentNode, `${path}: section has no common parent`).toBe(wrapper);
        const [heading, card] = [...section.children];
        expect(heading?.tagName, `${path}: section's first child isn't a subtitle`).toBe("H2");
        expect(card?.classList.contains("at-card"), `${path}: section's second child isn't a card`).toBe(true);
      }
    }
  });

  // Step 22 (D22): Weeks 1 and 12 have no lab, so their session page
  // renders exactly one section (Lecture only), not a stray empty block.
  it("renders exactly one section on Weeks 1 and 12, which have no lab", () => {
    for (const id of ["01-getting-started", "12-session"]) {
      const main = parse(resolve(DIST, "sessions", id, "index.html")).querySelector("#main")!;
      const wrapper = main.querySelector(".session-sections")!;
      expect(wrapper, `${id} has no .session-sections wrapper`).not.toBeNull();
      expect(wrapper.children.length, `${id}: expected exactly one section`).toBe(1);
      expect(wrapper.children[0].querySelector("h2")?.textContent).toMatch(/^Lecture \d+$/);
    }
  });

  // Step 6 / §7 risk: assessment weights must sum to 100% (S4). Expected
  // red until Step 6's 12 placeholder weights are replaced with real ones.
  it("sums every assessment's weight to 100", () => {
    const api = JSON.parse(readFileSync(resolve(DIST, "api/index.json"), "utf8")) as {
      nodes: { type: string; meta?: Record<string, unknown> }[];
    };
    const weights = api.nodes.filter((node) => node.type === "assessments").map((node) => Number(node.meta?.weight));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    expect(total, `assessment weights currently sum to ${total}, not 100`).toBeCloseTo(100, 1);
  });

  // Step 23: the ten real labs (2% each) are their own named sub-total,
  // distinct from the whole-collection 100% check above (still red until
  // Step 24 lands assignment-2/final-exam/final-project's real weights).
  it("sums the ten real labs' weight to exactly 20", () => {
    const api = JSON.parse(readFileSync(resolve(DIST, "api/index.json"), "utf8")) as {
      nodes: { type: string; id: string; meta?: Record<string, unknown> }[];
    };
    const labWeights = api.nodes
      .filter((node) => node.type === "assessments" && /\/lab-(0[1-9]|10)$/.test(node.id))
      .map((node) => Number(node.meta?.weight));
    expect(labWeights, "expected exactly ten real labs").toHaveLength(10);
    const total = labWeights.reduce((sum, weight) => sum + weight, 0);
    expect(total, `lab-01..lab-10 weights currently sum to ${total}, not 20`).toBeCloseTo(20, 1);
  });

  // Step 29 (D25): four anchor-linked cards match four h2 sections, in order.
  // Card's own title also renders as h2 (headingLevel="h2", matching
  // PeopleGrid's precedent) so axe's heading-order check has no h1->h3 skip
  // to flag --- so "section h2" below excludes headings inside a .at-card.
  it("matches /policies/'s four cards to its four h2 sections", () => {
    const main = parse(resolve(DIST, "policies/index.html")).querySelector("#main")!;

    const cards = [...main.querySelectorAll(".at-card")];
    expect(cards.length, "expected exactly four .at-card elements").toBe(4);
    for (const card of cards) {
      expect(card.getAttribute("href"), "card href should be an in-page anchor").toMatch(/^#/);
    }

    const sectionHeadings = [...main.querySelectorAll("h2")].filter((h) => !h.closest(".at-card"));
    expect(sectionHeadings.length, "expected exactly four section h2s").toBe(4);

    // rehype-autolink-headings appends a decorative "#" anchor inside each
    // heading, so text is read the same way page-index.ts reads it.
    const headingText = (heading: Element) => {
      const clone = heading.cloneNode(true) as Element;
      clone.querySelector(".at-heading-anchor")?.remove();
      return clone.textContent?.trim();
    };

    const cardTitles = cards.map((card) => card.querySelector(".at-card-title")?.textContent?.trim());
    expect(cardTitles).toEqual(sectionHeadings.map(headingText));
  });
});
