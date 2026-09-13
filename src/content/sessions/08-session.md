---
title: Command, control & communication
description:
  Week 8 covers how malware talks back to its operator, and what happens
  when the server on the other end gets switched off
week: 8
date: 2027-09-28
teachers:
  - ivan-sidorov
  - anastasia-rusakova
lecture: week-08
lab: lab-07
assignment: assignment-1
spec:
  - your simulator reproduces the request/response pattern you analysed
  - Assignment 1 is submitted before this week's deadline passes
---

Static malware has limited usefulness on its own. This session covers the
channel that allows an operator to task, update and collect from a running
implant, and the single point of failure that channel introduces.

## Before the session

Assignment 1 is due at the end of this week. Students should allow
sufficient time to complete it alongside the laboratory exercise.

## In the session

The lecture covers the basic command-and-control model, channel types
(direct connections, domain generation algorithms, and abuse of legitimate
services), protocol choices, and the resilience techniques that keep a
channel reachable, closing with an account of what happens to a campaign
once its server is switched off. Lab 7 then asks students to analyse
captured, benign command-and-control-style traffic and build a simple
simulator that reproduces its request and response pattern.

## Afterwards

Assignment 1's design document, covering purpose, target, architecture,
lifecycle, persistence, communication, detection risks and operational
requirements, is due at the end of this week. With production covered from
end to end, the remaining weeks turn to how defenders find and interpret
what has been built.
