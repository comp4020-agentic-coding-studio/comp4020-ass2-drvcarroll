---
title: Command, control & communication
description:
  Week 8 — how malware talks back to its operator, and what happens when
  the server on the other end gets switched off
week: 8
date: 2027-09-28
teachers:
  - ivan-sidorov
lecture: week-08
lab: lab-07
assignment: assignment-1
spec:
  - your simulator reproduces the request/response pattern you analysed
  - Assignment 1 is submitted before this week's deadline passes
---

Static malware has limited usefulness. This session covers the channel that
lets an operator task, update and collect from a running implant — and the
single point of failure that channel creates.

## Before the session

Assignment 1 is due at the end of this week — leave time to finish it
alongside the lab.

## In the session

The lecture covers the basic C2 model, channel types (direct, DGA,
legitimate-service abuse), protocol choices and the resilience techniques
that keep a channel reachable, closing on what actually happens to a
campaign once its server is switched off. Lab 7 then has you analyse
captured, benign C2-style traffic and build a simple simulator that
reproduces its request/response pattern.

## Afterwards

Assignment 1's design document — purpose, target, architecture, lifecycle,
persistence, communication, detection risks, operational requirements — is
due. With production covered end to end, the remaining weeks turn to how
defenders find and understand what you've built.
