---
title: Malware analysis
description:
  Week 9 — static and dynamic analysis, and reconstructing what a sample
  was intended to do
week: 9
date: 2027-10-05
teachers:
  - fulan-al-fulani
lecture: week-09
lab: lab-08
spec:
  - your investigation separates what the sample actually did from what
    you inferred it was capable of
  - you can name at least two indicators of compromise your analysis
    produced
---

The course now turns from building to investigating. This session is about
reading a sample's behaviour back out of it, without knowing its source.

## Before the session

Nothing to bring — Lab 8 supplies a deliberately benign sample for you to
analyse from scratch.

## In the session

The lecture contrasts static analysis (structure, strings, disassembly,
safe but limited by obfuscation) with dynamic analysis (observed behaviour
under execution, richer but riskier), then covers indicators of compromise
and the inference gap between what a sample did and what it was built to
do. Lab 8 then has you apply both techniques to a benign sample and produce
an investigation that clearly separates fact from inference.

## Afterwards

Keep your notes precise about what was observed versus inferred — that
distinction is exactly what Week 10's detection rules and Week 11's
attribution work will lean on.
