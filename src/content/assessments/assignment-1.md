---
title: "Assignment 1: My First Malware"
description:
  A fictional piece of malware, designed end to end and documented as a
  complete engineering artefact rather than a single hacking trick.
week: 8
# End of Week 8 (D24): Week 7 slide 12 is an "Assessment 1 Reminder", so
# the due date is not yet passed by Week 7 — placed shortly after.
due: 2027-10-01T17:00:00+10:00
weight: 20
brief: >
  Design a fictional piece of malware and document it as a complete
  engineering artefact, from its purpose down to its operational
  requirements.
submissionItems:
  - A design document naming the malware's purpose and target
  - Its architecture and infection lifecycle
  - Its persistence strategy and communication model
  - An assessment of its detection risks and operational requirements
marking:
  mode: holistic
  description:
    Assessed on whether the eight required elements cohere as one design
    rather than eight separate answers, and whether the design is honest
    about its own detection risks rather than only its capabilities.
keyDates:
  - label: Submission due
    date: 2027-10-01T17:00:00+10:00
spec:
  - submitted by the deadline, in the format named below
  - covers purpose, target, architecture, infection lifecycle, persistence
    strategy, communication model, detection risks and operational
    requirements
  - the eight elements read as one coherent design, not eight unrelated
    answers to eight prompts
---

By Week 8, the course has covered enough of the production lifecycle —
architecture, execution, infiltration, persistence — for a design to stand
on its own. This assignment asks for exactly that: a fictional piece of
malware, invented from scratch and documented the way a real engineering
team would document a system before building it.

The design has eight required parts: purpose, target, architecture,
infection lifecycle, persistence strategy, communication model, detection
risks and operational requirements. None of these is optional, and none is
graded alone — the point of the assignment is that they constrain each
other. A target chosen for its data value implies an architecture that
protects that data in transit; a persistence strategy implies a set of
detection risks the design has to answer for, not ignore. A response that
treats the eight sections as eight unrelated short-answer questions has
missed what the assignment is testing.

As with every practical exercise in this course, the artefact is a
document, not working software: the malware described here is never built
or deployed, only designed and reasoned about.
