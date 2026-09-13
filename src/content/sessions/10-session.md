---
title: Detection & evasion
description:
  Week 10 covers how defenders identify malware, and why authors design
  around being noticed.
week: 10
date: 2027-10-12
teachers:
  - ivan-sidorov
  - anastasia-rusakova
lecture: week-10
lab: lab-09
spec:
  - your revised detection rules reduce at least one false positive or
    false negative from the originals
  - you can explain why the change worked
---

Detection and evasion form a continuous contest rather than a problem
solved once by either side. This session examines both halves of that
contest.

## Before the session

No preparation is required. Lab 9 provides a starting set of detection
rules to test.

## In the session

The lecture covers signature-based detection, which is precise but brittle
against variation, and behavioural detection, which is more general but
noisier, before turning to the evasion goals an author designs toward and
why ignoring detection ultimately renders a campaign ineffective. Lab 9
then asks students to test signature-based and behavioural rules against
benign simulated malware behaviours, and to improve those rules where they
miss or over-trigger.

## Afterwards

Students should be able to justify each rule change against a measured
false positive or false negative it corrected. Operational security, the
failures that end campaigns even when the technical work holds up, is the
following week's subject.
