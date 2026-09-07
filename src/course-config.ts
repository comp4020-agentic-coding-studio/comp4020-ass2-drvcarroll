import type { CourseMetaInput } from "astro-course-university";
import { z } from "astro/zod";

// The level digits ANU uses: 1000--4000 undergraduate, 6000 and 8000
// postgraduate. Both the code pattern and the level field derive from this.
const LEVELS = [1, 2, 3, 4, 6, 8] as const;
const allowedCode = new RegExp(`^SLOP[${LEVELS.join("")}]\\d{3}$`);

export const slopCourseMetaSchema = z
  .strictObject({
    code: z.string().regex(allowedCode, {
      message: "use SLOP plus a 1000–4000, 6000 or 8000 level code",
    }),
    title: z.string().trim().min(1).max(100),
    session: z.string().trim().min(1).max(40),
    year: z.number().int().min(2026).max(2200),
    level: z.literal(LEVELS),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    description: z.string().trim().min(80).max(300),
    tags: z.array(z.string().trim().min(2).max(24)).min(1).max(3),
  })
  .superRefine((course, ctx) => {
    const codeLevel = Number(course.code.at(4));
    if (course.level !== codeLevel) {
      ctx.addIssue({
        code: "custom",
        path: ["level"],
        message: `must match ${course.code}'s first digit (${codeLevel})`,
      });
    }
    if (course.startDate > course.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "must not be after endDate",
      });
    }
  });

// The single source of truth for the course record. The generated homepage,
// navigation label and /api/index.json all read this object.
//
// The code's last three digits were assigned to this repo when it was
// provisioned (see BUILD_PLAN.md D20); `000` is ours, kept, with the level
// digit set to match SLOP4xxx's own materials (CONTENT.md).
export const courseMeta = slopCourseMetaSchema.parse({
  code: "SLOP4000",
  title: "Introduction to Malware Production",
  // Jul-Oct teaching matches ANU's Semester 2, not Semester 1 (Feb-Jun).
  session: "Semester 2",
  year: 2027,
  level: 4,
  startDate: "2027-07-27",
  // Teaching runs to 26 Oct (D21); this end-of-exam-period date is
  // provisional until Step 24 fixes the real Final Examination date.
  endDate: "2027-11-12",
  description:
    "A course that teaches students how to make and produce malware, " +
    "treated with deadpan seriousness despite its farcical premise: " +
    "hostile software as engineering, tracing the production lifecycle " +
    "from idea to operational use, with practical work confined to " +
    "benign samples and simulated environments.",
  tags: ["malware", "software-engineering", "security"],
}) satisfies CourseMetaInput;
