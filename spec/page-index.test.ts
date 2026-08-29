// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { buildPageIndex } from "../src/lib/page-index";

function docWith(mainHtml: string): Document {
  document.body.innerHTML = `<main id="main">${mainHtml}</main>`;
  return document;
}

describe("buildPageIndex", () => {
  it("excludes h1 and captures h2/h3 in document order", () => {
    const doc = docWith(`
      <h1 id="title">Title</h1>
      <h2 id="first">First</h2>
      <h3 id="first-a">First A</h3>
      <h2 id="second">Second</h2>
    `);

    expect(buildPageIndex(doc)).toEqual([
      { id: "first", text: "First", level: 2 },
      { id: "first-a", text: "First A", level: 3 },
      { id: "second", text: "Second", level: 2 },
    ]);
  });

  it("reads an existing id rather than inventing one", () => {
    const doc = docWith(`<h2>No id here</h2>`);

    expect(buildPageIndex(doc)).toEqual([{ id: "", text: "No id here", level: 2 }]);
  });

  it("strips the decorative heading-anchor permalink from the text", () => {
    const doc = docWith(
      `<h2 id="section">Section<a class="at-heading-anchor" aria-hidden="true" tabindex="-1">#</a></h2>`,
    );

    expect(buildPageIndex(doc)).toEqual([{ id: "section", text: "Section", level: 2 }]);
  });

  it("only reads headings inside #main", () => {
    document.body.innerHTML = `
      <h2 id="outside">Outside main</h2>
      <main id="main"><h2 id="inside">Inside main</h2></main>
    `;

    expect(buildPageIndex(document)).toEqual([{ id: "inside", text: "Inside main", level: 2 }]);
  });

  it("returns an empty array for a page with no h2/h3", () => {
    const doc = docWith(`<h1 id="title">Title</h1><p>Just prose.</p>`);

    expect(buildPageIndex(doc)).toEqual([]);
  });

  it("returns an empty array with no #main at all", () => {
    document.body.innerHTML = `<h2 id="stray">Stray</h2>`;

    expect(buildPageIndex(document)).toEqual([]);
  });
});
