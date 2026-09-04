import { describe, expect, it } from "vitest";
import { patchHtmlResponse } from "../src/lib/html-middleware";

function htmlResponse(body: string): Response {
  return new Response(body, { headers: { "content-type": "text/html; charset=utf-8" } });
}

describe("patchHtmlResponse", () => {
  it("fills a missing heading id in an html response", async () => {
    const body = `<html><body><main id="main"><h2>No Id Here</h2></main></body></html>`;
    const response = await patchHtmlResponse(async () => htmlResponse(body));
    const text = await response.text();
    expect(text).toContain('<h2 id="no-id-here">No Id Here</h2>');
  });

  it("passes a non-html response through byte-identical", async () => {
    const original = new Response("{}", { headers: { "content-type": "application/json" } });
    const response = await patchHtmlResponse(async () => original);
    expect(response).toBe(original);
    expect(await response.text()).toBe("{}");
  });

  it("leaves an html response with no missing ids untouched", async () => {
    const body = `<html><body><main id="main"><h2 id="already">Already</h2></main></body></html>`;
    const response = await patchHtmlResponse(async () => htmlResponse(body));
    expect(await response.text()).toBe(body);
  });
});
