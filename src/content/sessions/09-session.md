---
title: Malware analysis
description:
  Week 9 covers static and dynamic analysis, and reconstructing what a
  sample was intended to do
week: 9
date: 2027-10-05
teachers:
  - ivan-sidorov
  - anastasia-rusakova
lecture: week-09
lab: lab-08
spec:
  - your investigation separates what the sample actually did from what
    you inferred it was capable of
  - you can name at least two indicators of compromise your analysis
    produced
---

The course now turns from building malware to investigating it. This
session concerns reading a sample's behaviour back out of it without prior
knowledge of its source.

## Before the session

No preparation is required. Lab 8 supplies a deliberately benign sample for
students to analyse from scratch.

## In the session

The lecture contrasts static analysis, which examines structure, strings
and disassembly and is safe but limited by obfuscation, with dynamic
analysis, which observes behaviour under execution and is richer but
riskier to perform. It then covers indicators of compromise and the
inferential gap between what a sample did and what it was built to do. Lab
8 asks students to apply both techniques to a benign sample and produce an
investigation that clearly separates observed fact from inference.

## Afterwards

Students should keep their notes precise about what was directly observed
as distinct from what was inferred, since that same distinction underpins
Week 10's detection rules and Week 11's attribution work.
