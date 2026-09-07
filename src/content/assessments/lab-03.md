---
title: "Lab 3: Execution Laboratory"
description:
  Trigger benign programs by different execution mechanisms and read the
  traces those triggers leave behind.
week: 4
due: 2027-08-17T17:00:00+10:00
# 2% (10 labs x 2% = 20% of course total; BUILD_PLAN.md D24).
weight: 2
brief: >
  Run benign programs under different execution triggers and analyse the
  execution traces each trigger produces.
submissionItems:
  - A record of each trigger tested and the execution trace it produced
  - A short analysis of what evidence each trigger leaves behind
marking:
  mode: holistic
  description:
    Assessed on whether the analysis connects execution conditions to the
    behaviour and evidence they produce, not just the traces themselves.
keyDates:
  - label: Submission due
    date: 2027-08-17T17:00:00+10:00
spec:
  - submitted by the deadline, in the format named below
  - connects each execution trigger tested to the trace evidence it leaves
---

An architecture on paper still has to run somewhere. This lab is about
that step: how code actually gets executed, the range of triggers and
execution environments available to it, and the perennial problem every
piece of software (malicious or not) has to solve — how does this thing
actually start?

Working with benign programs only, students trigger execution through
different mechanisms and read the resulting traces, building an
understanding of how the choice of trigger shapes both behaviour and the
evidence that behaviour leaves for an investigator to find later.
