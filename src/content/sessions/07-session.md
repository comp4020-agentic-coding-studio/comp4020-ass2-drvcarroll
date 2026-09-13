---
title: Distribution
description:
  Week 7 covers getting malware from creator to targets at scale,
  alongside a mid-semester retrospective and assessment discussion
week: 7
date: 2027-09-21
teachers:
  - ivan-sidorov
  - anastasia-rusakova
lecture: week-07
lab: lab-06
related:
  - sessions/08-session
spec:
  - your distribution design names at least one delivery mechanism and one
    failure point
  - you can say what happens to your design if one server is taken down
---

Three weeks separate this session from Week 6, owing to the mid-semester
break. The course returns here to a larger question: persistence on a
single host is a local concern, but a campaign requires the software to
reach many hosts at once.

## Before the session

Nothing further needs to be brought beyond what Weeks 2 through 6
established. The lecture opens with a retrospective on that material before
proceeding.

## In the session

The lecture covers distribution chains (build, staging, delivery and
targets), delivery mechanisms, and the trade-off between reliability and
stealth that scaling an operation entails, before pausing for a
mid-semester checkpoint and a reminder of Assignment 1's brief. Lab 6 then
asks students to design and analyse a simulated distribution infrastructure
for a fictional campaign, naming its costs, dependencies and failure
points.

## Afterwards

Students should be able to state how their distribution design absorbs the
loss of a single server. Command and control, the question of how malware
communicates with its operator once delivered, is the following week's
subject.
