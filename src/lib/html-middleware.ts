// Step 18 (D18): the actual response-patching logic, kept free of any
// "astro:middleware" import so it is plain-importable under vitest (that
// virtual module only resolves inside Astro's own vite pipeline).
import { JSDOM } from "jsdom";
import { fillMissingIds } from "./heading-ids";

/** Matches Astro's MiddlewareNext shape, without importing astro:middleware. */
export type NextFn = () => Promise<Response>;

/** Runs fillMissingIds over any text/html response; other responses pass through. */
export async function patchHtmlResponse(next: NextFn): Promise<Response> {
  const response = await next();

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return response;

  const html = await response.text();
  const dom = new JSDOM(html);
  if (!fillMissingIds(dom.window.document)) {
    // Nothing missing: pass the original body through untouched.
    return new Response(html, { status: response.status, headers: response.headers });
  }

  // Body length changed; drop the stale content-length, let it be recomputed.
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(dom.serialize(), { status: response.status, headers });
}
