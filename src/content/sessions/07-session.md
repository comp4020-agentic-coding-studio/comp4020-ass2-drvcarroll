---
title: Distribution
description:
  Week 7 — getting malware from creator to targets at scale, alongside a
  mid-semester retrospective and assessment discussion
week: 7
date: 2027-09-21
teachers:
  - fulan-al-fulani
lecture: week-07
lab: lab-06
spec:
  - your distribution design names at least one delivery mechanism and one
    failure point
  - you can say what happens to your design if one server is taken down
---

Three weeks separate this session from Week 6 — the mid-semester break. It
returns to a bigger question: persistence on one host is local, but a
campaign needs the software on many.

## Before the session

Nothing to bring beyond what Weeks 2–6 covered. The lecture opens with a
retrospective on that lifecycle before moving on.

## In the session

The lecture covers distribution chains (build, staging, delivery, targets),
delivery mechanisms and the reliability-versus-stealth trade-off in scaling
an operation, then pauses for a mid-semester checkpoint and a reminder of
Assignment 1's brief. Lab 6 then has you design and analyse a simulated
distribution infrastructure for a fictional campaign, naming its costs,
dependencies and failure points.

## Afterwards

You should be able to say how your distribution design absorbs the loss of
a single server. Command and control — how the malware talks back once
delivered — is next.
