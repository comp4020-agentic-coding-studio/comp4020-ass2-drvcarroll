import { defineSiteConfig } from "astro-theme-university/types";
import { withBase } from "astro-theme-university/url";
import { slopBranding } from "astro-theme-slop";
import { courseMeta } from "./course-config";

// The underlying collection and URL remain `sessions`; these labels are the
// language students see. Change them to Studios, Tutorials, Expeditions, etc.
export const sessionLabels = {
  singular: "Session",
  plural: "Sessions",
} as const;

export const graphCollections = ["sessions", "assessments", "lectures", "people"];

export const courseApiCollections = [
  ...graphCollections.map((key) => ({ key })),
  { key: "policies", dir: "pages/policies" },
];

export const siteConfig = defineSiteConfig({
  ...slopBranding,
  name: "Slop University",

  // Overview duplicates the wordmark's own link under a discoverable
  // label; Timeline joins now that /timeline/ exists (Step 6).
  links: [
    { text: "Overview", href: withBase("/") },
    { text: "Timeline", href: withBase("/timeline/") },
    { text: "People", href: withBase("/people/") },
    { text: "Policies", href: withBase("/policies/") },
  ],

  // Generic placeholder: no real institution or place is decided yet.
  acknowledgement: {
    title: "Acknowledgement of Country",
    text: "Slop University acknowledges the Traditional Owners of the land on which it operates, and pays respect to their Elders past and present.",
  },

  licence: "CC-BY-NC-SA-4.0",
  socialImage: "/src/assets/images/overview_background.jpg",
  socialImageAlt: `A preview card for ${courseMeta.code}: ${courseMeta.title}`,
});
