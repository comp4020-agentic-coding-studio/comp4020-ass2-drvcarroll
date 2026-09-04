// Step 18 (D18): dev-server equivalent of heading-ids.ts's build:done hook
// --- pnpm dev never runs that hook, so PageIndex's inert-fallback path was
// still live there. Same fillMissingIds (via patchHtmlResponse), applied to
// every HTML response Astro's on-demand rendering produces.
import { defineMiddleware } from "astro:middleware";
import { patchHtmlResponse } from "./lib/html-middleware";

export const onRequest = defineMiddleware((_context, next) => patchHtmlResponse(next));
