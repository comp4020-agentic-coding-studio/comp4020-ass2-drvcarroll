---
title: Execution
description:
  Week 4 covers how malicious software gets code to run at all, and the
  traces every execution method leaves behind.
week: 4
date: 2027-08-17
teachers:
  - fulan-al-fulani
  - marcus-whitfield
lecture: week-04
lab: lab-03
related:
  - sessions/10-session
spec:
  - you have triggered your benign program under at least two different
    execution mechanisms
  - you can point to the trace each trigger left behind
---

Code that never executes is irrelevant, however carefully it was designed.
This session addresses the problem every campaign must eventually solve:
how a piece of software actually begins to run.

## Before the session

No preparation is required beyond Week 3's blueprint. Lab 3 works from a set
of prepared benign programs rather than the student's own architecture.

## In the session

The lecture surveys execution contexts (user-launched processes, scheduled
tasks, document macros and plugins), the environment checks malware
typically performs before committing to run, and the triggers that
determine when execution actually fires. Lab 3 then has students run benign
programs under a range of different triggers and capture the execution
traces each one produces, including process trees, file-system changes and
network connections, in order to see directly what evidence a defender is
given at no additional cost.

## Afterwards

Students should be able to state, for any trigger tested, what a defender
would have observed and how quickly. Infiltration, the question of how a
program reaches a target environment in the first place, is the following
week's subject.
