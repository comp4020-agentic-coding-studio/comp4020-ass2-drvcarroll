---
title: From idea to threat model
description:
  The second session, where a motive becomes a threat model, and the
  malware development lifecycle gets its first outing
week: 2
date: 2027-08-03
teachers:
  - fulan-al-fulani
  - marcus-whitfield
lecture: week-02
lab: lab-01
related:
  - sessions/03-session
  - assessments/assignment-1
spec:
  - you can state the fictional scenario's motivation and constraints in
    one sentence
  - your threat model names the target, the assets at risk and the
    attacker's likely capability
---

Every piece of malware begins as an idea operating under constraints. This
session turns that idea into the semester's first structured artefact: a
threat model.

## Before the session

Students should read the lecture's account of the four common motivations
(financial, espionage, disruption and ideological) so that they can identify
which one is driving Lab 1's fictional scenario before attempting to model
it.

## In the session

The lecture traces the malware development lifecycle end to end, from idea
through design, implementation, testing, deployment and maintenance, before
turning to the anatomy of a malicious program: its loader, payload,
persistence mechanism, communication channel and configuration. Lab 1 then
supplies a fictional scenario for students to analyse into precisely that
shape, producing a lifecycle and a threat model that name who is targeted,
what is at stake for them, and what capability the attacker is assumed to
have.

## Afterwards

Lab 1 is marked on whether the resulting model is well structured, not on
how imaginative the underlying scenario is. Students should retain their
threat model afterward, since Week 3's architectural blueprint is built
directly on top of it.
