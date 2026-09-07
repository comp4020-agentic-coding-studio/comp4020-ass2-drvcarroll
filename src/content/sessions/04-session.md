---
title: Execution
description:
  Week 4 — how malicious software gets code to run at all, and the traces
  every execution method leaves behind
week: 4
date: 2027-08-17
teachers:
  - ivan-sidorov
lecture: week-04
lab: lab-03
spec:
  - you have triggered your benign program under at least two different
    execution mechanisms
  - you can point to the trace each trigger left behind
---

Code that never executes is irrelevant, however well it was designed. This
session is about the "how do I actually start?" problem every campaign has
to solve.

## Before the session

No preparation beyond Week 3's blueprint — Lab 3 uses prepared benign
programs, not your own architecture.

## In the session

The lecture works through execution contexts (user-launched, scheduled,
document macros, plugins), the environment checks malware runs before
committing to execute, and the triggers that decide when it fires. Lab 3
then has you run benign programs under different triggers and capture the
execution traces each one produces — process trees, file changes, network
connections — so you can see what evidence a defender gets for free.

## Afterwards

You should be able to say, for any trigger you tested, what a defender would
have seen and how quickly. Infiltration — getting the program onto a target
in the first place — is next.
